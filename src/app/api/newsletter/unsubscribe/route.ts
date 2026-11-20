import { NextResponse } from "next/server";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limiter";
import {
  previewUnsubscribeToken,
  confirmUnsubscribe,
} from "@/lib/newsletter/unsubscribe-service";

const SECURITY_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-Content-Type-Options": "nosniff",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const preview = await previewUnsubscribeToken(token);
  const status = preview.valid || preview.state === "ALREADY_UNSUBSCRIBED" ? 200 : 400;

  return NextResponse.json(preview, {
    status,
    headers: SECURITY_HEADERS,
  });
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `newsletter-unsubscribe:${clientIp}`,
    20,
    600
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many unsubscribe attempts. Please try again later." },
      {
        status: 429,
        headers: {
          ...SECURITY_HEADERS,
          "Retry-After": String(rateLimitResult.retryAfterSeconds),
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const queryToken = searchParams.get("token");
  const contentType = request.headers.get("content-type") || "";

  let token: string | null = queryToken;
  let action: string = "confirm";
  let isOneClick = false;

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    try {
      const cloned = request.clone();
      try {
        const formData = await request.formData();
        const bodyToken = formData.get("token");
        if (typeof bodyToken === "string" && bodyToken.trim()) {
          token = bodyToken.trim();
        }
        const listUnsubscribeValue = formData.get("List-Unsubscribe");
        if (listUnsubscribeValue === "One-Click") {
          isOneClick = true;
        }
      } catch {
        const text = await cloned.text();
        if (text.includes("List-Unsubscribe=One-Click")) {
          isOneClick = true;
        }
        const parsed = new URLSearchParams(text);
        const bodyToken = parsed.get("token");
        if (bodyToken && bodyToken.trim()) {
          token = bodyToken.trim();
        }
        if (parsed.get("List-Unsubscribe") === "One-Click") {
          isOneClick = true;
        }
      }
    } catch {
    }
  } else if (contentType.includes("application/json")) {
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid && originCheck.response) {
      return originCheck.response;
    }

    try {
      const body = await request.json();
      if (body && typeof body === "object") {
        const bodyObj = body as Record<string, unknown>;
        if (typeof bodyObj.token === "string") {
          token = bodyObj.token.trim();
        }
        if (typeof bodyObj.action === "string") {
          action = bodyObj.action;
        }
        if (bodyObj.oneClick === true) {
          isOneClick = true;
        }
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request payload." },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }
  } else {
    try {
      const text = await request.text();
      if (text.includes("List-Unsubscribe=One-Click")) {
        isOneClick = true;
      }
    } catch {
    }
  }

  if (!token) {
    return NextResponse.json(
      { error: "No unsubscribe token provided." },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  if (action === "preview") {
    const preview = await previewUnsubscribeToken(token);
    const status = preview.valid || preview.state === "ALREADY_UNSUBSCRIBED" ? 200 : 400;
    return NextResponse.json(preview, {
      status,
      headers: SECURITY_HEADERS,
    });
  }

  const userAgent = request.headers.get("user-agent") || undefined;
  const result = await confirmUnsubscribe(token, {
    ip: clientIp,
    userAgent,
    oneClick: isOneClick,
  });

  const status = result.success ? 200 : result.code === "TOKEN_EXPIRED" ? 410 : 400;

  return NextResponse.json(result, {
    status,
    headers: SECURITY_HEADERS,
  });
}

