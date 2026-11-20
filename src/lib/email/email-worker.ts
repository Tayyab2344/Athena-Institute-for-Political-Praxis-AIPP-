import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { EmailStatus, EmailOutbox } from "@prisma/client";
import { createSmtpTransport, getSmtpConfig } from "./smtp-config";
import type { Transporter } from "nodemailer";

if (typeof window !== "undefined") {
  throw new Error("Email worker must never be imported in browser environments.");
}

export interface WorkerOptions {
  batchSize?: number;
  leaseTimeoutMinutes?: number;
  maxExecutionSeconds?: number;
  sendTimeoutMs?: number;
  customTransporter?: Transporter;
  domainOverride?: string;
}

export interface WorkerBatchResult {
  success: boolean;
  processed: number;
  succeeded: number;
  retried: number;
  failed: number;
  recoveredStale: number;
  lostOwnership: number;
  durationMs: number;
  workerId: string;
}

export function sanitizeErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  let message = "Unknown error";
  let code: string | number | undefined = undefined;
  let responseCode: number | undefined = undefined;

  if (err instanceof Error) {
    message = err.message || String(err);
    const withCode = err as { code?: string | number; responseCode?: number };
    code = withCode.code;
    responseCode = withCode.responseCode;
  } else if (typeof err === "object") {
    const obj = err as Record<string, unknown>;
    message = String(obj.message || obj.error || JSON.stringify(err));
    code = obj.code as string | number | undefined;
    responseCode = obj.responseCode as number | undefined;
  } else {
    message = String(err);
  }

  message = message
    .replace(/(?:password|pass|token|auth|secret)[=:\s]+[^\s,]+/gi, "[REDACTED]")
    .replace(/bearer\s+[a-z0-9\-._~+/]+=*/gi, "Bearer [REDACTED]")
    .slice(0, 500);

  const parts: string[] = [];
  if (responseCode) parts.push(`SMTP ${responseCode}`);
  if (code && code !== responseCode) parts.push(`Code: ${code}`);
  parts.push(message);

  return parts.join(" - ");
}

export interface SmtpStageClassification {
  stage: "PRE_SUBMISSION" | "POST_DATA" | "UNKNOWN";
  isAmbiguous: boolean;
  isPermanent: boolean;
  isRetryable: boolean;
  classification:
    | "DNS_FAILURE"
    | "TCP_CONNECTION_FAILURE"
    | "TLS_HANDSHAKE_FAILURE"
    | "AUTHENTICATION_FAILURE"
    | "AUTHENTICATION_PERMANENT"
    | "AUTHENTICATION_TEMPORARY"
    | "CONFIGURATION_ERROR"
    | "PRE_DATA_REJECTION"
    | "PRE_DATA_CONNECTION_LOSS"
    | "PRE_TERMINATOR_CONNECTION_LOSS"
    | "SENDER_REJECTED"
    | "RECIPIENT_REJECTED"
    | "CONTENT_OR_POLICY_REJECTED"
    | "POST_DATA_AMBIGUOUS"
    | "POST_ACCEPTANCE_DB_FAILURE"
    | "PERMANENT_REJECTION"
    | "UNKNOWN_STAGE_AMBIGUOUS";
  reason: string;
}

