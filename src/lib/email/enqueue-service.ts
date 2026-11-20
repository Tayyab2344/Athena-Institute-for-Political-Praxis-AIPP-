import { prisma } from "@/lib/prisma";
import { EmailStatus, EmailOutbox, Prisma } from "@prisma/client";

if (typeof window !== "undefined") {
  throw new Error("Email enqueue service must never be imported in browser environments.");
}

export interface EnqueueEmailInput {
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  textBody: string;
  htmlBody?: string;
  category?: string;
  /**
   * Explicit, stable business-event idempotency key.
   * Format: <event-type>:<entity-id>[:qualifier] (e.g. "inquiry-confirmation:inquiry_123")
   * Must be between 8 and 128 characters and match /^[a-zA-Z0-9_.:-]+$/
   */
  idempotencyKey: string;
  scheduledAt?: Date;
  maxAttempts?: number;
}

export interface EnqueueEmailResult {
  email: EmailOutbox;
  isDuplicate: boolean;
}

/**
 * Validates email address format and blocks header injection.
 */
function validateEmailAddress(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  if (/[\r\n]/.test(email)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Cleans and validates single-line headers against SMTP injection attacks.
 */
function sanitizeSingleLineHeader(text: string, maxLength = 255): string {
  if (typeof text !== "string") {
    throw new Error("Expected string input for header value.");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("Header value contains forbidden newline or carriage return characters.");
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new Error("Header value cannot be empty.");
  }
  if (trimmed.length > maxLength) {
    return trimmed.slice(0, maxLength);
  }
  return trimmed;
}

/**
 * Constructs a standardized, stable business-event idempotency key.
 * Never includes timestamps or random values to ensure deterministic logical identity.
 *
 * Examples:
 *   buildEventIdempotencyKey("inquiry-confirmation", "inquiry_123") => "inquiry-confirmation:inquiry_123"
 *   buildEventIdempotencyKey("admin-notification", "inquiry_123", "superadmin") => "admin-notification:inquiry_123:superadmin"
 *   buildEventIdempotencyKey("inquiry-reply", "reply_456") => "inquiry-reply:reply_456"
 */
export function buildEventIdempotencyKey(
  eventType: string,
  entityId: string,
  qualifier?: string
): string {
  const cleanType = (eventType || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const cleanId = (entityId || "").trim().replace(/[^a-zA-Z0-9_.:-]/g, "");

  if (!cleanType) {
    throw new Error("Idempotency key construction requires a non-empty eventType.");
  }
  if (!cleanId) {
    throw new Error("Idempotency key construction requires a non-empty entityId.");
  }

  let key = `${cleanType}:${cleanId}`;
  if (qualifier) {
    const cleanQual = qualifier.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (cleanQual) {
      key += `:${cleanQual}`;
    }
  }

  if (key.length < 8) {
    key = `event:${key}`;
  }

  return key.slice(0, 128);
}

/**
 * Validates that an idempotency key conforms to strict length and format standards.
 */
export function validateIdempotencyKey(key: string): { valid: boolean; error?: string } {
  if (!key || typeof key !== "string") {
    return { valid: false, error: "An explicit idempotencyKey string is required for email enqueuing." };
  }
  const trimmed = key.trim();
  if (trimmed.length < 8) {
    return { valid: false, error: `Idempotency key "${trimmed}" is too short (${trimmed.length} chars). Minimum 8 characters required.` };
  }
  if (trimmed.length > 128) {
    return { valid: false, error: `Idempotency key is too long (${trimmed.length} chars). Maximum 128 characters allowed.` };
  }
  // Standard identifier format: alphanumeric, underscore, dot, colon, hyphen
  if (!/^[a-zA-Z0-9_.:-]+$/.test(trimmed)) {
    return {
      valid: false,
      error: `Idempotency key "${trimmed}" contains invalid characters. Must contain only letters, numbers, hyphens, colons, dots, and underscores.`,
    };
  }
  return { valid: true };
}

/**
 * Enqueues an email into the persistent PostgreSQL outbox.
 * Requires an explicit, stable business-event idempotency key.
 * Idempotent: Submitting the same idempotency key returns the existing record without creating duplicate entries.
 * Never attempts immediate SMTP dispatch.
 */
export async function enqueueEmail(
  input: EnqueueEmailInput,
  tx?: Prisma.TransactionClient
): Promise<EnqueueEmailResult> {
  const db = tx || prisma;
  const keyValidation = validateIdempotencyKey(input.idempotencyKey);
  if (!keyValidation.valid) {
    throw new Error(keyValidation.error);
  }
  const cleanIdempotencyKey = input.idempotencyKey.trim();

  // 2. Recipient validation
  if (!input.recipientEmail || !validateEmailAddress(input.recipientEmail)) {
    throw new Error(`Invalid recipient email address: "${input.recipientEmail || ""}"`);
  }
  const cleanRecipientEmail = input.recipientEmail.trim().toLowerCase();

  // 3. Recipient Name validation (optional)
  let cleanRecipientName: string | undefined = undefined;
  if (input.recipientName !== undefined && input.recipientName !== null) {
    const rawName = String(input.recipientName).trim();
    if (rawName.length > 0) {
      if (/[\r\n]/.test(rawName)) {
        throw new Error("Recipient name contains forbidden newline characters.");
      }
      cleanRecipientName = rawName.slice(0, 150);
    }
  }

  // 4. Subject validation & header injection check
  const cleanSubject = sanitizeSingleLineHeader(input.subject, 255);

  // 5. Body validation & size limits (max 500KB text, 1MB html)
  if (!input.textBody || typeof input.textBody !== "string" || input.textBody.trim().length === 0) {
    throw new Error("Email text body is required and cannot be empty.");
  }
  const cleanTextBody = input.textBody.trim();
  if (cleanTextBody.length > 500 * 1024) {
    throw new Error("Email text body exceeds maximum allowed size (500 KB).");
  }

  let cleanHtmlBody: string | undefined = undefined;
  if (input.htmlBody) {
    const rawHtml = String(input.htmlBody).trim();
    if (rawHtml.length > 1024 * 1024) {
      throw new Error("Email HTML body exceeds maximum allowed size (1 MB).");
    }
    if (rawHtml.length > 0) {
      cleanHtmlBody = rawHtml;
    }
  }

  // 6. Category sanitization
  const cleanCategory = (input.category || "GENERAL")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 50) || "GENERAL";

  // 7. Max attempts (clamped between 1 and 10, default 5)
  const maxAttempts = Math.max(1, Math.min(10, input.maxAttempts ?? 5));

  // 8. Scheduled time (defaults to now)
  const scheduledAt = input.scheduledAt instanceof Date && !isNaN(input.scheduledAt.getTime())
    ? input.scheduledAt
    : new Date();

  const existing = await db.emailOutbox.findUnique({
    where: { idempotencyKey: cleanIdempotencyKey },
  });

  if (existing) {
    return {
      email: existing,
      isDuplicate: true,
    };
  }

  try {
    const created = await db.emailOutbox.create({
      data: {
        idempotencyKey: cleanIdempotencyKey,
        recipientEmail: cleanRecipientEmail,
        recipientName: cleanRecipientName,
        subject: cleanSubject,
        textBody: cleanTextBody,
        htmlBody: cleanHtmlBody,
        category: cleanCategory,
        status: EmailStatus.PENDING,
        attemptCount: 0,
        maxAttempts,
        scheduledAt,
      },
    });

    return {
      email: created,
      isDuplicate: false,
    };
  } catch (err: unknown) {
    const errCode = (err as { code?: string })?.code;
    if (errCode === "P2002") {
      const racedRecord = await db.emailOutbox.findUnique({
        where: { idempotencyKey: cleanIdempotencyKey },
      });
      if (racedRecord) {
        return {
          email: racedRecord,
          isDuplicate: true,
        };
      }
    }
    throw err;
  }
}
