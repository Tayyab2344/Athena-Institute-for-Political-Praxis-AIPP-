import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const RATE_LIMIT_SALT = process.env.RATE_LIMIT_SALT || "aipp_security_privacy_salt_2026";

/**
 * Validate that an extracted string is a valid IPv4 or IPv6 address.
 */
function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== "string") return false;
  // Basic IPv4 check: 4 octets 0-255
  const ipv4Regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/;
  if (ipv4Regex.test(ip)) return true;

  // IPv6 check: hex groups separated by colons
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$/;
  if (ipv6Regex.test(ip)) return true;

  return false;
}

/**
 * Extract client IP address based on established trusted reverse proxy topology.
 *
 * Security Rules:
 * 1. If TRUSTED_PROXY_HEADER is configured (e.g. 'cf-connecting-ip', 'x-real-ip', 'x-vercel-forwarded-for'),
 *    ONLY that sanitized header is trusted.
 * 2. Arbitrary client-provided X-Forwarded-For headers are never trusted blindly.
 * 3. In production without a designated proxy header, multi-hop proxy chains read the rightmost IP
 *    (TRUSTED_PROXY_HOPS) rather than the client-spoofable leftmost IP.
 */
export function getClientIp(request: Request): string {
  const trustedHeader = process.env.TRUSTED_PROXY_HEADER?.toLowerCase();

  // 1. Explicit designated trusted proxy header
  if (trustedHeader) {
    const rawValue = request.headers.get(trustedHeader);
    if (rawValue) {
      const candidate = rawValue.split(",")[0].trim();
      if (isValidIp(candidate)) {
        return candidate;
      }
    }
    // If designated trusted header is missing or malformed, do not fall back to client headers
    return "untrusted_proxy_connection";
  }

  // 2. Cloudflare Edge: If deployed behind Cloudflare without explicit TRUSTED_PROXY_HEADER set,
  // check cf-connecting-ip only if present and valid
  const cfConnectingIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfConnectingIp && isValidIp(cfConnectingIp)) {
    return cfConnectingIp;
  }

  // 3. Vercel / AWS Lambda / Nginx: Check x-real-ip if present and valid
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && isValidIp(realIp)) {
    return realIp;
  }

  // 4. Standard proxy chain (X-Forwarded-For):
  // When multiple reverse proxies exist, the rightmost IP before the application hop is the one
  // appended by the immediate upstream proxy. Leftmost can be client-forged.
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((s) => s.trim()).filter(Boolean);
    const hops = Math.max(1, parseInt(process.env.TRUSTED_PROXY_HOPS || "1", 10));
    const trustedIndex = Math.max(0, ips.length - hops);
    const candidate = ips[trustedIndex];
    if (candidate && isValidIp(candidate)) {
      return candidate;
    }
  }

  // 5. In local development, fall back to localhost
  if (process.env.NODE_ENV !== "production") {
    return "127.0.0.1";
  }

  return "direct_connection";
}

/**
 * Produce a privacy-conscious one-way hash of client identifier + salt.
 * Ensures raw IP addresses are never persisted in the database.
 */
export function hashClientIdentifier(identifier: string): string {
  return crypto
    .createHash("sha256")
    .update(`${identifier}:${RATE_LIMIT_SALT}`)
    .digest("hex");
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
  points?: number;
}

/**
 * Atomic PostgreSQL rate limiter for serverless and multi-instance deployments.
 * Uses a single atomic INSERT ... ON CONFLICT DO UPDATE RETURNING query to eliminate
 * Time-of-Check to Time-of-Use (TOCTOU) concurrency race conditions.
 */
export async function checkRateLimit(
  key: string,
  maxPoints: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const keyHash = crypto
    .createHash("sha256")
    .update(`rl:${key}:${RATE_LIMIT_SALT}`)
    .digest("hex");

  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);
  const id = crypto.randomUUID();

  try {
    const result = await prisma.$queryRaw<Array<{ points: number; expiresAt: Date }>>`
      INSERT INTO "RateLimitRecord" ("id", "keyHash", "points", "expiresAt", "createdAt", "updatedAt")
      VALUES (${id}, ${keyHash}, 1, ${expiresAt}, ${now}, ${now})
      ON CONFLICT ("keyHash")
      DO UPDATE SET
        "points" = CASE
          WHEN "RateLimitRecord"."expiresAt" <= ${now} THEN 1
          ELSE "RateLimitRecord"."points" + 1
        END,
        "expiresAt" = CASE
          WHEN "RateLimitRecord"."expiresAt" <= ${now} THEN ${expiresAt}
          ELSE "RateLimitRecord"."expiresAt"
        END,
        "updatedAt" = ${now}
      RETURNING "points", "expiresAt";
    `;

    if (!result || result.length === 0) {
      return { allowed: false, remaining: 0, retryAfterSeconds: windowSeconds };
    }

    const row = result[0];
    const points = Number(row.points);
    const recordExpiresAt = new Date(row.expiresAt);
    const allowed = points <= maxPoints;
    const remaining = Math.max(0, maxPoints - points);
    const retryAfterSeconds = Math.max(1, Math.ceil((recordExpiresAt.getTime() - now.getTime()) / 1000));

    return {
      allowed,
      remaining,
      retryAfterSeconds: allowed ? undefined : retryAfterSeconds,
      points,
    };
  } catch (error) {
    console.error("[Atomic Rate Limiter Error]:", error);
    // In event of database communication failure, do not completely block legitimate traffic
    return {
      allowed: true,
      remaining: 1,
    };
  }
}
