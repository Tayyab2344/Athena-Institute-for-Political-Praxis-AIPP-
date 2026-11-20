import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { getClientIp, checkRateLimit } from "@/lib/auth/rate-limiter";
import { runSmtpDiagnostic, enqueueControlledTestEmail } from "@/lib/email/smtp-diagnostic";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
};

/**
 * GET /api/admin/email/diagnostic
 * Read-only diagnostic endpoint. Runs SMTP transport verification.
 * Access restricted exclusively to SUPER_ADMIN.
 */
export async function GET(request: Request) {
  const auth = await requireAdminAuth(request, "manage_security");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const diagnostic = await runSmtpDiagnostic();
    return NextResponse.json(
      {
        success: true,
        diagnostic,
      },
      {
        status: diagnostic.success ? 200 : 502,
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Diagnostic execution failed";
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      {
        status: 500,
        headers: NO_CACHE_HEADERS,
      }
    );
  }
}

/**
 * POST /api/admin/email/diagnostic
 * Enqueues exactly one controlled test email to SMTP_TEST_RECIPIENT.
 * Access restricted exclusively to SUPER_ADMIN.
 */
export async function POST(request: Request) {
  // 1. Origin verification for state-changing browser submissions
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  // 2. Authorization check: SUPER_ADMIN only
  const auth = await requireAdminAuth(request, "manage_security");
  if (!auth.authorized) {
    return auth.response;
  }

  // 3. Rate limiting: max 5 controlled test dispatches per 10 minutes per administrator
  const clientIp = getClientIp(request);
  const rateLimitKey = `admin:smtp-test:${auth.user.id}:${clientIp}`;
  const rateLimit = await checkRateLimit(rateLimitKey, 5, 10 * 60);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Rate limit exceeded for test email dispatches. Please wait before attempting another test.",
      },
      {
        status: 429,
        headers: {
          ...NO_CACHE_HEADERS,
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  // 4. Parse optional body
  let testId = `run-${Date.now()}`;
  let note: string | undefined = undefined;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      if (body && typeof body === "object") {
        if (typeof body.testId === "string" && body.testId.trim()) {
          testId = body.testId.trim().slice(0, 32);
        }
        if (typeof body.note === "string" && body.note.trim()) {
          note = body.note.trim().slice(0, 200);
        }
      }
    }
  } catch {
    // Body is optional; continue with default testId if body parsing is not JSON
  }

  // 5. Enqueue controlled test email
  const result = await enqueueControlledTestEmail({
    adminUser: auth.user,
    testId,
    note,
  });

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
      },
      {
        status: 400,
        headers: NO_CACHE_HEADERS,
      }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: result.isDuplicate
        ? "Test email was already queued with this idempotency key. Duplicate creation prevented."
        : "Controlled test email successfully enqueued in EmailOutbox.",
      outbox: {
        id: result.emailId,
        idempotencyKey: result.idempotencyKey,
        status: result.status,
        recipient: result.recipient,
        scheduledAt: result.scheduledAt,
        isDuplicate: result.isDuplicate,
      },
    },
    {
      status: 200,
      headers: NO_CACHE_HEADERS,
    }
  );
}

