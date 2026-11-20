import { escapeHtml, getCanonicalAppUrl } from "./inquiry-emails";

if (typeof window !== "undefined") {
  throw new Error("Inquiry replies service must never be imported in browser environments.");
}

export interface InquiryReplyEmailData {
  inquiryId: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  originalSubject?: string | null;
  originalMessage: string;
  replyContent: string;
  adminName?: string;
  subjectOverride?: string;
}

export function isInquiryRepliesEnabled(): boolean {
  const flag = (process.env.AIPP_INQUIRY_REPLIES_ENABLED || "").trim().toLowerCase();
  return flag === "true";
}

function formatParagraphsHtml(text: string): string {
  const safe = escapeHtml(text.trim());
  const paragraphs = safe.split(/\n\s*\n/);
  return paragraphs
    .map((p) => `<p style="margin: 0 0 16px 0; line-height: 1.7; font-size: 14px; color: #081D2E;">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function renderInquiryReplyEmail(
  data: InquiryReplyEmailData,
  options?: { baseUrl?: string }
): { subject: string; textBody: string; htmlBody: string } {
  const baseUrl = options?.baseUrl || getCanonicalAppUrl();
  const portalUrl = `${baseUrl}/contact`;
  const subject =
    data.subjectOverride?.trim() ||
    `AIPP Secretariat Response | ${data.referenceNumber}`;

  const safeName = escapeHtml(data.fullName || "Inquirer");
  const safeRef = escapeHtml(data.referenceNumber);
  const safeSubject = escapeHtml(data.originalSubject || "Institutional Inquiry");
  const safeYear = new Date().getFullYear();
  const safeAdminName = escapeHtml(data.adminName || "Secretariat Administration");
  const replyHtml = formatParagraphsHtml(data.replyContent);
  const safeOriginalExcerpt = escapeHtml(
    data.originalMessage.length > 500
      ? `${data.originalMessage.slice(0, 500)}...`
      : data.originalMessage
  );

  const textBody = [
    "============================================================",
    "ATHENA INSTITUTE FOR POLITICAL PRAXIS",
    "OFFICIAL INQUIRY RESPONSE",
    "============================================================",
    "",
    `Dear ${data.fullName || "Inquirer"},`,
    "",
    "Thank you for contacting the Athena Institute for Political Praxis.",
    `This communication is in response to your inquiry regarding "${data.originalSubject || "Institutional Inquiry"}".`,
    "",
    `Inquiry Reference Number: ${data.referenceNumber}`,
    "",
    "------------------------------------------------------------",
    `INSTITUTIONAL RESPONSE (From: ${data.adminName || "AIPP Secretariat"}):`,
    "------------------------------------------------------------",
    "",
    data.replyContent.trim(),
    "",
    "------------------------------------------------------------",
    "ORIGINAL SUBMISSION CONTEXT:",
    "------------------------------------------------------------",
    data.originalMessage.trim(),
    "",
    "------------------------------------------------------------",
    "For further institutional correspondence, please submit through our official portal:",
    portalUrl,
    "",
    "Athena Institute for Political Praxis (AIPP)",
    "Rigorous Political Science & Strategic Decision-Making",
    `Official Website: https://aipp.org.pk`,
    `© ${safeYear} Athena Institute for Political Praxis. All rights reserved.`,
    "Notice: This is an official institutional response. Automated replies to this email address are not monitored.",
    "============================================================",
  ].join("\n");

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F7F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #334155;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F7F7F7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background-color: #081D2E; padding: 32px 32px 28px 32px; border-bottom: 3px solid #B09C4B;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; color: #B09C4B; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">
                      Athena Institute for Political Praxis
                    </p>
                    <h1 style="margin: 0; color: #FFFFFF; font-size: 20px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.3;">
                      Official Inquiry Response
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #081D2E; font-weight: 600;">
                Dear ${safeName},
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.65; color: #334155;">
                Thank you for contacting the Athena Institute for Political Praxis regarding <strong>&ldquo;${safeSubject}&rdquo;</strong>.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #B09C4B; border-radius: 4px; margin: 20px 0;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <p style="margin: 0 0 4px 0; font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.08em;">
                      Inquiry Reference Number
                    </p>
                    <p style="margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 15px; font-weight: 700; color: #081D2E; letter-spacing: 0.04em;">
                      ${safeRef}
                    </p>
                  </td>
                </tr>
              </table>

              <div style="background-color: #FAF9F5; border: 1px solid #E2E8F0; border-left: 4px solid #0D2C49; padding: 22px 24px; border-radius: 6px; margin: 24px 0 28px 0;">
                <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 700; color: #0D2C49; text-transform: uppercase; letter-spacing: 0.08em;">
                  Secretariat Response &bull; Author: ${safeAdminName}
                </p>
                <div style="font-size: 14px; line-height: 1.7; color: #081D2E;">
                  ${replyHtml}
                </div>
              </div>

              <div style="border-top: 1px dashed #CBD5E1; padding-top: 18px; margin-top: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #64748B;">
                  Your Original Inquiry Message:
                </p>
                <div style="background-color: #F8FAFC; padding: 14px 16px; border-radius: 4px; font-size: 12px; line-height: 1.6; color: #64748B; border: 1px solid #E2E8F0; white-space: pre-wrap;">
${safeOriginalExcerpt}
                </div>
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
                <tr>
                  <td align="center">
                    <a href="${portalUrl}" style="display: inline-block; background-color: #0D2C49; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; padding: 10px 22px; border-radius: 6px;">
                      Visit AIPP Contact Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #081D2E;">
                Athena Institute for Political Praxis (AIPP)
              </p>
              <p style="margin: 0 0 12px 0; font-size: 11px; line-height: 1.5; color: #64748B;">
                Rigorous Political Science &bull; Strategic Decision-Making &bull; Applied Praxis<br>
                Official Website: <a href="https://aipp.org.pk" style="color: #0D2C49; text-decoration: underline;">https://aipp.org.pk</a>
              </p>
              <p style="margin: 0; font-size: 10px; line-height: 1.4; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 10px;">
                Notice: This official transactional communication is sent in direct response to inquiry ${safeRef}. Inbound messages to this address are not monitored. If you have additional inquiries, please visit our official portal.
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

export interface SanitizedDeliveryError {
  category:
    | "DNS_RESOLUTION_ERROR"
    | "AUTHENTICATION_ERROR"
    | "TLS_CERTIFICATE_ERROR"
    | "NETWORK_TIMEOUT"
    | "RECIPIENT_REJECTED"
    | "AMBIGUOUS_DELIVERY"
    | "SYSTEM_ERROR";
  explanation: string;
}

export function sanitizeReplyDeliveryError(
  rawError: string | null | undefined
): SanitizedDeliveryError | null {
  if (!rawError) return null;
  const lower = rawError.toLowerCase();

  if (
    lower.includes("enotfound") ||
    lower.includes("eai_again") ||
    lower.includes("edns") ||
    lower.includes("getaddrinfo") ||
    lower.includes("dns resolution") ||
    lower.includes("dns error") ||
    lower.includes("dns_failure")
  ) {
    return {
      category: "DNS_RESOLUTION_ERROR",
      explanation:
        "Mail server domain name resolution failed (DNS error). The system will retry automatically if eligible.",
    };
  }

  if (
    lower.includes("535") ||
    lower.includes("authentication") ||
    lower.includes("credential") ||
    lower.includes("eauth") ||
    lower.includes("invalid login") ||
    lower.includes("smtp_not_configured")
  ) {
    return {
      category: "AUTHENTICATION_ERROR",
      explanation:
        "Mail server authentication failed. The outbound email gateway credentials require system administrator attention.",
    };
  }

  if (
    lower.includes("certificate") ||
    lower.includes("tls") ||
    lower.includes("starttls") ||
    lower.includes("ssl") ||
    lower.includes("tls handshake")
  ) {
    return {
      category: "TLS_CERTIFICATE_ERROR",
      explanation:
        "TLS/SSL certificate negotiation with the mail server failed. The outbound security configuration requires administrator review.",
    };
  }

  if (
    lower.includes("known_acceptance") ||
    lower.includes("known acceptance")
  ) {
    return {
      category: "AMBIGUOUS_DELIVERY",
      explanation:
        "The email was confirmed accepted by the remote mail relay, but database status persistence failed after retries. Automatic resend was suppressed to prevent duplicate delivery.",
    };
  }

  if (
    lower.includes("ambiguous") ||
    lower.includes("post-submission") ||
    lower.includes("post_data") ||
    lower.includes("post_acceptance") ||
    lower.includes("post-acceptance") ||
    lower.includes("acceptance received") ||
    lower.includes("confirmation update failed") ||
    lower.includes("data transmission") ||
    lower.includes("after data") ||
    lower.includes("terminator") ||
    lower.includes("uncertain") ||
    lower.includes("relay acceptance") ||
    lower.includes("unknown outcome")
  ) {
    return {
      category: "AMBIGUOUS_DELIVERY",
      explanation:
        "Delivery outcome uncertain after message transmission. Automatic retry was held to prevent potential duplicate delivery to the recipient.",
    };
  }

  if (
    lower.includes("recipient") ||
    lower.includes("550") ||
    lower.includes("user unknown") ||
    lower.includes("mailbox unavailable") ||
    lower.includes("no such user")
  ) {
    return {
      category: "RECIPIENT_REJECTED",
      explanation:
        "Recipient address was rejected by the remote mail server. Please verify the recipient email address.",
    };
  }

  if (
    lower.includes("econnrefused") ||
    lower.includes("etimedout") ||
    lower.includes("enotfound") ||
    lower.includes("eai_again") ||
    lower.includes("network") ||
    lower.includes("socket") ||
    lower.includes("connection lost") ||
    lower.includes("connection failed") ||
    lower.includes("connection closed") ||
    lower.includes("timeout") ||
    lower.includes("timed out") ||
    lower.includes("hang up")
  ) {
    return {
      category: "NETWORK_TIMEOUT",
      explanation:
        "Temporary network connection timeout communicating with the mail server. The queue will retry automatically if eligible.",
    };
  }

  return {
    category: "SYSTEM_ERROR",
    explanation:
      "Email delivery could not be completed. Please review delivery logs or retry sending.",
  };
}