export function classifySmtpStageError(err: unknown): SmtpStageClassification {
  if (!err) {
    return {
      stage: "UNKNOWN",
      isAmbiguous: false,
      isPermanent: false,
      isRetryable: false,
      classification: "UNKNOWN_STAGE_AMBIGUOUS",
      reason: "No error object provided",
    };
  }

  const asObj = (typeof err === "object" && err !== null ? err : {}) as {
    code?: string | number;
    command?: string;
    response?: string;
    responseCode?: number;
    name?: string;
    message?: string;
    stage?: string;
  };

  const codeStr = String(asObj.code || "").toUpperCase();
  const commandStr = String(asObj.command || "").toUpperCase();
  const nameStr = String(asObj.name || "");
  const stageStr = String(asObj.stage || "").toUpperCase();
  const respCode = typeof asObj.responseCode === "number" ? asObj.responseCode : undefined;
  const msg = (err instanceof Error ? err.message : String(asObj.message || err)).toLowerCase();

  if (stageStr === "POST_ACCEPTANCE") {
    return {
      stage: "POST_DATA",
      isAmbiguous: true,
      isPermanent: false,
      isRetryable: false,
      classification: "POST_ACCEPTANCE_DB_FAILURE",
      reason: `Ambiguous delivery outcome: SMTP acceptance received but database confirmation update failed: ${asObj.message || "Unknown DB error"}`,
    };
  }

  if (stageStr === "POST_TERMINATOR" || stageStr === "AWAITING_DATA_RESPONSE") {
    return {
      stage: "POST_DATA",
      isAmbiguous: true,
      isPermanent: false,
      isRetryable: false,
      classification: "POST_DATA_AMBIGUOUS",
      reason: `Ambiguous delivery outcome: Connection lost after end-of-data terminator was transmitted; remote relay acceptance is uncertain: ${asObj.message || codeStr}`,
    };
  }

  if (stageStr === "BODY_STREAM" || stageStr === "PRE_TERMINATOR") {
    return {
      stage: "PRE_SUBMISSION",
      isAmbiguous: false,
      isPermanent: false,
      isRetryable: true,
      classification: "PRE_TERMINATOR_CONNECTION_LOSS",
      reason: `Connection lost during message body transmission before end-of-data terminator: ${asObj.message || codeStr}`,
    };
  }

  if (
    codeStr === "ENOTFOUND" ||
    codeStr === "EAI_AGAIN" ||
    codeStr === "EDNS" ||
    stageStr === "DNS" ||
    msg.includes("getaddrinfo enotfound") ||
    msg.includes("eai_again")
  ) {
    return {
      stage: "PRE_SUBMISSION",
      isAmbiguous: false,
      isPermanent: false,
      isRetryable: true,
      classification: "DNS_FAILURE",
      reason: `DNS resolution failed before connecting to mail server: ${asObj.message || codeStr}`,
    };
  }

  if (
    codeStr === "ECONNREFUSED" ||
    codeStr === "ECONNECTION" ||
    stageStr === "TCP_CONNECT" ||
    (commandStr === "CONN" && (codeStr === "ECONNECTION" || codeStr === "ECONNRESET" || codeStr === "ETIMEDOUT" || codeStr === "ESOCKET" || msg.includes("connection closed") || msg.includes("connect econnrefused"))) ||
    msg.includes("connect econnrefused")
  ) {
    return {
      stage: "PRE_SUBMISSION",
      isAmbiguous: false,
      isPermanent: false,
      isRetryable: true,
      classification: "TCP_CONNECTION_FAILURE",
      reason: `TCP connection failed before handshake: ${asObj.message || codeStr}`,
    };
  }

  if (
    codeStr === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    codeStr === "CERT_HAS_EXPIRED" ||
    codeStr === "DEPTH_ZERO_SELF_SIGNED_CERT" ||
    codeStr.startsWith("ERR_TLS") ||
    commandStr === "STARTTLS" ||
    stageStr === "TLS_HANDSHAKE" ||
    msg.includes("tls handshake") ||
    msg.includes("certificate")
  ) {
    const isCertPermanent =
      codeStr === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
      codeStr === "CERT_HAS_EXPIRED" ||
      codeStr === "DEPTH_ZERO_SELF_SIGNED_CERT";
    return {
      stage: "PRE_SUBMISSION",
      isAmbiguous: false,
      isPermanent: isCertPermanent,
      isRetryable: !isCertPermanent,
      classification: "TLS_HANDSHAKE_FAILURE",
      reason: `TLS negotiation failed before message submission: ${asObj.message || codeStr}`,
    };
  }

  if (
    codeStr === "ECONFIG" ||
    msg.includes("smtp_not_configured") ||
    msg.includes("missing credentials") ||
    msg.includes("no recipients defined")
  ) {
    return {
      stage: "PRE_SUBMISSION",
      isAmbiguous: false,
      isPermanent: true,
      isRetryable: false,
      classification: "CONFIGURATION_ERROR",
      reason: `SMTP configuration or credential setup invalid: ${asObj.message || codeStr}`,
    };
  }

  if (
    respCode === 454 ||
    msg.includes("454") ||
    msg.includes("temporary authentication failure")
  ) {
    return {
      stage: "PRE_SUBMISSION",
      isAmbiguous: false,
      isPermanent: false,
      isRetryable: true,
      classification: "AUTHENTICATION_TEMPORARY",
      reason: `SMTP temporary authentication failure (454): ${asObj.message || codeStr}`,
    };
  }

  if (
    codeStr === "EAUTH" ||
    respCode === 535 ||
    commandStr === "AUTH" ||
    stageStr === "AUTH" ||
    msg.includes("authentication credentials invalid") ||
    msg.includes("username and password not accepted") ||
    msg.includes("535 5.7.8") ||
    msg.includes("invalid login")
  ) {
    return {
      stage: "PRE_SUBMISSION",
      isAmbiguous: false,
      isPermanent: true,
      isRetryable: false,
      classification: "AUTHENTICATION_FAILURE",
      reason: `SMTP permanent authentication rejection (535): ${asObj.message || codeStr}`,
    };
  }

  if (commandStr === "MAIL" || stageStr === "MAIL_FROM") {
    if (respCode && respCode >= 400 && respCode < 600) {
      const isPerm = respCode >= 500;
      return {
        stage: "PRE_SUBMISSION",
        isAmbiguous: false,
        isPermanent: isPerm,
        isRetryable: !isPerm,
        classification: isPerm ? "SENDER_REJECTED" : "PRE_DATA_REJECTION",
        reason: `SMTP MAIL FROM rejected: ${respCode} ${asObj.message || ""}`,
      };
    }
  }

  if (commandStr === "RCPT" || stageStr === "RCPT_TO") {
    if (respCode && respCode >= 400 && respCode < 600) {
      const isPerm = respCode >= 500;
      return {
        stage: "PRE_SUBMISSION",
        isAmbiguous: false,
        isPermanent: isPerm,
        isRetryable: !isPerm,
        classification: isPerm ? "RECIPIENT_REJECTED" : "PRE_DATA_REJECTION",
        reason: `SMTP RCPT TO rejected: ${respCode} ${asObj.message || ""}`,
      };
    }
  }

  const preDataCommands = ["CONN", "GREETING", "EHLO", "HELO", "MAIL", "RCPT"];
  const isPreDataCommand = preDataCommands.includes(commandStr) || stageStr === "MAIL_FROM" || stageStr === "RCPT_TO";

  if (isPreDataCommand && respCode && respCode >= 400 && respCode < 600) {
    const isPerm = respCode >= 500;
    return {
      stage: "PRE_SUBMISSION",
      isAmbiguous: false,
      isPermanent: isPerm,
      isRetryable: !isPerm,
      classification: "PRE_DATA_REJECTION",
      reason: `SMTP command ${commandStr || stageStr} rejected before DATA: ${respCode} ${asObj.message || ""}`,
    };
  }

  if (isPreDataCommand && (codeStr === "ECONNECTION" || codeStr === "ECONNRESET" || codeStr === "ETIMEDOUT" || codeStr === "ESOCKET" || codeStr === "EABORT" || codeStr === "EPIPE" || msg.includes("connection closed") || msg.includes("closed unexpectedly"))) {
    return {
      stage: "PRE_SUBMISSION",
      isAmbiguous: false,
      isPermanent: false,
      isRetryable: true,
      classification: "PRE_DATA_CONNECTION_LOSS",
      reason: `Connection lost during ${commandStr || stageStr} negotiation before DATA submission: ${asObj.message || codeStr}`,
    };
  }

  if (stageStr === "DATA_COMMAND") {
    const isPerm = Boolean(respCode && respCode >= 500);
    return {
      stage: "PRE_SUBMISSION",
      isAmbiguous: false,
      isPermanent: isPerm,
      isRetryable: !isPerm,
      classification: "PRE_DATA_REJECTION",
      reason: `SMTP DATA command rejected before message transmission: ${respCode || ""} ${asObj.message || ""}`.trim(),
    };
  }

  const isPostDataCommand = commandStr === "DATA" || commandStr === "MESSAGE" || stageStr === "DATA" || stageStr === "POST_DATA";
  if (isPostDataCommand) {
    return {
      stage: "POST_DATA",
      isAmbiguous: true,
      isPermanent: false,
      isRetryable: false,
      classification: "POST_DATA_AMBIGUOUS",
      reason: `Ambiguous delivery outcome: Connection lost or timed out after message DATA transmission; remote relay acceptance is uncertain: ${asObj.message || codeStr}`,
    };
  }

  if (respCode === 550 || msg.includes("550")) {
    if (commandStr === "RCPT" || stageStr === "RCPT_TO") {
      return {
        stage: "PRE_SUBMISSION",
        isAmbiguous: false,
        isPermanent: true,
        isRetryable: false,
        classification: "RECIPIENT_REJECTED",
        reason: `Permanent mailbox rejection on RCPT TO: ${asObj.message || msg}`,
      };
    }
    if (commandStr === "MAIL" || stageStr === "MAIL_FROM") {
      return {
        stage: "PRE_SUBMISSION",
        isAmbiguous: false,
        isPermanent: true,
        isRetryable: false,
        classification: "SENDER_REJECTED",
        reason: `Sender address rejected on MAIL FROM (550): ${asObj.message || msg}`,
      };
    }
    if (commandStr === "DATA" || stageStr === "DATA") {
      return {
        stage: "POST_DATA",
        isAmbiguous: false,
        isPermanent: true,
        isRetryable: false,
        classification: "CONTENT_OR_POLICY_REJECTED",
        reason: `Message content or policy rejection on DATA (550): ${asObj.message || msg}`,
      };
    }
    return {
      stage: "UNKNOWN",
      isAmbiguous: false,
      isPermanent: true,
      isRetryable: false,
      classification: "PERMANENT_REJECTION",
      reason: `Permanent SMTP rejection (550): ${asObj.message || msg}`,
    };
  }

  if (respCode && respCode >= 500 && respCode < 600) {
    return {
      stage: "UNKNOWN",
      isAmbiguous: false,
      isPermanent: true,
      isRetryable: false,
      classification: "PERMANENT_REJECTION",
      reason: `Permanent SMTP rejection ${respCode}: ${asObj.message || ""}`,
    };
  }

  if (
    msg.includes("invalid recipient") ||
    msg.includes("recipient rejected") ||
    msg.includes("mailbox unavailable") ||
    msg.includes("user unknown") ||
    msg.includes("no such user")
  ) {
    return {
      stage: "UNKNOWN",
      isAmbiguous: false,
      isPermanent: true,
      isRetryable: false,
      classification: "PERMANENT_REJECTION",
      reason: `Permanent mailbox rejection: ${asObj.message || msg}`,
    };
  }

  if (
    codeStr === "ETIMEDOUT" ||
    codeStr === "ESOCKET" ||
    codeStr === "ECONNRESET" ||
    codeStr === "EABORT" ||
    nameStr === "AbortError" ||
    msg.includes("timed out") ||
    msg.includes("timeout") ||
    msg.includes("socket closed") ||
    msg.includes("connection closed") ||
    msg.includes("aborted")
  ) {
    return {
      stage: "UNKNOWN",
      isAmbiguous: true,
      isPermanent: false,
      isRetryable: false,
      classification: "UNKNOWN_STAGE_AMBIGUOUS",
      reason: `Connection lost or timed out without proof that failure occurred prior to DATA transmission. Fails closed to manual review to prevent duplicate delivery: ${asObj.message || codeStr || msg}`,
    };
  }

  return {
    stage: "UNKNOWN",
    isAmbiguous: false,
    isPermanent: false,
    isRetryable: true,
    classification: "PRE_DATA_CONNECTION_LOSS",
    reason: `Temporary unclassified transmission failure: ${asObj.message || "Unknown error"}`,
  };
}

