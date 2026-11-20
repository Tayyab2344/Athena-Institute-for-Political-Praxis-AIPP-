import { NextResponse } from "next/server";
import { clearSessionCookie, revokeAdminSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { validateRequestOrigin } from "@/lib/auth/csrf";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
};

export async function POST(request: Request) {
  // Validate request origin
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  // Extract session token from cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
  const rawToken = match ? decodeURIComponent(match[1]) : null;

  if (rawToken) {
    await revokeAdminSession(rawToken);
  }

  const response = NextResponse.json(
    {
      success: true,
      message: "Logged out successfully.",
    },
    {
      headers: NO_CACHE_HEADERS,
    }
  );

  clearSessionCookie(response);

  return response;
}
