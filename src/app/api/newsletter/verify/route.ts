import { NextResponse } from "next/server";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limiter";
import { newsletterVerifySchema } from "@/lib/validations/newsletter";
import {
  previewVerificationToken,
  confirmSubscriptionVerification,
} from "@/lib/newsletter/verification-service";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-Content-Type-Options": "nosniff",
};

export async function GET(_request?: Request) {
  return NextResponse.json(
    {
      error:
        "Verification tokens are not accepted through GET query parameters. Verification must be performed via POST.",
    },
    {
      status: 405,
      headers: {
        ...NO_CACHE_HEADERS,
        Allow: "POST",
      },
    }
  );
}

export async function POST(request: Request) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `newsletter-verify:${clientIp}`,
    10,
    600
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many verification attempts. Please try again later." },
      {
        status: 429,
        headers: {
          ...NO_CACHE_HEADERS,
          "Retry-After": String(rateLimitResult.retryAfterSeconds),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request payload." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  const parseResult = newsletterVerifySchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error:
          parseResult.error.issues?.[0]?.message ||
          "Invalid verification request details.",
      },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  if (parseResult.data.action === "preview") {
    const preview = await previewVerificationToken(parseResult.data.token);
    const status = preview.valid || preview.state === "ALREADY_VERIFIED" ? 200 : 400;
    return NextResponse.json(preview, {
      status,
      headers: NO_CACHE_HEADERS,
    });
  }

  const userAgent = request.headers.get("user-agent") || undefined;
  const result = await confirmSubscriptionVerification(parseResult.data.token, {
    ip: clientIp,
    userAgent,
  });

  if (!result.success) {
    const status =
      result.code === "CONCURRENT_CLAIM"
        ? 409
        : result.code === "TOKEN_EXPIRED"
        ? 410
        : 400;

    return NextResponse.json(
      {
        success: false,
        code: result.code,
        error: result.error || "Subscription verification failed.",
      },
      { status, headers: NO_CACHE_HEADERS }
    );
  }

  return NextResponse.json(
    {
      success: true,
      code: result.code,
      message: result.message,
    },
    { status: 200, headers: NO_CACHE_HEADERS }
  );
}

