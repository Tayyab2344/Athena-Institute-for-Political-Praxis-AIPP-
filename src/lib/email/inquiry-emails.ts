import { enqueueEmail, buildEventIdempotencyKey } from "./enqueue-service";
import { sanitizeErrorMessage } from "./email-worker";
import type { Prisma } from "@prisma/client";

if (typeof window !== "undefined") {
  throw new Error("Inquiry email service must never be imported in browser environments.");
}

export interface InquiryEmailData {
  id: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  subject?: string | null;
  organization?: string | null;
  status?: string;
  createdAt: Date;
}

export interface InquiryEmailsDispatchResult {
  acknowledgementQueued: boolean;
  adminNotificationQueued: boolean;
  skippedReason?: string;
  acknowledgementOutboxId?: string;
  adminNotificationOutboxId?: string;
  errors?: string[];
}

/**
 * Escapes user-controlled text to prevent HTML injection in email templates.
 */
export function escapeHtml(unsafe: string | null | undefined): string {
  if (unsafe === null || unsafe === undefined) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Resolves the canonical, trusted base URL for application links.
 * Strictly avoids untrusted request Host headers to prevent host header injection.
 * Official production domain: https://aipp.org.pk
 */
export function getCanonicalAppUrl(): string {
  const isProd = process.env.NODE_ENV === "production";
  const envUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;

  if (envUrl && typeof envUrl === "string") {
    try {
      const parsed = new URL(envUrl.trim());
      // In production, reject non-HTTPS URLs and reject localhost / private network addresses
      if (isProd) {
        if (
          parsed.protocol === "https:" &&
          parsed.hostname !== "localhost" &&
          parsed.hostname !== "127.0.0.1" &&
          !parsed.hostname.startsWith("192.168.")
        ) {
          return parsed.origin;
        }
        console.warn(
          "[Canonical URL]: Rejected invalid or non-HTTPS APP_URL for production runtime:",
          envUrl
        );
      } else {
        // In development or testing environments, allow http/https loopback
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          return parsed.origin;
        }
      }
    } catch {
      console.warn("[Canonical URL]: Malformed APP_URL in environment:", envUrl);
    }
  }

  // Official verified production domain
  if (isProd) {
    return "https://aipp.org.pk";
  }

  return "http://localhost:3000";
}

/**
 * Checks whether the inquiry transactional email feature flag is active.
 * Defaults strictly to false unless explicitly configured to 'true'.
 */
export function isInquiryEmailEnabled(): boolean {
  const flag = (process.env.AIPP_INQUIRY_EMAILS_ENABLED || "").trim().toLowerCase();
  return flag === "true";
}

/**
 * Validates and retrieves the configured administrator notification recipient.
 * Returns null if unconfigured or invalid, logging a sanitized configuration warning.
 */
export function getInquiryNotificationEmail(): string | null {
  const rawEmail = (process.env.INQUIRY_NOTIFICATION_EMAIL || "").trim();
  if (!rawEmail) {
    return null;
  }

  // Prevent CRLF injection and validate standard email format
  if (/[\r\n]/.test(rawEmail) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
    console.warn(
      "[Inquiry Emails]: INQUIRY_NOTIFICATION_EMAIL is configured but invalid. Notification will be skipped."
    );
    return null;
  }

  return rawEmail.toLowerCase();
}

/**
 * Renders the Inquiry Acknowledgement email (HTML and plain text).
 * Sent to the visitor who submitted the inquiry.
 */
