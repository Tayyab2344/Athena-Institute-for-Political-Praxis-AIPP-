import { NextResponse } from "next/server";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limiter";
import { newsletterResendSchema } from "@/lib/validations/newsletter";
import { resendVerificationEmail } from "@/lib/newsletter/verification-service";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-Content-Type-Options": "nosniff",
};

const GENERIC_SUCCESS_RESPONSE = {
  success: true,
  message:
    "If this email address is registered and awaiting verification, a new verification link has been sent.",
};

export async function POST(request: Request) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `newsletter-resend:${clientIp}`,
    5,
    600
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many resend requests. Please try again later." },
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

  const parseResult = newsletterResendSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error:
          parseResult.error.issues?.[0]?.message ||
          "Invalid resend request details.",
      },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  const { email, hp_organization, hp_website } = parseResult.data;

  if (hp_organization || hp_website) {
    return NextResponse.json(GENERIC_SUCCESS_RESPONSE, {
      status: 200,
      headers: NO_CACHE_HEADERS,
    });
  }

  const userAgent = request.headers.get("user-agent") || undefined;
  const result = await resendVerificationEmail(email, {
    ip: clientIp,
    userAgent,
  });

  return NextResponse.json(result, {
    status: 200,
    headers: NO_CACHE_HEADERS,
  });
}

