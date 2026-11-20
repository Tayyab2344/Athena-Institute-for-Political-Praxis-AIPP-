import { redirect } from "next/navigation";
import { AdminRole, EmailStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromCookies } from "@/lib/auth/session";
import { getSmtpConfig } from "@/lib/email/smtp-config";
import { maskEmail } from "@/lib/email/smtp-diagnostic";
import { getQueueOverviewStats } from "@/lib/email/reconciliation-service";
import EmailDiagnosticClient from "@/components/admin/email/EmailDiagnosticClient";
import { ShieldAlert, Mail } from "lucide-react";

export const metadata = {
  title: "SMTP & Outbox Diagnostics | AIPP Admin",
  description: "Production SMTP connectivity, authentication diagnostics, and controlled outbox verification.",
};

export default async function AdminEmailPage() {
  const sessionData = await getAdminSessionFromCookies();
  if (!sessionData) {
    redirect("/admin/login?from=/admin/email");
  }

  const { user } = sessionData;

  // Strict RBAC: Accessible exclusively to SUPER_ADMIN
  if (user.role !== AdminRole.SUPER_ADMIN) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-900 flex items-start gap-4">
          <ShieldAlert className="w-8 h-8 text-red-600 shrink-0" />
          <div>
            <h1 className="text-lg font-bold">Access Restricted: Super Administrator Required</h1>
            <p className="text-xs text-red-700 mt-1">
              Your account role is <strong>{user.role}</strong>. SMTP infrastructure diagnostics, transport verification, and controlled email dispatching are strictly restricted to Super Administrators.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 1. Gather Sanitized Configuration
  const smtpConfig = getSmtpConfig();
  const testRecipient = (process.env.SMTP_TEST_RECIPIENT || "").trim();
  const testRecipientConfigured = Boolean(testRecipient && testRecipient.includes("@"));

  const initialConfig = {
    host: smtpConfig.host || "[NOT_CONFIGURED]",
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    requireTLS: smtpConfig.requireTLS,
    tlsRejectUnauthorized: smtpConfig.tlsRejectUnauthorized,
    userMasked: smtpConfig.auth.user ? maskEmail(smtpConfig.auth.user) : "[NOT_CONFIGURED]",
    fromEmailMasked: smtpConfig.fromEmail ? maskEmail(smtpConfig.fromEmail) : "[NOT_CONFIGURED]",
    fromName: smtpConfig.fromName,
    testRecipientConfigured,
    testRecipientMasked: testRecipientConfigured ? maskEmail(testRecipient) : undefined,
  };

  // 2. Query EmailOutbox statistics
  const [
    totalOutbox,
    pendingOutbox,
    processingOutbox,
    acceptedOutbox,
    failedOutbox,
    cancelledOutbox,
    recentRows,
  ] = await Promise.all([
    prisma.emailOutbox.count().catch(() => 0),
    prisma.emailOutbox.count({ where: { status: EmailStatus.PENDING } }).catch(() => 0),
    prisma.emailOutbox.count({ where: { status: EmailStatus.PROCESSING } }).catch(() => 0),
    prisma.emailOutbox.count({ where: { status: EmailStatus.ACCEPTED_BY_SMTP } }).catch(() => 0),
    prisma.emailOutbox.count({ where: { status: EmailStatus.FAILED } }).catch(() => 0),
    prisma.emailOutbox.count({ where: { status: EmailStatus.CANCELLED } }).catch(() => 0),
    prisma.emailOutbox.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        recipientEmail: true,
        subject: true,
        category: true,
        status: true,
        attemptCount: true,
        createdAt: true,
        idempotencyKey: true,
        lastError: true,
      },
    }).catch(() => []),
  ]);

  const queueOverview = await getQueueOverviewStats().catch(() => null);

  const initialOutboxCounts = {
    total: totalOutbox,
    pending: pendingOutbox,
    processing: processingOutbox,
    accepted: acceptedOutbox,
    failed: failedOutbox,
    cancelled: cancelledOutbox,
  };

  const serializedRecent = recentRows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
  }));

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#E2E8F0] pb-5">
        <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
          <span>Admin</span>
          <span>/</span>
          <span className="text-[#081D2E] font-medium">SMTP & Outbox Diagnostics</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#081D2E] flex items-center gap-2.5">
              <Mail className="w-6 h-6 text-[#B09C4B]" />
              SMTP Infrastructure & Controlled Testing
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Verify Nodemailer 10.5.0 SMTP connectivity, transport security, and execute controlled test dispatches via the PostgreSQL EmailOutbox.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold bg-[#081D2E]/10 text-[#081D2E]">
              Role: SUPER_ADMIN
            </span>
          </div>
        </div>
      </div>

      <EmailDiagnosticClient
        initialConfig={initialConfig}
        initialOutboxCounts={initialOutboxCounts}
        recentOutbox={serializedRecent}
        initialQueueOverview={queueOverview}
      />
    </div>
  );
}

