import crypto from "crypto";
import { AdminRole } from "@prisma/client";
import { getSmtpConfig, validateSmtpConfig, createSmtpTransport } from "./smtp-config";
import { enqueueEmail, buildEventIdempotencyKey } from "./enqueue-service";
import { sanitizeErrorMessage } from "./email-worker";
import { SafeAdminUser } from "@/lib/auth/session";

if (typeof window !== "undefined") {
  throw new Error("SMTP diagnostic service must never be imported in browser environments.");
}

export type SmtpErrorCategory =
  | "CONFIG_ERROR"
  | "CONNECTION_ERROR"
  | "AUTH_ERROR"
  | "TIMEOUT_ERROR"
  | "UNKNOWN_ERROR";

export interface SmtpDiagnosticResult {
  success: boolean;
  step: "configuration" | "connectivity" | "authentication" | "complete";
  timestamp: string;
  sanitizedConfig: {
    host: string;
    port: number;
    secure: boolean;
    requireTLS: boolean;
    tlsRejectUnauthorized: boolean;
    user: string;
    fromEmail: string;
    fromName: string;
    testRecipientConfigured: boolean;
    testRecipientMasked?: string;
  };
  details: {
    configurationValid: boolean;
    serverReachable: boolean;
    tlsNegotiated: boolean;
    authenticationSuccessful: boolean;
    senderValid: boolean;
  };
  error?: {
    category: SmtpErrorCategory;
    message: string;
    code?: string;
    responseCode?: number;
  };
  disclaimer: string;
}

/**
 * Masks an email address for safe display in diagnostic reports.
 * e.g. "admin@aipp-praxis.org" -> "a***n@aipp-praxis.org"
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "[NOT_CONFIGURED]";
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

/**
 * Categorizes an SMTP error into configuration, connection, authentication, or timeout.
 */
export function categorizeSmtpError(err: unknown): {
  category: SmtpErrorCategory;
  message: string;
  code?: string;
  responseCode?: number;
} {
  const sanitized = sanitizeErrorMessage(err);
  const asObj = (err && typeof err === "object" ? err : {}) as {
    code?: string;
    responseCode?: number;
    command?: string;
  };

  const code = asObj.code;
  const responseCode = asObj.responseCode;
  const lowerMsg = (err instanceof Error ? err.message : String(err)).toLowerCase();

  // 1. Timeout errors
  if (
    code === "ETIMEDOUT" ||
    code === "ETIME" ||
    code === "EABORT" ||
    lowerMsg.includes("timeout") ||
    lowerMsg.includes("timed out")
  ) {
    return {
      category: "TIMEOUT_ERROR",
      message: `Connection to SMTP server timed out: ${sanitized}`,
      code,
      responseCode,
    };
  }

  // 2. Authentication errors
  if (
    code === "EAUTH" ||
    responseCode === 535 ||
    responseCode === 534 ||
    lowerMsg.includes("username and password not accepted") ||
    lowerMsg.includes("invalid credentials") ||
    lowerMsg.includes("authentication failed") ||
    lowerMsg.includes("badcredentials")
  ) {
    return {
      category: "AUTH_ERROR",
      message: `SMTP authentication failed. Verify SMTP_USER and SMTP_PASSWORD: ${sanitized}`,
      code,
      responseCode,
    };
  }

  // 3. Connection / DNS / TLS errors
  if (
    code === "ENOTFOUND" ||
    code === "ECONNREFUSED" ||
    code === "ECONNRESET" ||
    code === "EHOSTUNREACH" ||
    code === "ESOCKET" ||
    lowerMsg.includes("getaddrinfo") ||
    lowerMsg.includes("connect econnrefused") ||
    lowerMsg.includes("handshake") ||
    lowerMsg.includes("certificate")
  ) {
    return {
      category: "CONNECTION_ERROR",
      message: `Unable to connect to SMTP server: ${sanitized}`,
      code,
      responseCode,
    };
  }

  return {
    category: "UNKNOWN_ERROR",
    message: sanitized,
    code,
    responseCode,
  };
}

/**
 * Executes a comprehensive, read-only SMTP diagnostic test.
 * Verifies configuration, connectivity, TLS negotiation, and authentication.
 * Never sends an email. Never exposes passwords or credentials.
 */
