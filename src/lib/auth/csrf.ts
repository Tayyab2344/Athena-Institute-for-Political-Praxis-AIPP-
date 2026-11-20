import { NextResponse } from "next/server";

/**
 * Retrieve the set of canonical trusted origins for the application.
 * Configured via APP_URL (e.g. 'https://aipp-praxis.org') or ALLOWED_ORIGINS.
 */
export function getTrustedOrigins(requestHost?: string | null): Set<string> {
  const trusted = new Set<string>();

  // 1. Explicit canonical APP_URL
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      const parsed = new URL(appUrl);
      trusted.add(parsed.origin.toLowerCase());
    } catch {
      console.warn("[CSRF Warning]: Invalid APP_URL configured:", appUrl);
    }
  }

  // 2. Explicit ALLOWED_ORIGINS comma-separated list
  const allowedList = process.env.ALLOWED_ORIGINS;
  if (allowedList) {
    for (const item of allowedList.split(",")) {
      const trimmed = item.trim();
      if (trimmed) {
        try {
          const parsed = new URL(trimmed);
          trusted.add(parsed.origin.toLowerCase());
        } catch {
          // Ignore invalid URL entries
        }
      }
    }
  }

  // 3. Loopback / Localhost Development & Testing Support
  if (requestHost) {
    const hostLower = requestHost.toLowerCase();
    if (
      hostLower.startsWith("localhost") ||
      hostLower.startsWith("127.0.0.1") ||
      hostLower.startsWith("[::1]")
    ) {
      trusted.add(`http://${hostLower}`);
      trusted.add(`https://${hostLower}`);
    }
  }

  return trusted;
}

/**
 * Check whether a given origin string matches trusted application origins.
 */
function isOriginTrusted(originUrl: URL, requestHost: string | null): boolean {
  const normalizedOrigin = originUrl.origin.toLowerCase();
  const trustedSet = getTrustedOrigins(requestHost);

  if (trustedSet.has(normalizedOrigin)) {
    return true;
  }

  // If request is specifically on localhost / loopback
  const hostname = originUrl.hostname.toLowerCase();
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") {
    return true;
  }

  // If no canonical APP_URL is configured, compare host with requestHost (HTTPS required in prod)
  if (requestHost && trustedSet.size === 0) {
    const isDev = process.env.NODE_ENV !== "production";
    const allowedSchemes = isDev ? ["http:", "https:"] : ["https:"];
    if (
      allowedSchemes.includes(originUrl.protocol) &&
      originUrl.host.toLowerCase() === requestHost.toLowerCase()
    ) {
      return true;
    }
  }

  return false;
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
};

/**
 * Validate that state-changing requests originate from a trusted application origin.
 * Defends against Cross-Site Request Forgery (CSRF).
 */
export function validateRequestOrigin(request: Request): {
  valid: boolean;
  response?: NextResponse;
} {
  const method = request.method.toUpperCase();
  // Safe HTTP methods do not mutate state
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return { valid: true };
  }

  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Host header is mandatory for HTTP/1.1 and HTTP/2
  if (!host || host.trim().length === 0) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: "Invalid or missing Host header." },
        { status: 400, headers: NO_CACHE_HEADERS }
      ),
    };
  }

  // 1. Reject requests where BOTH Origin and Referer are missing
  if (!origin && !referer) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: "Missing origin and referer headers. State-changing requests must supply origin." },
        { status: 403, headers: NO_CACHE_HEADERS }
      ),
    };
  }

  // 2. Validate Origin if provided
  if (origin) {
    // Explicitly reject null origins (sandboxed iframes, data URIs)
    if (origin === "null" || origin.toLowerCase() === "null") {
      return {
        valid: false,
        response: NextResponse.json(
          { error: "Null origin is forbidden." },
          { status: 403, headers: NO_CACHE_HEADERS }
        ),
      };
    }

    let originUrl: URL;
    try {
      originUrl = new URL(origin);
    } catch {
      return {
        valid: false,
        response: NextResponse.json(
          { error: "Malformed Origin header." },
          { status: 400, headers: NO_CACHE_HEADERS }
        ),
      };
    }

    if (!isOriginTrusted(originUrl, host)) {
      return {
        valid: false,
        response: NextResponse.json(
          { error: "Cross-origin mutation forbidden." },
          { status: 403, headers: NO_CACHE_HEADERS }
        ),
      };
    }

    return { valid: true };
  }

  // 3. Fallback to Referer validation when Origin is absent
  if (referer) {
    let refererUrl: URL;
    try {
      refererUrl = new URL(referer);
    } catch {
      return {
        valid: false,
        response: NextResponse.json(
          { error: "Malformed Referer header." },
          { status: 400, headers: NO_CACHE_HEADERS }
        ),
      };
    }

    if (!isOriginTrusted(refererUrl, host)) {
      return {
        valid: false,
        response: NextResponse.json(
          { error: "Cross-site request forbidden." },
          { status: 403, headers: NO_CACHE_HEADERS }
        ),
      };
    }

    return { valid: true };
  }

  return { valid: true };
}
