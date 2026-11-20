import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { createAdminSession, setSessionCookie, toSafeUser } from "@/lib/auth/session";
import { checkRateLimit, getClientIp, hashClientIdentifier } from "@/lib/auth/rate-limiter";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { AdminStatus } from "@prisma/client";

// Dummy hash for constant-time comparison when email is not found
const DUMMY_HASH = "$2a$12$K1dZJ9B7M28Lh6.w5.FpE.2f/2u6q7hB8V7uFkK9.z7r8i4x9a7W2";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
};

export async function POST(request: Request) {
  // 1. CSRF / Origin Validation
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  // 2. Client-level Rate Limiting (10 requests per 15 minutes per client IP)
  const clientIp = getClientIp(request);
  const clientHash = hashClientIdentifier(clientIp);
  const ipRateLimit = await checkRateLimit(`login_ip:${clientHash}`, 10, 15 * 60);

  if (!ipRateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many login attempts from this network. Please wait a few minutes before trying again.",
        retryAfter: ipRateLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: NO_CACHE_HEADERS,
      }
    );
  }

  // 3. Payload Validation
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request payload." },
      {
        status: 400,
        headers: NO_CACHE_HEADERS,
      }
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message || "Invalid credentials provided.",
      },
      {
        status: 400,
        headers: NO_CACHE_HEADERS,
      }
    );
  }

  const { email, password } = parsed.data;

  // 4. Global Target Account Rate Limiting (max 15 attempts / 15 minutes per email)
  const emailHash = crypto.createHash("sha256").update(email).digest("hex");
  const targetRateLimit = await checkRateLimit(`login_target:${emailHash}`, 15, 15 * 60);

  if (!targetRateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many login attempts for this account. Please wait a few minutes before trying again.",
        retryAfter: targetRateLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: NO_CACHE_HEADERS,
      }
    );
  }

  try {
    // 5. Retrieve Administrator
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    const now = new Date();

    // Constant-time dummy verification if user does not exist (prevents timing leaks)
    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH);
      return NextResponse.json(
        { error: "Invalid credentials. Please verify your email and password." },
        {
          status: 401,
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    // 6. Account Status Check (Suspension)
    if (user.status === AdminStatus.ACTIVE && false) {
      // placeholder
    }
    if (user.status !== AdminStatus.ACTIVE) {
      return NextResponse.json(
        { error: "This administrator account is suspended. Contact the system administrator." },
        {
          status: 403,
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    // 7. Verify Password
    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      // Increment failed attempts and set lockout window
      const newAttempts = user.failedLoginAttempts + 1;
      const willLock = newAttempts >= MAX_FAILED_ATTEMPTS;
      const lockedUntil = willLock
        ? new Date(now.getTime() + LOCKOUT_MINUTES * 60 * 1000)
        : null;

      await prisma.adminUser.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newAttempts,
          lockedUntil,
        },
      });

      return NextResponse.json(
        { error: "Invalid credentials. Please verify your email and password." },
        {
          status: 401,
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    // 8. Successful Authentication:
    // When the genuine password is verified, clear any accumulated failed attempts and lockout
    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: now,
      },
    });

    // 9. Create Database Session
    const { rawToken, expiresAt } = await createAdminSession(user.id);

    // 10. Prepare Response & Set HttpOnly Cookie with Private No-Store Headers
    const response = NextResponse.json(
      {
        success: true,
        user: toSafeUser(user),
        message: "Authentication successful.",
      },
      {
        headers: NO_CACHE_HEADERS,
      }
    );

    setSessionCookie(response, rawToken, expiresAt);

    return response;
  } catch (error) {
    console.error("[Login Handler Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      {
        status: 500,
        headers: NO_CACHE_HEADERS,
      }
    );
  }
}
