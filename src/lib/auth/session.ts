import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AdminRole, AdminStatus, AdminUser, AdminSession } from "@prisma/client";

export const SESSION_COOKIE_NAME = "aipp_admin_session";
export const SESSION_DURATION_HOURS = 12;
export const SESSION_DURATION_MS = SESSION_DURATION_HOURS * 60 * 60 * 1000;

export interface SafeAdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export function toSafeUser(user: AdminUser): SafeAdminUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

/**
 * Generate a cryptographically secure random session token.
 * 256 bits of entropy (32 random bytes), URL-safe.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/**
 * Hash a raw session token using SHA-256 before database lookup/storage.
 */
export function hashSessionToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Create a new database-backed admin session.
 * Stores only the SHA-256 tokenHash in PostgreSQL.
 * Returns the raw token for the browser's HttpOnly cookie.
 */
export async function createAdminSession(adminUserId: string): Promise<{
  rawToken: string;
  expiresAt: Date;
  session: AdminSession;
}> {
  const rawToken = generateSessionToken();
  const tokenHash = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const session = await prisma.adminSession.create({
    data: {
      tokenHash,
      adminUserId,
      expiresAt,
    },
  });

  return { rawToken, expiresAt, session };
}

/**
 * Validate a raw session token against PostgreSQL.
 * Verifies:
 * 1. Token exists and is not revoked.
 * 2. Token has not expired.
 * 3. Associated AdminUser is ACTIVE and not locked.
 * Periodically touches lastSeenAt.
 */
export async function validateAdminSession(rawToken: string): Promise<{
  user: SafeAdminUser;
  session: AdminSession;
} | null> {
  if (!rawToken || typeof rawToken !== "string" || rawToken.length < 16) {
    return null;
  }

  const tokenHash = hashSessionToken(rawToken);

  try {
    const session = await prisma.adminSession.findUnique({
      where: { tokenHash },
      include: { adminUser: true },
    });

    if (!session) {
      return null;
    }

    // Check if session was revoked
    if (session.revokedAt !== null) {
      return null;
    }

    // Check if session has expired
    const now = new Date();
    if (session.expiresAt <= now) {
      return null;
    }

    const user = session.adminUser;

    // Check if user account is suspended
    if (user.status !== AdminStatus.ACTIVE) {
      return null;
    }

    // Check if user account is temporarily locked
    if (user.lockedUntil && user.lockedUntil > now) {
      return null;
    }

    // Update lastSeenAt asynchronously if more than 5 minutes since last update
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    if (!session.lastSeenAt || session.lastSeenAt < fiveMinutesAgo) {
      prisma.adminSession.update({
        where: { id: session.id },
        data: { lastSeenAt: now },
      }).catch(() => {});
    }

    return {
      user: toSafeUser(user),
      session,
    };
  } catch (error) {
    console.error("[Session Validation Error]:", error);
    return null;
  }
}

/**
 * Revoke a single session in PostgreSQL.
 */
export async function revokeAdminSession(rawToken: string): Promise<boolean> {
  if (!rawToken) return false;
  const tokenHash = hashSessionToken(rawToken);

  try {
    const result = await prisma.adminSession.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return result.count > 0;
  } catch (error) {
    console.error("[Session Revocation Error]:", error);
    return false;
  }
}

/**
 * Revoke all active sessions for a user (e.g., password change or suspension).
 */
export async function revokeAllUserSessions(adminUserId: string): Promise<void> {
  try {
    await prisma.adminSession.updateMany({
      where: { adminUserId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  } catch (error) {
    console.error("[Revoke All Sessions Error]:", error);
  }
}

/**
 * Extract and validate session from standard Next.js request headers/cookies.
 */
export async function getAdminSessionFromRequest(
  request: Request
): Promise<{ user: SafeAdminUser; session: AdminSession } | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
  const rawToken = match ? decodeURIComponent(match[1]) : null;

  if (!rawToken) {
    return null;
  }

  return validateAdminSession(rawToken);
}

/**
 * Server Component / Server Action helper to read session via next/headers cookies().
 */
export async function getAdminSessionFromCookies(): Promise<{
  user: SafeAdminUser;
  session: AdminSession;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return validateAdminSession(token);
  } catch {
    return null;
  }
}

/**
 * Cookie attributes conforming to strict security standards.
 */
export function getSessionCookieOptions(expiresAt: Date) {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}

/**
 * Helper to set session cookie on an outgoing NextResponse.
 */
export function setSessionCookie(
  response: NextResponse,
  rawToken: string,
  expiresAt: Date
): void {
  const options = getSessionCookieOptions(expiresAt);
  response.cookies.set(options.name, rawToken, options);
}

/**
 * Helper to clear the session cookie on an outgoing NextResponse.
 */
export function clearSessionCookie(response: NextResponse): void {
  const isProduction = process.env.NODE_ENV === "production";
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
}