export function isPermanentSmtpFailure(err: unknown): boolean {
  return classifySmtpStageError(err).isPermanent;
}

export function isAmbiguousSmtpOutcome(err: unknown): boolean {
  return classifySmtpStageError(err).isAmbiguous;
}

export function calculateNextRetryDelaySeconds(attemptCount: number): number {
  const baseSeconds = 30;
  const maxSeconds = 3600;
  const exponential = Math.min(maxSeconds, baseSeconds * Math.pow(2, Math.max(0, attemptCount - 1)));
  const jitter = Math.floor(Math.random() * 16);
  return Math.min(maxSeconds, exponential + jitter);
}

export function buildStableMessageId(
  outboxId: string,
  fromEmail: string,
  domainOverride?: string
): string {
  const safeId = (outboxId || "").replace(/[^a-zA-Z0-9_-]/g, "");

  let rawDomain = "";
  if (domainOverride && typeof domainOverride === "string") {
    rawDomain = domainOverride.trim();
  } else if (fromEmail && typeof fromEmail === "string") {
    if (!/[\r\n\t\0]/.test(fromEmail)) {
      const atIndex = fromEmail.lastIndexOf("@");
      if (atIndex !== -1) {
        rawDomain = fromEmail.slice(atIndex + 1).replace(/[<>]/g, "").trim();
      }
    }
  }

  const domainRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  let validDomain = "aipp.org.pk";

  if (
    rawDomain &&
    rawDomain.length <= 253 &&
    !/[\r\n\t\0,;:\\"'\s<>]/.test(rawDomain) &&
    domainRegex.test(rawDomain)
  ) {
    validDomain = rawDomain.toLowerCase();
  }

  return `<outbox_${safeId || "msg"}@${validDomain}>`;
}

export async function sendMailWithTimeout(
  transporter: Transporter,
  mailOptions: Parameters<Transporter["sendMail"]>[0],
  timeoutMs: number
): Promise<unknown> {
  const controller = new AbortController();
  let timer: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort(new Error(`SMTP operation timed out after ${timeoutMs}ms`));

      const err = new Error(`SMTP operation timed out after ${timeoutMs}ms; cancelled`);
      (err as unknown as { code: string; name: string; cause: unknown }).code = "EABORT";
      (err as unknown as { code: string; name: string; cause: unknown }).name = "AbortError";
      (err as unknown as { code: string; name: string; cause: unknown }).cause = `Timeout after ${timeoutMs}ms`;
      reject(err);
    }, timeoutMs);
  });

  try {
    const mailWithSignal = {
      ...mailOptions,
      signal: controller.signal,
    };

    return await Promise.race([
      transporter.sendMail(mailWithSignal),
      timeoutPromise,
    ]);
  } catch (err: unknown) {
    const errObj = err as { code?: string; name?: string; message?: string; cause?: unknown };
    if (
      errObj &&
      (errObj.code === "EABORT" ||
        errObj.name === "AbortError" ||
        errObj.message?.includes("aborted") ||
        errObj.message?.includes("timed out"))
    ) {
      const abortErr = new Error(`SMTP operation aborted or timed out after ${timeoutMs}ms`);
      (abortErr as unknown as { code: string; name: string; cause: unknown }).code = "EABORT";
      (abortErr as unknown as { code: string; name: string; cause: unknown }).name = "AbortError";
      (abortErr as unknown as { code: string; name: string; cause: unknown }).cause = errObj.cause || errObj.message;
      throw abortErr;
    }
    throw err;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function recoverStaleProcessingEmails(leaseTimeoutMinutes = 5): Promise<number> {
  const staleThreshold = new Date(Date.now() - leaseTimeoutMinutes * 60 * 1000);
  const now = new Date();

  const ambiguousResult = await prisma.emailOutbox.updateMany({
    where: {
      status: EmailStatus.PROCESSING,
      lockedAt: {
        lt: staleThreshold,
      },
      claimToken: {
        not: null,
      },
      lastError: {
        startsWith: "IN_FLIGHT_TRANSMISSION:",
      },
    },
    data: {
      status: EmailStatus.FAILED,
      failedAt: now,
      lockedAt: null,
      lockedBy: null,
      claimToken: null,
      nextRetryAt: null,
      lastError: "AMBIGUOUS_DELIVERY: Stale lease expired while in-flight. Remote relay acceptance uncertain. Automated retry suppressed.",
    },
  });

  const pendingResult = await prisma.emailOutbox.updateMany({
    where: {
      status: EmailStatus.PROCESSING,
      lockedAt: {
        lt: staleThreshold,
      },
      claimToken: {
        not: null,
      },
      OR: [
        { lastError: null },
        { NOT: { lastError: { startsWith: "IN_FLIGHT_TRANSMISSION:" } } },
      ],
    },
    data: {
      status: EmailStatus.PENDING,
      lockedAt: null,
      lockedBy: null,
      claimToken: null,
      nextRetryAt: null,
      lastError: "Stale lease recovered: Proven pre-transmission lease expiration.",
    },
  });

  if (ambiguousResult.count > 0) {
    const ambiguousReplies = await prisma.inquiryReply.findMany({
      where: {
        outbox: {
          status: EmailStatus.FAILED,
          lastError: { startsWith: "AMBIGUOUS_DELIVERY: Stale lease" },
        },
        status: { not: EmailStatus.FAILED },
      },
      select: { outboxId: true },
    });
    for (const r of ambiguousReplies) {
      if (r.outboxId) {
        await syncInquiryReplyOnOutboxTransition(r.outboxId, EmailStatus.FAILED);
      }
    }
  }

  if (pendingResult.count > 0) {
    await prisma.inquiryReply.updateMany({
      where: {
        outbox: {
          status: EmailStatus.PENDING,
          lastError: { startsWith: "Stale lease recovered" },
        },
        status: { not: EmailStatus.PENDING },
      },
      data: { status: EmailStatus.PENDING },
    });
  }

  return ambiguousResult.count + pendingResult.count;
}

export async function syncInquiryReplyOnOutboxTransition(
  outboxId: string,
  newStatus: EmailStatus
): Promise<void> {
  try {
    const reply = await prisma.inquiryReply.findUnique({
      where: { outboxId },
      select: {
        id: true,
        inquiryId: true,
        adminUserId: true,
        recipientEmail: true,
        subject: true,
        status: true,
      },
    });

    if (!reply) {
      return;
    }

    if (reply.status !== newStatus) {
      await prisma.inquiryReply.update({
        where: { id: reply.id },
        data: { status: newStatus },
      });
    }

    if (newStatus === EmailStatus.ACCEPTED_BY_SMTP) {
      const existingActivity = await prisma.inquiryActivity.findFirst({
        where: {
          inquiryId: reply.inquiryId,
          action: "REPLY_ACCEPTED_BY_SMTP",
          details: { contains: reply.id },
        },
      });

      if (!existingActivity) {
        await prisma.inquiryActivity.create({
          data: {
            inquiryId: reply.inquiryId,
            adminUserId: reply.adminUserId,
            action: "REPLY_ACCEPTED_BY_SMTP",
            details: JSON.stringify({
              replyId: reply.id,
              outboxId,
              recipient: reply.recipientEmail,
              subject: reply.subject,
              acceptedAt: new Date().toISOString(),
            }),
          },
        });
      }
    } else if (newStatus === EmailStatus.FAILED) {
      const existingActivity = await prisma.inquiryActivity.findFirst({
        where: {
          inquiryId: reply.inquiryId,
          action: "REPLY_FAILED",
          details: { contains: reply.id },
        },
      });

      if (!existingActivity) {
        await prisma.inquiryActivity.create({
          data: {
            inquiryId: reply.inquiryId,
            adminUserId: reply.adminUserId,
            action: "REPLY_FAILED",
            details: JSON.stringify({
              replyId: reply.id,
              outboxId,
              recipient: reply.recipientEmail,
              subject: reply.subject,
              failedAt: new Date().toISOString(),
            }),
          },
        });
      }
    }
  } catch (syncErr: unknown) {
    console.error("[Reply Status Sync Error]:", syncErr);
  }
}

export async function claimPendingBatch(
  batchSize: number,
  workerId: string
): Promise<EmailOutbox[]> {
  const now = new Date();

  try {
    const claimedRows = await prisma.$queryRawUnsafe<EmailOutbox[]>(
      `
      WITH claimable AS (
        SELECT id
        FROM "EmailOutbox"
        WHERE "status" = 'PENDING'::"EmailStatus"
          AND "scheduledAt" <= $1
          AND ("nextRetryAt" IS NULL OR "nextRetryAt" <= $1)
        ORDER BY "scheduledAt" ASC
        LIMIT $2
        FOR UPDATE SKIP LOCKED
      )
      UPDATE "EmailOutbox"
      SET "status" = 'PROCESSING'::"EmailStatus",
          "lockedAt" = $1,
          "lockedBy" = $3,
          "claimToken" = 'claim_' || md5(random()::text || clock_timestamp()::text || id),
          "lastError" = NULL,
          "updatedAt" = $1
      WHERE id IN (SELECT id FROM claimable)
      RETURNING *;
      `,
      now,
      batchSize,
      workerId
    );

    return claimedRows;
  } catch {
    return await prisma.$transaction(async (tx) => {
      const candidates = await tx.emailOutbox.findMany({
        where: {
          status: EmailStatus.PENDING,
          scheduledAt: { lte: now },
          OR: [
            { nextRetryAt: null },
            { nextRetryAt: { lte: now } },
          ],
        },
        orderBy: { scheduledAt: "asc" },
        take: batchSize,
      });

      if (candidates.length === 0) return [];

      const claimed: EmailOutbox[] = [];
      for (const candidate of candidates) {
        const claimToken = `claim_${crypto.randomUUID()}`;
        const res = await tx.emailOutbox.updateMany({
          where: { id: candidate.id, status: EmailStatus.PENDING },
          data: {
            status: EmailStatus.PROCESSING,
            lockedAt: now,
            lockedBy: workerId,
            claimToken,
            lastError: null,
          },
        });
        if (res.count === 1) {
          if (candidate.category === "INQUIRY_REPLY") {
            await tx.inquiryReply.updateMany({
              where: { outboxId: candidate.id },
              data: { status: EmailStatus.PROCESSING },
            });
          }
          claimed.push({
            ...candidate,
            status: EmailStatus.PROCESSING,
            lockedAt: now,
            lockedBy: workerId,
            claimToken,
            updatedAt: now,
          });
        }
      }

      return claimed;
    });
  }
}

export async function processEmailOutboxBatch(
  options: WorkerOptions = {}
): Promise<WorkerBatchResult> {
  const startTime = Date.now();
  const batchSize = Math.max(1, Math.min(50, options.batchSize ?? 10));
  const leaseTimeoutMinutes = options.leaseTimeoutMinutes ?? 5;
  const maxExecutionSeconds = options.maxExecutionSeconds ?? 25;
  const workerId = `worker_${crypto.randomUUID().slice(0, 12)}`;

  let succeeded = 0;
  let retried = 0;
  let failed = 0;
  let lostOwnership = 0;

  const recoveredStale = await recoverStaleProcessingEmails(leaseTimeoutMinutes);

  const claimedEmails = await claimPendingBatch(batchSize, workerId);

  if (claimedEmails.length === 0) {
    return {
      success: true,
      processed: 0,
      succeeded: 0,
      retried: 0,
      failed: 0,
      recoveredStale,
      lostOwnership: 0,
      durationMs: Date.now() - startTime,
      workerId,
    };
  }

  const config = getSmtpConfig();
  const transporter = options.customTransporter || createSmtpTransport({ config });

  const maxAllowedSendTimeout = Math.max(2000, maxExecutionSeconds * 1000 - 5000);
  const rawSendTimeout = options.sendTimeoutMs ?? config.sendTimeoutMs ?? 15000;
  const sendTimeoutMs = Math.min(rawSendTimeout, maxAllowedSendTimeout);

  for (let i = 0; i < claimedEmails.length; i++) {
    const email = claimedEmails[i];

    const elapsedMs = Date.now() - startTime;
    const remainingBudgetMs = maxExecutionSeconds * 1000 - elapsedMs;

    if (remainingBudgetMs < sendTimeoutMs + 3000) {
      const remainingItems = claimedEmails.slice(i);
      for (const item of remainingItems) {
        if (item.claimToken) {
          await prisma.emailOutbox.updateMany({
            where: {
              id: item.id,
              claimToken: item.claimToken,
              status: EmailStatus.PROCESSING,
            },
            data: {
              status: EmailStatus.PENDING,
              lockedAt: null,
              lockedBy: null,
              claimToken: null,
            },
          });
        }
      }
      break;
    }

    const currentAttempt = email.attemptCount + 1;

    try {
      const fromAddress = `"${config.fromName}" <${config.fromEmail}>`;
      const toAddress = email.recipientName
        ? `"${email.recipientName}" <${email.recipientEmail}>`
        : email.recipientEmail;

      const stableMessageId = buildStableMessageId(
        email.id,
        config.fromEmail,
        options.domainOverride
      );

      const markerResult = await prisma.emailOutbox.updateMany({
        where: {
          id: email.id,
          claimToken: email.claimToken,
          status: EmailStatus.PROCESSING,
        },
        data: {
          lastError: `IN_FLIGHT_TRANSMISSION:worker_${workerId}:${email.claimToken}`,
        },
      });

      if (markerResult.count === 0) {
        lostOwnership++;
        continue;
      }

      let smtpAccepted = false;
      try {
        await sendMailWithTimeout(
          transporter,
          {
            from: fromAddress,
            to: toAddress,
            subject: email.subject,
            text: email.textBody,
            html: email.htmlBody || undefined,
            messageId: stableMessageId,
            headers: {
              "X-AIPP-Outbox-ID": email.id,
              "X-AIPP-Category": email.category,
              "X-AIPP-Attempt": String(currentAttempt),
            },
          },
          sendTimeoutMs
        );
        smtpAccepted = true;
      } catch (sendErr: unknown) {
        const sanitizedError = sanitizeErrorMessage(sendErr);
        const classification = classifySmtpStageError(sendErr);
        const hasReachedMaxAttempts = currentAttempt >= email.maxAttempts;

        if (classification.isPermanent || classification.isAmbiguous || hasReachedMaxAttempts) {
          let failureReason = "";
          if (classification.isPermanent) {
            failureReason = `Permanent delivery failure (${classification.classification}): ${sanitizedError}`;
          } else if (classification.isAmbiguous) {
            failureReason = `AMBIGUOUS_DELIVERY: ${classification.reason} (${sanitizedError})`;
          } else {
            failureReason = `Maximum delivery attempts (${email.maxAttempts}) exceeded: ${sanitizedError}`;
          }

          const updateResult = await prisma.emailOutbox.updateMany({
            where: {
              id: email.id,
              claimToken: email.claimToken,
              status: EmailStatus.PROCESSING,
            },
            data: {
              status: EmailStatus.FAILED,
              failedAt: new Date(),
              attemptCount: currentAttempt,
              lockedAt: null,
              lockedBy: null,
              claimToken: null,
              nextRetryAt: null,
              lastError: failureReason,
            },
          });

          if (updateResult.count > 0) {
            await syncInquiryReplyOnOutboxTransition(email.id, EmailStatus.FAILED);
            failed++;
          } else {
            lostOwnership++;
          }
        } else {
          const delaySeconds = calculateNextRetryDelaySeconds(currentAttempt);
          const nextRetryAt = new Date(Date.now() + delaySeconds * 1000);

          const updateResult = await prisma.emailOutbox.updateMany({
            where: {
              id: email.id,
              claimToken: email.claimToken,
              status: EmailStatus.PROCESSING,
            },
            data: {
              status: EmailStatus.PENDING,
              nextRetryAt,
              attemptCount: currentAttempt,
              lockedAt: null,
              lockedBy: null,
              claimToken: null,
              lastError: `Temporary failure (${classification.classification}, attempt ${currentAttempt}/${email.maxAttempts}): ${sanitizedError}`,
            },
          });

          if (updateResult.count > 0) {
            await syncInquiryReplyOnOutboxTransition(email.id, EmailStatus.PENDING);
            retried++;
          } else {
            lostOwnership++;
          }
        }
      }

      if (smtpAccepted) {
        let dbPersisted = false;
        const maxDbRetries = 3;
        let lastDbErr: unknown = null;

        for (let dbAttempt = 1; dbAttempt <= maxDbRetries; dbAttempt++) {
          try {
            const updateResult = await prisma.emailOutbox.updateMany({
              where: {
                id: email.id,
                claimToken: email.claimToken,
                status: EmailStatus.PROCESSING,
              },
              data: {
                status: EmailStatus.ACCEPTED_BY_SMTP,
                acceptedAt: new Date(),
                attemptCount: currentAttempt,
                lockedAt: null,
                lockedBy: null,
                claimToken: null,
                nextRetryAt: null,
                lastError: null,
              },
            });

            if (updateResult.count > 0) {
              await syncInquiryReplyOnOutboxTransition(email.id, EmailStatus.ACCEPTED_BY_SMTP);
              succeeded++;
              dbPersisted = true;
              break;
            } else {
              lostOwnership++;
              dbPersisted = true;
              break;
            }
          } catch (dbErr: unknown) {
            lastDbErr = dbErr;
            if (dbAttempt < maxDbRetries) {
              await new Promise((resolve) => setTimeout(resolve, dbAttempt * 150));
            }
          }
        }

        if (!dbPersisted) {
          const sanitizedDbError = sanitizeErrorMessage(lastDbErr);
          try {
            await prisma.emailOutbox.updateMany({
              where: {
                id: email.id,
                claimToken: email.claimToken,
                status: EmailStatus.PROCESSING,
              },
              data: {
                status: EmailStatus.FAILED,
                failedAt: new Date(),
                attemptCount: currentAttempt,
                lockedAt: null,
                lockedBy: null,
                claimToken: null,
                nextRetryAt: null,
                lastError: `KNOWN_ACCEPTANCE_DB_FAILURE: Email was confirmed accepted by remote SMTP relay (250 OK), but database status persistence failed after retries (${sanitizedDbError}). Automatic resend suppressed to prevent duplicate delivery.`,
              },
            });
            await syncInquiryReplyOnOutboxTransition(email.id, EmailStatus.FAILED);
          } catch {
          }
          failed++;
        }
      }
    } catch (unhandledErr: unknown) {
      const sanitized = sanitizeErrorMessage(unhandledErr);
      try {
        await prisma.emailOutbox.updateMany({
          where: {
            id: email.id,
            claimToken: email.claimToken,
            status: EmailStatus.PROCESSING,
          },
          data: {
            status: EmailStatus.FAILED,
            failedAt: new Date(),
            attemptCount: currentAttempt,
            lockedAt: null,
            lockedBy: null,
            claimToken: null,
            lastError: `Unhandled worker error: ${sanitized}`,
          },
        });
        await syncInquiryReplyOnOutboxTransition(email.id, EmailStatus.FAILED);
      } catch {
      }
      failed++;
    }

    if (i < claimedEmails.length - 1) {
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  return {
    success: true,
    processed: succeeded + retried + failed,
    succeeded,
    retried,
    failed,
    recoveredStale,
    lostOwnership,
    durationMs: Date.now() - startTime,
    workerId,
  };
}
