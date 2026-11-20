"use client";

import { useState } from "react";
import {
  Server,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Send,
  Mail,
  Clock,
  Layers,
  HelpCircle,
  Wrench,
  History,
  FileSearch,
} from "lucide-react";
import type { SmtpDiagnosticResult } from "@/lib/email/smtp-diagnostic";
import type { ReconciliationReport, QueueOverviewStats } from "@/lib/email/reconciliation-service";

interface EmailDiagnosticClientProps {
  initialConfig: {
    host: string;
    port: number;
    secure: boolean;
    requireTLS: boolean;
    tlsRejectUnauthorized: boolean;
    userMasked: string;
    fromEmailMasked: string;
    fromName: string;
    testRecipientConfigured: boolean;
    testRecipientMasked?: string;
  };
  initialOutboxCounts: {
    total: number;
    pending: number;
    processing: number;
    accepted: number;
    failed: number;
    cancelled: number;
  };
  recentOutbox: Array<{
    id: string;
    recipientEmail: string;
    subject: string;
    category?: string;
    status: string;
    attemptCount: number;
    createdAt: string;
    idempotencyKey: string;
    lastError: string | null;
  }>;
  initialQueueOverview?: QueueOverviewStats | null;
}

export default function EmailDiagnosticClient({
  initialConfig,
  initialOutboxCounts,
  recentOutbox,
  initialQueueOverview,
}: EmailDiagnosticClientProps) {
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<SmtpDiagnosticResult | null>(null);
  const [diagnosticError, setDiagnosticError] = useState<string | null>(null);

  const [queueLoading, setQueueLoading] = useState(false);
  const [queueSuccess, setQueueSuccess] = useState<{
    id: string;
    idempotencyKey: string;
    status: string;
    recipient: string;
    isDuplicate?: boolean;
  } | null>(null);
  const [queueError, setQueueError] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const [queueStats, setQueueStats] = useState<QueueOverviewStats | null>(initialQueueOverview || null);
  const [reconciliationLoading, setReconciliationLoading] = useState(false);
  const [reconciliationReport, setReconciliationReport] = useState<ReconciliationReport | null>(null);
  const [reconciliationError, setReconciliationError] = useState<string | null>(null);
  const [reconciliationSuccess, setReconciliationSuccess] = useState<string | null>(null);
  const [retryFailed, setRetryFailed] = useState(false);
  const [allowAmbiguousRetry, setAllowAmbiguousRetry] = useState(false);

  const handleRunReconciliation = async (dryRun: boolean) => {
    setReconciliationLoading(true);
    setReconciliationError(null);
    setReconciliationSuccess(null);

    try {
      const res = await fetch("/api/admin/email/reconciliation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dryRun,
          retryFailed,
          allowAmbiguousRetry,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setReconciliationError(data.error || `Reconciliation request failed with HTTP ${res.status}`);
      } else {
        setReconciliationReport(data.report);
        setReconciliationSuccess(
          dryRun
            ? "Reconciliation audit completed in dry-run mode (no records modified)."
            : "Reconciliation execution completed (missing records queued, stale locks recovered)."
        );

        const statsRes = await fetch("/api/admin/email/reconciliation", { method: "GET" });
        const statsData = await statsRes.json();
        if (statsData.success && statsData.stats) {
          setQueueStats(statsData.stats);
        }
      }
    } catch (err: unknown) {
      setReconciliationError(
        err instanceof Error ? err.message : "Network error during reconciliation"
      );
    } finally {
      setReconciliationLoading(false);
    }
  };

  const handleRunDiagnostic = async () => {
    setDiagnosticLoading(true);
    setDiagnosticError(null);
    setDiagnosticResult(null);

    try {
      const res = await fetch("/api/admin/email/diagnostic", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      const data = await res.json();
      if (!res.ok && !data.diagnostic) {
        setDiagnosticError(data.error || `Diagnostic request failed with HTTP ${res.status}`);
      } else {
        setDiagnosticResult(data.diagnostic);
      }
    } catch (err: unknown) {
      setDiagnosticError(err instanceof Error ? err.message : "Network error during diagnostic execution");
    } finally {
      setDiagnosticLoading(false);
    }
  };

  const handleQueueTestEmail = async () => {
    if (!initialConfig.testRecipientConfigured) {
      setQueueError("SMTP_TEST_RECIPIENT is not configured in environment variables.");
      return;
    }

    setQueueLoading(true);
    setQueueError(null);
    setQueueSuccess(null);

    try {
      const res = await fetch("/api/admin/email/diagnostic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId: `manual-p51-${Date.now()}`,
          note: note.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setQueueError(data.error || `Queue request failed with HTTP ${res.status}`);
      } else {
        setQueueSuccess(data.outbox);
      }
    } catch (err: unknown) {
      setQueueError(err instanceof Error ? err.message : "Network error queueing test email");
    } finally {
      setQueueLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>SMTP Server</span>
            <Server className="w-4 h-4 text-[#081D2E]" />
          </div>
          <div className="text-xl font-bold text-[#081D2E] truncate">{initialConfig.host}</div>
          <div className="text-xs text-[#64748B] mt-1">
            Port {initialConfig.port} &bull; {initialConfig.secure ? "Direct TLS" : "STARTTLS"}
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Outbox</span>
            <Mail className="w-4 h-4 text-[#081D2E]" />
          </div>
          <div className="text-xl font-bold text-[#081D2E]">{initialOutboxCounts.total}</div>
          <div className="text-xs text-[#64748B] mt-1">
            {initialOutboxCounts.accepted} accepted &bull; {initialOutboxCounts.pending} pending
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Envelope Sender</span>
            <ShieldCheck className="w-4 h-4 text-[#081D2E]" />
          </div>
          <div className="text-sm font-semibold text-[#081D2E] truncate">{initialConfig.fromEmailMasked}</div>
          <div className="text-xs text-[#64748B] mt-1 truncate">{initialConfig.fromName}</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Test Recipient</span>
            <Send className="w-4 h-4 text-[#081D2E]" />
          </div>
          <div className="text-sm font-semibold text-[#081D2E] truncate">
            {initialConfig.testRecipientConfigured ? initialConfig.testRecipientMasked : "Not Configured"}
          </div>
          <div className="text-xs mt-1">
            {initialConfig.testRecipientConfigured ? (
              <span className="text-emerald-700 font-medium">Ready for controlled test</span>
            ) : (
              <span className="text-amber-700 font-medium">Requires SMTP_TEST_RECIPIENT</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#081D2E] flex items-center gap-2">
              <Server className="w-5 h-5 text-[#B09C4B]" />
              SMTP Connectivity & Transport Verification
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Runs server-side transport verification: network reachability, TLS handshake, and SMTP credential authentication.
            </p>
          </div>
          <button
            onClick={handleRunDiagnostic}
            disabled={diagnosticLoading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#081D2E] text-white text-xs font-semibold tracking-wider uppercase rounded hover:bg-[#081D2E]/90 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${diagnosticLoading ? "animate-spin" : ""}`} />
            {diagnosticLoading ? "Verifying Transport..." : "Run Diagnostic Test"}
          </button>
        </div>

        <div className="p-6 space-y-4">
          {diagnosticError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Diagnostic Request Failed</p>
                <p className="mt-1">{diagnosticError}</p>
              </div>
            </div>
          )}

          {diagnosticResult && (
            <div
              className={`p-5 rounded-lg border text-xs ${
                diagnosticResult.success ? "bg-emerald-50/60 border-emerald-200" : "bg-amber-50/60 border-amber-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  {diagnosticResult.success ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-[#081D2E]">
                      {diagnosticResult.success
                        ? "SMTP Transport Verification Successful"
                        : "SMTP Verification Encountered An Issue"}
                    </h3>
                    <p className="text-[#64748B] text-xs mt-0.5">Tested at {diagnosticResult.timestamp}</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                    diagnosticResult.success ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {diagnosticResult.success ? "Verified" : diagnosticResult.error?.category || "Failed"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#E2E8F0]/60 text-xs">
                <div>
                  <span className="text-[#64748B] block">Configuration:</span>
                  <span className="font-semibold text-[#081D2E]">
                    {diagnosticResult.details.configurationValid ? "Valid" : "Invalid"}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Server Reachable:</span>
                  <span className="font-semibold text-[#081D2E]">
                    {diagnosticResult.details.serverReachable ? "Connected" : "Unreachable"}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block">TLS Negotiation:</span>
                  <span className="font-semibold text-[#081D2E]">
                    {diagnosticResult.details.tlsNegotiated ? "Established" : "Failed"}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Authentication:</span>
                  <span className="font-semibold text-[#081D2E]">
                    {diagnosticResult.details.authenticationSuccessful ? "Accepted (235)" : "Rejected"}
                  </span>
                </div>
              </div>

              {diagnosticResult.error && (
                <div className="mt-3 p-3 bg-red-100/60 border border-red-200 rounded text-red-800 text-xs">
                  <strong>Error ({diagnosticResult.error.category}):</strong> {diagnosticResult.error.message}
                </div>
              )}

              <div className="mt-3 pt-2 text-[11px] text-[#64748B] flex items-center gap-1.5 italic">
                <HelpCircle className="w-3.5 h-3.5 text-[#B09C4B] shrink-0" />
                {diagnosticResult.disclaimer}
              </div>
            </div>
          )}

          {!diagnosticResult && !diagnosticError && (
            <p className="text-xs text-[#64748B] italic">
              Click &quot;Run Diagnostic Test&quot; to test live SMTP connectivity and authentication without dispatching any emails.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E2E8F0]">
          <h2 className="text-lg font-bold text-[#081D2E] flex items-center gap-2">
            <Send className="w-5 h-5 text-[#B09C4B]" />
            Controlled Test Email Dispatch
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Enqueues exactly one controlled test message into the PostgreSQL EmailOutbox. Requires SUPER_ADMIN authority.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {!initialConfig.testRecipientConfigured ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">SMTP_TEST_RECIPIENT Is Not Configured</p>
                <p className="mt-1">
                  In accordance with Phase 5.1 safety rules, the system will not invent or choose a test recipient.
                  Please configure <code>SMTP_TEST_RECIPIENT=&quot;your-email@domain.com&quot;</code> in <code>.env</code> before
                  initiating a controlled test email.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Designated Recipient:</span>
                  <span className="font-mono font-semibold text-[#081D2E]">{initialConfig.testRecipientMasked}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Enqueue Service:</span>
                  <span className="font-mono text-[#081D2E]">PostgreSQL EmailOutbox (status = PENDING)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Worker Claiming:</span>
                  <span className="font-mono text-[#081D2E]">Atomic claim-token fencing with exponential backoff</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#081D2E] uppercase tracking-wider mb-1">
                  Optional Operator Note (Audited in Email Body)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Phase 5.1 Controlled Outbox Verification Run"
                  maxLength={150}
                  className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded bg-white text-[#081D2E] focus:outline-none focus:border-[#081D2E]"
                />
              </div>

              {queueError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  <strong>Enqueue Failed:</strong> {queueError}
                </div>
              )}

              {queueSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {queueSuccess.isDuplicate
                      ? "Idempotency Protection: Existing Record Preserved (No Duplicate)"
                      : "Test Email Successfully Enqueued"}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-emerald-200 font-mono text-[11px]">
                    <div>
                      <span className="text-emerald-700">Outbox ID:</span> {queueSuccess.id}
                    </div>
                    <div>
                      <span className="text-emerald-700">Status:</span> {queueSuccess.status}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-emerald-700">Idempotency Key:</span> {queueSuccess.idempotencyKey}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleQueueTestEmail}
                disabled={queueLoading || !initialConfig.testRecipientConfigured}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#B09C4B] text-white text-xs font-semibold tracking-wider uppercase rounded hover:bg-[#B09C4B]/90 disabled:opacity-50 transition-colors"
              >
                <Send className={`w-3.5 h-3.5 ${queueLoading ? "animate-pulse" : ""}`} />
                {queueLoading ? "Queueing Test Message..." : "Queue Controlled Test Email"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#081D2E] flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#B09C4B]" />
              Queue Recovery & Safe Reconciliation
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Audit inquiry records against EmailOutbox, recover stale worker leases, and repair missing transactional emails.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#081D2E] font-medium">
                <input
                  type="checkbox"
                  checked={retryFailed}
                  onChange={(e) => {
                    setRetryFailed(e.target.checked);
                    if (!e.target.checked) setAllowAmbiguousRetry(false);
                  }}
                  className="rounded border-[#E2E8F0] text-[#081D2E] focus:ring-0"
                />
                Retry Failed
              </label>

              {retryFailed && (
                <label className="flex items-center gap-2 cursor-pointer text-amber-900 font-medium bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  <input
                    type="checkbox"
                    checked={allowAmbiguousRetry}
                    onChange={(e) => setAllowAmbiguousRetry(e.target.checked)}
                    className="rounded border-amber-300 text-amber-700 focus:ring-0"
                  />
                  Allow Ambiguous Retry
                </label>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRunReconciliation(true)}
                disabled={reconciliationLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E2E8F0] text-xs font-semibold text-[#081D2E] rounded hover:bg-[#F8FAFC] disabled:opacity-50 transition-colors"
              >
                <FileSearch className={`w-3.5 h-3.5 ${reconciliationLoading ? "animate-spin" : ""}`} />
                Run Audit (Dry-Run)
              </button>
              <button
                onClick={() => handleRunReconciliation(false)}
                disabled={reconciliationLoading || queueStats?.rolloutConfigured === false}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#081D2E] text-white text-xs font-semibold rounded hover:bg-[#081D2E]/90 disabled:opacity-50 transition-colors"
                title={queueStats?.rolloutConfigured === false ? "Live reconciliation disabled: AIPP_EMAIL_ROLLOUT_TIMESTAMP is missing or invalid" : undefined}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${reconciliationLoading ? "animate-spin" : ""}`} />
                Execute Reconciliation
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {retryFailed && allowAmbiguousRetry && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Warning: Duplicate Delivery Risk.</strong> Authorizing retry of ambiguous delivery records may send duplicate emails if the upstream SMTP server accepted the original transmission before timeout. Only enable this if delivery failure has been confirmed with recipient or external logs.
              </div>
            </div>
          )}

          {queueStats?.rolloutConfigured === false ? (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-xs text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 font-bold block mb-0.5">Rollout Cutoff Timestamp Missing or Invalid</strong>
                Production rollout cutoff (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-900">AIPP_EMAIL_ROLLOUT_TIMESTAMP</code>) is not configured. Live reconciliation execution is disabled to prevent accidental enqueueing of historical inquiries. Audit dry-runs remain available.
              </div>
            </div>
          ) : (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 text-xs text-[#64748B] flex items-start gap-3">
              <History className="w-5 h-5 text-[#B09C4B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#081D2E]">Historical Data Protection Active:</strong> Inquiries submitted prior to{" "}
                <span className="font-mono font-medium text-[#081D2E]">
                  {queueStats?.cutoffTimestamp}
                </span>{" "}
                are classified as historical records. Reconciliation will strictly ignore these inquiries and will never enqueue transactional emails for them.
              </div>
            </div>
          )}

          {(queueStats?.ambiguousDeliveryCount ?? 0) > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Ambiguous Deliveries Requiring Review ({queueStats?.ambiguousDeliveryCount}):</strong> One or more dispatches experienced connection timeout or lost responses after SMTP handoff. Automated retries are suspended to prevent duplicate delivery. Review logs below.
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-center">
            <div className="border border-[#E2E8F0] rounded p-3 bg-white">
              <div className="text-[11px] uppercase font-semibold text-[#64748B]">Pending</div>
              <div className="text-lg font-bold text-[#081D2E] mt-1">
                {queueStats?.pending ?? initialOutboxCounts.pending}
              </div>
            </div>
            <div className="border border-[#E2E8F0] rounded p-3 bg-white">
              <div className="text-[11px] uppercase font-semibold text-[#64748B]">Processing</div>
              <div className="text-lg font-bold text-[#081D2E] mt-1">
                {queueStats?.processing ?? initialOutboxCounts.processing}
              </div>
            </div>
            <div className={`border rounded p-3 ${
              (queueStats?.staleProcessing ?? 0) > 0
                ? "border-amber-300 bg-amber-50"
                : "border-[#E2E8F0] bg-white"
            }`}>
              <div className="text-[11px] uppercase font-semibold text-[#64748B]">Stale Leases</div>
              <div className={`text-lg font-bold mt-1 ${
                (queueStats?.staleProcessing ?? 0) > 0 ? "text-amber-800" : "text-[#081D2E]"
              }`}>
                {queueStats?.staleProcessing ?? 0}
              </div>
            </div>
            <div className="border border-[#E2E8F0] rounded p-3 bg-white">
              <div className="text-[11px] uppercase font-semibold text-[#64748B]">Accepted</div>
              <div className="text-lg font-bold text-emerald-700 mt-1">
                {queueStats?.accepted ?? initialOutboxCounts.accepted}
              </div>
            </div>
            <div className={`border rounded p-3 ${
              (queueStats?.permanentFailureCount ?? (queueStats?.failed ?? initialOutboxCounts.failed)) > 0
                ? "border-red-300 bg-red-50"
                : "border-[#E2E8F0] bg-white"
            }`}>
              <div className="text-[11px] uppercase font-semibold text-[#64748B]">Permanent Fail</div>
              <div className={`text-lg font-bold mt-1 ${
                (queueStats?.permanentFailureCount ?? (queueStats?.failed ?? initialOutboxCounts.failed)) > 0 ? "text-red-700" : "text-[#081D2E]"
              }`}>
                {queueStats?.permanentFailureCount ?? (queueStats?.failed ?? initialOutboxCounts.failed)}
              </div>
            </div>
            <div className={`border rounded p-3 ${
              (queueStats?.ambiguousDeliveryCount ?? 0) > 0
                ? "border-amber-400 bg-amber-50"
                : "border-[#E2E8F0] bg-white"
            }`}>
              <div className="text-[11px] uppercase font-semibold text-amber-800">Ambiguous Review</div>
              <div className={`text-lg font-bold mt-1 ${
                (queueStats?.ambiguousDeliveryCount ?? 0) > 0 ? "text-amber-800 font-extrabold" : "text-[#081D2E]"
              }`}>
                {queueStats?.ambiguousDeliveryCount ?? 0}
              </div>
            </div>
            <div className="border border-[#E2E8F0] rounded p-3 bg-white">
              <div className="text-[11px] uppercase font-semibold text-[#64748B]">Eligible</div>
              <div className="text-lg font-bold text-[#081D2E] mt-1">
                {queueStats?.eligibleInquiriesCount ?? 0}
              </div>
            </div>
            <div className="border border-[#E2E8F0] rounded p-3 bg-white">
              <div className="text-[11px] uppercase font-semibold text-[#64748B]">Historical</div>
              <div className="text-lg font-bold text-[#64748B] mt-1">
                {queueStats?.historicalInquiriesCount ?? 0}
              </div>
            </div>
          </div>

          {reconciliationError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong>Reconciliation Error:</strong> {reconciliationError}
              </div>
            </div>
          )}

          {reconciliationSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>{reconciliationSuccess}</div>
            </div>
          )}

          {reconciliationReport && (
            <div className="border border-[#E2E8F0] rounded-lg p-5 bg-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E2E8F0] pb-3 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#081D2E] flex items-center gap-2">
                    <span>Reconciliation Audit Report</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      reconciliationReport.dryRun ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {reconciliationReport.dryRun ? "Dry-Run Mode" : "Live Execution"}
                    </span>
                  </h3>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    Executed at: {new Date(reconciliationReport.executedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {reconciliationReport.reconciliationDisabled && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Reconciliation Disabled:</strong> {reconciliationReport.reconciliationDisabledReason || "Rollout cutoff boundary is missing or invalid. Live repairs refused."}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Inquiries Scanned:</span>
                  <span className="font-bold text-[#081D2E] text-sm">{reconciliationReport.inquiriesScanned}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Historical Skipped:</span>
                  <span className="font-bold text-[#64748B] text-sm">{reconciliationReport.historicalInquiriesSkipped}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Missing Ack Detected:</span>
                  <span className="font-bold text-[#081D2E] text-sm">{reconciliationReport.missingAcknowledgementsDetected}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Missing Admin Detected:</span>
                  <span className="font-bold text-[#081D2E] text-sm">{reconciliationReport.missingAdminNotificationsDetected}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Ack Repaired:</span>
                  <span className="font-bold text-emerald-700 text-sm">{reconciliationReport.acknowledgementsRepaired}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Admin Repaired:</span>
                  <span className="font-bold text-emerald-700 text-sm">{reconciliationReport.adminNotificationsRepaired}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Stale Recovered:</span>
                  <span className="font-bold text-[#081D2E] text-sm">{reconciliationReport.staleProcessingRecovered}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Failed Found:</span>
                  <span className="font-bold text-red-700 text-sm">{reconciliationReport.failedEmailsFound}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Ambiguous Found:</span>
                  <span className="font-bold text-amber-800 text-sm">{reconciliationReport.ambiguousDeliveriesFound ?? 0}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Ambiguous Repaired:</span>
                  <span className="font-bold text-emerald-700 text-sm">{reconciliationReport.ambiguousDeliveriesRepaired ?? 0}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Ambiguous Skipped:</span>
                  <span className="font-bold text-amber-800 text-sm">{reconciliationReport.ambiguousDeliveriesSkipped ?? 0}</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Perm Failures Skipped:</span>
                  <span className="font-bold text-red-700 text-sm">{reconciliationReport.permanentFailuresSkipped ?? 0}</span>
                </div>
              </div>

              {reconciliationReport.details.length > 0 ? (
                <div className="border border-[#E2E8F0] rounded overflow-hidden mt-3">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider text-[10px] border-b border-[#E2E8F0]">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">Inquiry Ref</th>
                        <th className="px-4 py-2.5 font-semibold">Category</th>
                        <th className="px-4 py-2.5 font-semibold">Action</th>
                        <th className="px-4 py-2.5 font-semibold">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {reconciliationReport.details.map((d, idx) => (
                        <tr key={idx} className="hover:bg-[#F8FAFC]/60">
                          <td className="px-4 py-2.5 font-mono font-medium text-[#081D2E]">{d.referenceNumber}</td>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-[#64748B]">{d.category}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              d.action === "REPAIRED"
                                ? "bg-emerald-100 text-emerald-800"
                                : d.action === "DETECTED"
                                ? "bg-amber-100 text-amber-800"
                                : d.action === "ERROR"
                                ? "bg-red-100 text-red-800"
                                : "bg-slate-100 text-slate-700"
                            }`}>
                              {d.action}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-[#081D2E]">{d.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-[#64748B] bg-[#F8FAFC] rounded border border-dashed border-[#E2E8F0]">
                  All eligible inquiries have consistent outbox records. Zero discrepancies detected.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#081D2E] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#B09C4B]" />
              Recent Outbox Records
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Live records in the PostgreSQL EmailOutbox table.
            </p>
          </div>
          <span className="text-xs text-[#64748B] font-mono">
            {recentOutbox.length} entries shown
          </span>
        </div>

        <div className="overflow-x-auto">
          {recentOutbox.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B]">
              No records in the EmailOutbox table. Queue a controlled test email above to verify outbox persistence.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider text-[10px] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Recipient</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Subject</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Attempts</th>
                  <th className="px-4 py-3 font-semibold">Idempotency Key</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {recentOutbox.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F8FAFC]/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-[#081D2E]">{row.recipientEmail}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-700">
                        {row.category || "GENERAL"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#081D2E] max-w-[200px] truncate">{row.subject}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          row.status === "ACCEPTED_BY_SMTP"
                            ? "bg-emerald-100 text-emerald-800"
                            : row.status === "PROCESSING"
                            ? "bg-blue-100 text-blue-800"
                            : row.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#64748B] font-mono">{row.attemptCount}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#64748B] max-w-[180px] truncate">
                      {row.idempotencyKey}
                    </td>
                    <td className="px-4 py-3 text-[#64748B] whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#64748B]" />
                        {new Date(row.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

