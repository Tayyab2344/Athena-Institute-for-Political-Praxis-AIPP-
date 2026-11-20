import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { getClientIp, checkRateLimit } from "@/lib/auth/rate-limiter";
import {
  reconcileInquiryEmails,
  getQueueOverviewStats,
} from "@/lib/email/reconciliation-service";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
};

export async function GET(request: Request) {
  const auth = await requireAdminAuth(request, "manage_security");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const stats = await getQueueOverviewStats();
    return NextResponse.json(
      {
        success: true,
        stats,
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load queue statistics";
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

export async function POST(request: Request) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "manage_security");
  if (!auth.authorized) {
    return auth.response;
  }

  const clientIp = getClientIp(request);
  const rateLimitKey = `admin:reconciliation:${auth.user.id}:${clientIp}`;
  const rateLimit = await checkRateLimit(rateLimitKey, 10, 5 * 60);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Rate limit exceeded for reconciliation operations. Please wait before retrying.",
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

  let dryRun = true;
  let customCutoff: Date | undefined = undefined;
  let inquiryId: string | undefined = undefined;
  let retryFailed = false;
  let allowAmbiguousRetry = false;
  const isProd = process.env.NODE_ENV === "production";

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      if (body && typeof body === "object") {
        if (typeof body.dryRun === "boolean") {
          dryRun = body.dryRun;
        }
        if (!isProd && typeof body.cutoffTimestamp === "string" && body.cutoffTimestamp.trim()) {
          const parsed = new Date(body.cutoffTimestamp.trim());
          if (!isNaN(parsed.getTime())) {
            customCutoff = parsed;
          }
        }
        if (typeof body.inquiryId === "string" && body.inquiryId.trim()) {
          inquiryId = body.inquiryId.trim();
        }
        if (typeof body.retryFailed === "boolean") {
          retryFailed = body.retryFailed;
        }
        if (typeof body.allowAmbiguousRetry === "boolean") {
          allowAmbiguousRetry = body.allowAmbiguousRetry;
        }
      }
    }
  } catch {
  }

  if ((retryFailed || allowAmbiguousRetry) && auth.user.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      {
        success: false,
        error: "Forbidden: Only SUPER_ADMIN accounts can authorize email retries or ambiguous retry rescheduling.",
      },
      {
        status: 403,
        headers: NO_CACHE_HEADERS,
      }
    );
  }

  try {
    const report = await reconcileInquiryEmails({
      dryRun,
      cutoffTimestamp: isProd ? undefined : customCutoff,
      inquiryId,
      retryFailed,
      allowAmbiguousRetry,
      adminUserId: auth.user.id,
      adminUserEmail: auth.user.email,
    });

    return NextResponse.json(
      {
        success: true,
        report,
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Reconciliation failed";
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

