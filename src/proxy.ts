import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "aipp_admin_session";

/**
 * Next.js 16 Proxy for lightweight route interception and redirects.
 * Note: Proxy performs optimistic route checks. Authoritative session verification
 * is enforced server-side inside protected pages and API route handlers.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // 1. If accessing login page while already carrying a session cookie, redirect to admin dashboard
  if (pathname === "/admin/login") {
    if (sessionCookie) {
      const targetUrl = request.nextUrl.clone();
      targetUrl.pathname = "/admin";
      return NextResponse.redirect(targetUrl);
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-admin-path", pathname);
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    applySecurityHeaders(response);
    return response;
  }

  // 2. If accessing any protected admin route without a session cookie, redirect to login
  if (pathname.startsWith("/admin")) {
    if (!sessionCookie) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-admin-path", pathname);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  applySecurityHeaders(response);
  return response;
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
}

export const config = {
  matcher: ["/admin/:path*"],
};