export function renderInquiryAcknowledgement(
  inquiry: InquiryEmailData,
  options?: { baseUrl?: string }
): { subject: string; textBody: string; htmlBody: string } {
  const baseUrl = options?.baseUrl || getCanonicalAppUrl();
  const contactUrl = `${baseUrl}/contact`;
  const subject = `AIPP has received your inquiry | ${inquiry.referenceNumber}`;

  const safeName = escapeHtml(inquiry.fullName || "Inquirer");
  const safeRef = escapeHtml(inquiry.referenceNumber);
  const safeSubject = escapeHtml(inquiry.subject || "Institutional Inquiry");
  const safeYear = new Date().getFullYear();

  // Plain-Text Version
  const textBody = [
    "============================================================",
    "ATHENA INSTITUTE FOR POLITICAL PRAXIS",
    "INQUIRY ACKNOWLEDGEMENT",
    "============================================================",
    "",
    `Dear ${inquiry.fullName || "Inquirer"},`,
    "",
    "Thank you for reaching out to the Athena Institute for Political Praxis.",
    `We have formally received your inquiry regarding "${inquiry.subject || "Institutional Inquiry"}".`,
    "",
    `Inquiry Reference Number: ${inquiry.referenceNumber}`,
    "",
    "Your inquiry has been logged in our institutional registry and forwarded",
    "to the Secretariat for review. Our team will examine the details and",
    "follow up if further coordination or information is required.",
    "",
    `For additional information or inquiries, please visit:`,
    contactUrl,
    "",
    "------------------------------------------------------------",
    "Athena Institute for Political Praxis (AIPP)",
    "Rigorous Political Science & Strategic Decision-Making",
    "Official Portal: " + baseUrl,
    `© ${safeYear} Athena Institute for Political Praxis. All rights reserved.`,
    "============================================================",
  ].join("\n");

  // HTML Version
  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #334155;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #081D2E; padding: 32px 32px 28px 32px; border-bottom: 3px solid #B09C4B;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; color: #B09C4B; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">
                      Athena Institute for Political Praxis
                    </p>
                    <h1 style="margin: 0; color: #FFFFFF; font-size: 20px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.3;">
                      Inquiry Acknowledgement
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #081D2E; font-weight: 600;">
                Dear ${safeName},
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.65; color: #334155;">
                Thank you for contacting the Athena Institute for Political Praxis. We have successfully received your inquiry regarding <strong>&ldquo;${safeSubject}&rdquo;</strong>.
              </p>

              <!-- Reference Badge Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #B09C4B; border-radius: 4px; margin: 24px 0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.08em;">
                      Inquiry Reference Number
                    </p>
                    <p style="margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 16px; font-weight: 700; color: #081D2E; letter-spacing: 0.04em;">
                      ${safeRef}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.65; color: #334155;">
                Your submission has been formally entered into our institutional registry and forwarded to the Secretariat. Our team will review the details you provided and follow up if further information or coordination is needed.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.65; color: #334155;">
                Please retain your reference number for any future correspondence regarding this matter.
              </p>

              <!-- Action Link -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0 24px 0;">
                <tr>
                  <td align="left">
                    <a href="${contactUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0D2C49; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 4px; letter-spacing: 0.02em;">
                      Visit AIPP Contact Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Institutional Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #081D2E;">
                Athena Institute for Political Praxis
              </p>
              <p style="margin: 0 0 12px 0; font-size: 11px; line-height: 1.5; color: #64748B;">
                Rigorous Political Science &bull; Strategic Decision-Making &bull; Applied Praxis<br>
                Official Website: <a href="${baseUrl}" style="color: #0D2C49; text-decoration: underline;">${baseUrl.replace(/^https?:\/\//, "")}</a>
              </p>
              <p style="margin: 0; font-size: 10px; line-height: 1.4; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 10px;">
                Notice: This is an automated transactional acknowledgement sent in response to a submission through the AIPP public portal. If you did not make this submission, please disregard this notification.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, textBody, htmlBody };
}

/**
 * Renders the Admin Notification email (HTML and plain text).
 * Sent to the designated administrator inbox (INQUIRY_NOTIFICATION_EMAIL).
 */
export function renderInquiryAdminNotification(
  inquiry: InquiryEmailData,
  options?: { baseUrl?: string }
): { subject: string; textBody: string; htmlBody: string } {
  const baseUrl = options?.baseUrl || getCanonicalAppUrl();
  const inquiryUrl = `${baseUrl}/admin/inquiries/${inquiry.id}`;
  const subject = `[AIPP] New inquiry received | ${inquiry.referenceNumber}`;

  const safeRef = escapeHtml(inquiry.referenceNumber);
  const safeName = escapeHtml(inquiry.fullName || "Not provided");
  const safeEmail = escapeHtml(inquiry.email || "Not provided");
  const safeOrg = escapeHtml(inquiry.organization || "None specified");
  const safeSubject = escapeHtml(inquiry.subject || "General Inquiry");
  const formattedDate = inquiry.createdAt ? inquiry.createdAt.toUTCString() : new Date().toUTCString();

  // Plain-Text Version
  const textBody = [
    "============================================================",
    "AIPP ADMINISTRATIVE ALERT - NEW INQUIRY RECEIVED",
    "============================================================",
    "",
    "A new inquiry has been submitted through the AIPP public portal.",
    "",
    `Reference Number: ${inquiry.referenceNumber}`,
    `Submitter Name:   ${inquiry.fullName || "Not provided"}`,
    `Submitter Email:  ${inquiry.email || "Not provided"}`,
    `Organization:     ${inquiry.organization || "None specified"}`,
    `Category/Subject: ${inquiry.subject || "General Inquiry"}`,
    `Submitted At:     ${formattedDate}`,
    "",
    "Secure Admin Dashboard Link:",
    inquiryUrl,
    "",
    "Security Notice:",
    "For institutional data governance, the full message content and applicant",
    "details are restricted to the authenticated administrative console.",
    "Please log in to your administrative account to review and assign this inquiry.",
    "============================================================",
  ].join("\n");

  // HTML Version
  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #334155;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #081D2E; padding: 28px 32px; border-bottom: 3px solid #B09C4B;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px 0; color: #B09C4B; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">
                      Administrative Notification
                    </p>
                    <h1 style="margin: 0; color: #FFFFFF; font-size: 19px; font-weight: 700; letter-spacing: -0.01em;">
                      New Inquiry Received
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Summary Content -->
          <tr>
            <td style="padding: 28px 32px 20px 32px;">
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #334155;">
                A new inquiry has been formally submitted through the AIPP public portal and recorded in the PostgreSQL database.
              </p>

              <!-- Metadata Table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; margin: 0 0 24px 0; font-size: 13px;">
                <tr>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B; font-weight: 600; width: 140px;">
                    Reference
                  </td>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #E2E8F0; color: #081D2E; font-family: ui-monospace, monospace; font-weight: 700;">
                    ${safeRef}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B; font-weight: 600;">
                    Submitter
                  </td>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #E2E8F0; color: #081D2E; font-weight: 500;">
                    ${safeName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B; font-weight: 600;">
                    Email
                  </td>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #E2E8F0; color: #081D2E; font-mono font-size: 12px;">
                    ${safeEmail}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B; font-weight: 600;">
                    Organization
                  </td>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #E2E8F0; color: #334155;">
                    ${safeOrg}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B; font-weight: 600;">
                    Category/Subject
                  </td>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #E2E8F0; color: #081D2E; font-weight: 500;">
                    ${safeSubject}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #64748B; font-weight: 600;">
                    Submitted At
                  </td>
                  <td style="padding: 10px 16px; color: #64748B; font-size: 12px;">
                    ${formattedDate}
                  </td>
                </tr>
              </table>

              <!-- Secure Admin Link Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td align="left">
                    <a href="${inquiryUrl}" style="display: inline-block; padding: 11px 22px; background-color: #0D2C49; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 4px; letter-spacing: 0.02em;">
                      View Inquiry in Admin Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Callout -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFBEB; border-left: 3px solid #B09C4B; border-radius: 4px; margin: 0 0 10px 0;">
                <tr>
                  <td style="padding: 12px 16px; font-size: 12px; line-height: 1.5; color: #78350F;">
                    <strong>Security Notice:</strong> The inquiry message body and confidential applicant details are restricted to authenticated administrators. Standard login credentials are required to view this record.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 20px 32px; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #64748B;">
                AIPP Administrative Operations &bull; Automated Inquiry Routing<br>
                This internal notification is generated exclusively for designated AIPP administrative personnel.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, textBody, htmlBody };
}

/**
 * Handles the transactional email queueing for a newly created inquiry.
 * Enforces feature flags, deterministic idempotency, and error isolation.
 *
 * Safety Invariants:
 * 1. Honors AIPP_INQUIRY_EMAILS_ENABLED: Skips if disabled (default: false).
 * 2. SPAM Guard: Never queues emails if inquiry was classified as SPAM.
 * 3. Enqueues acknowledgement to the inquirer.
 * 4. Enqueues admin notification to INQUIRY_NOTIFICATION_EMAIL (if configured).
 * 5. Deterministic idempotency prevents duplicate outbox entries.
 * 6. Never throws: Returns error summary to ensure public inquiry submission never fails.
 */
export async function handleInquiryCreatedEmails(
  inquiry: InquiryEmailData,
  options?: { baseUrl?: string; tx?: Prisma.TransactionClient }
): Promise<InquiryEmailsDispatchResult> {
  const result: InquiryEmailsDispatchResult = {
    acknowledgementQueued: false,
    adminNotificationQueued: false,
    errors: [],
  };

  if (inquiry.status === "SPAM") {
    result.skippedReason = "Inquiry flagged as SPAM; transactional emails suppressed.";
    console.info(
      `[Inquiry Emails]: Suppressed emails for inquiry ${inquiry.referenceNumber} due to SPAM status.`
    );
    return result;
  }

  if (!isInquiryEmailEnabled()) {
    result.skippedReason = "Feature flag AIPP_INQUIRY_EMAILS_ENABLED is disabled.";
    console.info(
      `[Inquiry Emails]: Skipping inquiry emails for ${inquiry.referenceNumber} (AIPP_INQUIRY_EMAILS_ENABLED is false).`
    );
    return result;
  }

  console.info(
    `[Inquiry Emails]: Triggering transactional email workflow for inquiry ${inquiry.referenceNumber} (ID: ${inquiry.id}).`
  );

  const baseUrl = options?.baseUrl || getCanonicalAppUrl();

  try {
    const ackTemplate = renderInquiryAcknowledgement(inquiry, { baseUrl });
    const ackIdempotencyKey = buildEventIdempotencyKey("inquiry-acknowledgement", inquiry.id);

    const ackResult = await enqueueEmail(
      {
        recipientEmail: inquiry.email,
        recipientName: inquiry.fullName,
        subject: ackTemplate.subject,
        textBody: ackTemplate.textBody,
        htmlBody: ackTemplate.htmlBody,
        category: "INQUIRY_ACKNOWLEDGEMENT",
        idempotencyKey: ackIdempotencyKey,
        maxAttempts: 3,
      },
      options?.tx
    );

    result.acknowledgementQueued = true;
    result.acknowledgementOutboxId = ackResult.email.id;
    console.info(
      `[Inquiry Emails]: Acknowledgement queued for ${inquiry.referenceNumber} (outboxId=${ackResult.email.id}, isDuplicate=${ackResult.isDuplicate}).`
    );
  } catch (ackErr: unknown) {
    if (options?.tx) {
      throw ackErr;
    }
    const errorMsg = sanitizeErrorMessage(ackErr);
    result.errors?.push(`Acknowledgement enqueue failed: ${errorMsg}`);
    console.error(
      `[Inquiry Emails]: Failed to enqueue acknowledgement for ${inquiry.referenceNumber}:`,
      errorMsg
    );
  }

  const adminEmail = getInquiryNotificationEmail();
  if (!adminEmail) {
    console.info(
      `[Inquiry Emails]: Admin notification skipped for ${inquiry.referenceNumber}: INQUIRY_NOTIFICATION_EMAIL is unconfigured or invalid.`
    );
  } else {
    try {
      const adminTemplate = renderInquiryAdminNotification(inquiry, { baseUrl });
      const adminIdempotencyKey = buildEventIdempotencyKey("inquiry-admin-notification", inquiry.id);

      const adminResult = await enqueueEmail(
        {
          recipientEmail: adminEmail,
          recipientName: "AIPP Administration",
          subject: adminTemplate.subject,
          textBody: adminTemplate.textBody,
          htmlBody: adminTemplate.htmlBody,
          category: "INQUIRY_ADMIN_NOTIFICATION",
          idempotencyKey: adminIdempotencyKey,
          maxAttempts: 3,
        },
        options?.tx
      );

      result.adminNotificationQueued = true;
      result.adminNotificationOutboxId = adminResult.email.id;
      console.info(
        `[Inquiry Emails]: Admin notification queued for ${inquiry.referenceNumber} (outboxId=${adminResult.email.id}, isDuplicate=${adminResult.isDuplicate}).`
      );
    } catch (adminErr: unknown) {
      if (options?.tx) {
        throw adminErr;
      }
      const errorMsg = sanitizeErrorMessage(adminErr);
      result.errors?.push(`Admin notification enqueue failed: ${errorMsg}`);
      console.error(
        `[Inquiry Emails]: Failed to enqueue admin notification for ${inquiry.referenceNumber}:`,
        errorMsg
      );
    }
  }

  return result;
}

