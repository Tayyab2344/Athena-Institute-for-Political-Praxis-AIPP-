import { escapeHtml, getCanonicalAppUrl } from "../inquiry-emails";

export interface NewsletterVerificationEmailParams {
  recipientEmail: string;
  rawToken: string;
  baseUrl?: string;
  expiresInHours?: number;
}

export interface RenderedNewsletterEmail {
  subject: string;
  textBody: string;
  htmlBody: string;
}

export function renderNewsletterVerificationEmail(
  params: NewsletterVerificationEmailParams
): RenderedNewsletterEmail {
  const baseUrl = params.baseUrl || getCanonicalAppUrl();
  const expiresInHours = params.expiresInHours || 24;
  const verificationUrl = `${baseUrl}/newsletter/verify#token=${encodeURIComponent(params.rawToken)}`;
  const currentYear = new Date().getFullYear();

  const subject = "Confirm your subscription - Athena Institute for Political Praxis";

  const textBody = [
    "============================================================",
    "ATHENA INSTITUTE FOR POLITICAL PRAXIS",
    "SUBSCRIPTION VERIFICATION",
    "============================================================",
    "",
    "Dear Colleague,",
    "",
    "Thank you for requesting a subscription to the Athena Institute for Political Praxis.",
    "",
    "Please confirm your email address by opening the following link in your browser:",
    verificationUrl,
    "",
    `This verification link is valid for ${expiresInHours} hours.`,
    "No research publications or announcements will be sent to your inbox until your subscription is confirmed.",
    "",
    "If you did not request this subscription, no further action is required. Your address will not be subscribed and this link will expire automatically.",
    "",
    "------------------------------------------------------------",
    "Athena Institute for Political Praxis (AIPP)",
    "Rigorous Political Science & Strategic Decision-Making",
    `Official Portal: ${baseUrl}`,
    `© ${currentYear} Athena Institute for Political Praxis. All rights reserved.`,
    "============================================================",
  ].join("\n");

  const safeUrl = escapeHtml(verificationUrl);
  const safeSubject = escapeHtml(subject);

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background-color: #0a192f; padding: 36px 32px; text-align: left; border-bottom: 3px solid #d4af37;">
              <p style="margin: 0 0 6px 0; color: #d4af37; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                Athena Institute for Political Praxis
              </p>
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600; letter-spacing: -0.5px;">
                Confirm Your Subscription
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
                Dear Colleague,
              </p>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155;">
                Thank you for your interest in the research, policy publications, and institutional announcements published by the Athena Institute for Political Praxis.
              </p>
              <p style="margin: 0 0 28px 0; font-size: 15px; color: #334155;">
                To complete your subscription and verify that you requested these communications, please click the confirmation button below:
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 32px 0;">
                <tr>
                  <td align="center" style="background-color: #0a192f; border-radius: 6px;">
                    <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px; letter-spacing: 0.5px; border: 1px solid #d4af37;">
                      Confirm Subscription
                    </a>
                  </td>
                </tr>
              </table>
              <div style="background-color: #f8fafc; border-left: 3px solid #d4af37; padding: 14px 18px; margin-bottom: 28px;">
                <p style="margin: 0; font-size: 13px; color: #475569;">
                  <strong>Note:</strong> This verification link is valid for <strong>${expiresInHours} hours</strong>. No newsletter publications or announcements will be transmitted to your email address until this confirmation step is completed.
                </p>
              </div>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">
                If the button above does not work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 28px 0; font-size: 12px; color: #1e3a8a; word-break: break-all;">
                <a href="${safeUrl}" style="color: #1e3a8a; text-decoration: underline;">${safeUrl}</a>
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                If you did not request this subscription, no action is necessary. Your email address will not be subscribed, and this verification link will expire automatically.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0; font-size: 11px; color: #64748b; font-weight: 600;">
                Athena Institute for Political Praxis
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                © ${currentYear} Athena Institute for Political Praxis. All rights reserved.
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