export async function runSmtpDiagnostic(
  customTransporter?: import("nodemailer").Transporter
): Promise<SmtpDiagnosticResult> {
  const timestamp = new Date().toISOString();
  const config = getSmtpConfig();
  const validation = validateSmtpConfig(config);

  const testRecipient = (process.env.SMTP_TEST_RECIPIENT || "").trim();
  const testRecipientConfigured = Boolean(testRecipient && testRecipient.includes("@"));

  const sanitizedConfig = {
    host: config.host || "[NOT_CONFIGURED]",
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    tlsRejectUnauthorized: config.tlsRejectUnauthorized,
    user: config.auth.user ? maskEmail(config.auth.user) : "[NOT_CONFIGURED]",
    fromEmail: config.fromEmail ? maskEmail(config.fromEmail) : "[NOT_CONFIGURED]",
    fromName: config.fromName,
    testRecipientConfigured,
    testRecipientMasked: testRecipientConfigured ? maskEmail(testRecipient) : undefined,
  };

  const disclaimer =
    "SMTP transport verification confirms network reachability and authentication, but does not guarantee delivery to recipient inboxes.";

  // Step 1: Configuration validation
  if (!validation.valid) {
    return {
      success: false,
      step: "configuration",
      timestamp,
      sanitizedConfig,
      details: {
        configurationValid: false,
        serverReachable: false,
        tlsNegotiated: false,
        authenticationSuccessful: false,
        senderValid: false,
      },
      error: {
        category: "CONFIG_ERROR",
        message: `SMTP configuration validation failed: ${validation.errors.join("; ")}`,
      },
      disclaimer,
    };
  }

  // Step 2 & 3: Transport verification (connectivity, TLS negotiation, and authentication)
  try {
    const transporter = customTransporter || createSmtpTransport({ config });

    // Enforce a strict diagnostic timeout of 10 seconds
    const verifyPromise = transporter.verify();
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timer = setTimeout(() => {
        const timeoutErr = new Error("SMTP diagnostic timed out after 10000ms");
        (timeoutErr as unknown as { code: string }).code = "ETIMEDOUT";
        reject(timeoutErr);
      }, 10000);
      timer.unref?.();
    });

    await Promise.race([verifyPromise, timeoutPromise]);

    return {
      success: true,
      step: "complete",
      timestamp,
      sanitizedConfig,
      details: {
        configurationValid: true,
        serverReachable: true,
        tlsNegotiated: true,
        authenticationSuccessful: true,
        senderValid: true,
      },
      disclaimer,
    };
  } catch (err: unknown) {
    const errorDetails = categorizeSmtpError(err);
    const isConn = errorDetails.category === "CONNECTION_ERROR" || errorDetails.category === "TIMEOUT_ERROR";

    return {
      success: false,
      step: isConn ? "connectivity" : "authentication",
      timestamp,
      sanitizedConfig,
      details: {
        configurationValid: true,
        serverReachable: !isConn,
        tlsNegotiated: !isConn,
        authenticationSuccessful: false,
        senderValid: true,
      },
      error: errorDetails,
      disclaimer,
    };
  }
}

export interface EnqueueControlledTestEmailInput {
  adminUser: SafeAdminUser;
  testId?: string;
  note?: string;
}

export interface EnqueueControlledTestEmailResult {
  success: boolean;
  isDuplicate?: boolean;
  emailId?: string;
  idempotencyKey?: string;
  status?: string;
  recipient?: string;
  scheduledAt?: Date;
  error?: string;
}

/**
 * Enqueues exactly one controlled test email into the EmailOutbox infrastructure.
 *
 * Strict Safety Invariants:
 * 1. Only callable by an active SUPER_ADMIN.
 * 2. Destination MUST match SMTP_TEST_RECIPIENT from the environment.
 * 3. Never uses an inquiry submitter, admin list, or customer address.
 * 4. Deterministic idempotency key prevents duplicate queueing.
 * 5. Passes strictly through the existing EmailOutbox persistence layer (no direct sendMail).
 */
