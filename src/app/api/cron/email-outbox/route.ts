import crypto from "crypto";
import { NextResponse } from "next/server";
import { processEmailOutboxBatch } from "@/lib/email/email-worker";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
};

/**
 * Validates the caller-supplied cron secret using constant-time comparison.
 */
function verifyCronSecret(request: Request): boolean {
  const serverSecret = process.env.CRON_SECRET?.trim();
  if (!serverSecret || serverSecret.length === 0) {
    return false;
  }

  // Extract from Authorization header (Bearer <secret>) or x-cron-secret header
  const authHeader = request.headers.get("authorization") || "";
  let providedSecret = "";

  if (authHeader.startsWith("Bearer ")) {
    providedSecret = authHeader.slice(7).trim();
  } else {
    providedSecret = (request.headers.get("x-cron-secret") || "").trim();
  }

  if (!providedSecret || providedSecret.length === 0) {
    return false;
  }

  const serverSecretBuffer = Buffer.from(serverSecret, "utf-8");
  const providedSecretBuffer = Buffer.from(providedSecret, "utf-8");

  if (serverSecretBuffer.length !== providedSecretBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(serverSecretBuffer, providedSecretBuffer);
}

/**
 * POST /api/cron/email-outbox
 * Secure background worker endpoint for serverless cron orchestrators (e.g. Vercel Cron, GitHub Actions, AWS EventBridge, or curl).
 */
export async function POST(request: Request) {
  // 1. Authenticate cron trigger
  if (!process.env.CRON_SECRET || process.env.CRON_SECRET.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "CRON_SECRET is not configured on the server." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }

  const isAuthorized = verifyCronSecret(request);
  if (!isAuthorized) {
    return NextResponse.json(
      { success: false, error: "Unauthorized cron invocation. Invalid or missing secret." },
      { status: 401, headers: NO_CACHE_HEADERS }
    );
  }

  // 2. Parse optional query parameters for batch size and timeout
  const url = new URL(request.url);
  const rawBatchSize = url.searchParams.get("batchSize");
  const batchSize = rawBatchSize ? Math.min(50, Math.max(1, parseInt(rawBatchSize, 10) || 10)) : 10;

  const rawTimeout = url.searchParams.get("maxSeconds");
  const maxExecutionSeconds = rawTimeout ? Math.min(55, Math.max(5, parseInt(rawTimeout, 10) || 25)) : 25;

  try {
    const result = await processEmailOutboxBatch({
      batchSize,
      maxExecutionSeconds,
    });

    return NextResponse.json(
      {
        success: true,
        summary: {
          processed: result.processed,
          succeeded: result.succeeded,
          retried: result.retried,
          failed: result.failed,
          recoveredStale: result.recoveredStale,
          lostOwnership: result.lostOwnership,
          durationMs: result.durationMs,
        },
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (workerErr: unknown) {
    const errorMsg = workerErr instanceof Error ? workerErr.message : "Internal worker error";
    return NextResponse.json(
      { success: false, error: "Email processing error: " + errorMsg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