export async function enqueueControlledTestEmail(
  input: EnqueueControlledTestEmailInput
): Promise<EnqueueControlledTestEmailResult> {
  const { adminUser, testId = "default-run", note } = input;

  // 1. Authorization Guard: SUPER_ADMIN only
  if (!adminUser || adminUser.role !== AdminRole.SUPER_ADMIN) {
    return {
      success: false,
      error: "Controlled test emails may only be queued by an authorized SUPER_ADMIN.",
    };
  }

  // 2. Strict Recipient Validation
  const testRecipient = (process.env.SMTP_TEST_RECIPIENT || "").trim().toLowerCase();

  if (!testRecipient) {
    return {
      success: false,
      error:
        "SMTP_TEST_RECIPIENT is not configured in the server environment. Please define SMTP_TEST_RECIPIENT with an authorized test address before queueing a test email.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testRecipient) || /[\r\n]/.test(testRecipient)) {
    return {
      success: false,
      error: `Configured SMTP_TEST_RECIPIENT is not a valid email address: "${testRecipient}".`,
    };
  }

  // 3. Stable Deterministic Idempotency Key
  // Format: "smtp-test-email:<recipient-hash>:<test-id>"
  const recipientHash = crypto.createHash("sha256").update(testRecipient).digest("hex").slice(0, 16);
  const idempotencyKey = buildEventIdempotencyKey("smtp-test-email", recipientHash, testId);

  // 4. Construct Safe Controlled Test Content
  const subject = "[AIPP Infrastructure Test] Controlled SMTP Outbox Verification";
  const timestamp = new Date().toISOString();

  const textBody = [
    "============================================================",
    "ATHENA INSTITUTE FOR POLITICAL PRAXIS - SMTP TEST DISPATCH",
    "============================================================",
    "",
    "This is an automated infrastructure test email verifying the",
    "AIPP EmailOutbox database queue and Nodemailer SMTP transport.",
    "",
    `Dispatched by: ${adminUser.name} (${adminUser.email})`,
    `Timestamp: ${timestamp}`,
    `Idempotency Key: ${idempotencyKey}`,
    note ? `Operator Note: ${note.replace(/[\r\n]/g, " ").trim()}` : "",
    "",
    "Notice: This message contains no confidential application data.",
    "If you received this message in error, please disregard.",
  ]
    .filter(Boolean)
    .join("\n");

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 8px; background-color: #FFFFFF;">
      <div style="border-bottom: 2px solid #081D2E; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #081D2E; margin: 0; font-size: 18px; letter-spacing: -0.01em;">AIPP SMTP Infrastructure Verification</h2>
        <p style="color: #64748B; font-size: 12px; margin: 4px 0 0 0;">Athena Institute for Political Praxis &bull; Outbox Verification</p>
      </div>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">
        This is a controlled infrastructure test verifying transactional email dispatch through the production PostgreSQL <code>EmailOutbox</code> queue and authenticated SMTP transport.
      </p>
      <div style="background-color: #F8FAFC; border-left: 3px solid #B09C4B; padding: 12px 16px; margin: 20px 0; font-size: 13px; color: #475569;">
        <p style="margin: 0 0 4px 0;"><strong>Initiated By:</strong> ${adminUser.name} (${adminUser.email})</p>
        <p style="margin: 0 0 4px 0;"><strong>Timestamp:</strong> ${timestamp}</p>
        <p style="margin: 0;"><strong>Idempotency Key:</strong> <code>${idempotencyKey}</code></p>
      </div>
      <p style="color: #94A3B8; font-size: 11px; margin-top: 24px; border-top: 1px solid #F1F5F9; padding-top: 12px;">
        Confidentiality Notice: This message contains no application or user data. Dispatched in compliance with AIPP Phase 5.1 verification protocol.
      </p>
    </div>
  `;

  // 5. Enqueue via standard outbox service (Never bypass outbox)
  try {
    const result = await enqueueEmail({
      recipientEmail: testRecipient,
      recipientName: "AIPP Controlled Test Recipient",
      subject,
      textBody,
      htmlBody,
      category: "INFRASTRUCTURE_TEST",
      idempotencyKey,
      maxAttempts: 3,
    });

    return {
      success: true,
      isDuplicate: result.isDuplicate,
      emailId: result.email.id,
      idempotencyKey: result.email.idempotencyKey,
      status: result.email.status,
      recipient: result.email.recipientEmail,
      scheduledAt: result.email.scheduledAt,
    };
  } catch (enqueueErr: unknown) {
    const errorMsg = enqueueErr instanceof Error ? enqueueErr.message : "Failed to enqueue test email";
    return {
      success: false,
      error: errorMsg,
    };
  }
}

