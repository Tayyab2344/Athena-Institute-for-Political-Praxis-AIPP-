"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Building2,
  Phone,
  CheckCircle2,
  AlertCircle,
  Lock,
  Send,
  Loader2,
  Archive,
  AlertTriangle,
  History,
  Eye,
  Clock,
  X,
  MessageSquare,
  RotateCcw,
} from "lucide-react";

interface Assignee {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface InquiryNote {
  id: string;
  content: string;
  createdAt: string;
  adminUser: {
    id: string;
    name: string;
    role: string;
  };
}

interface InquiryActivity {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
  adminUser?: {
    id: string;
    name: string;
    role: string;
  } | null;
}

interface InquiryReplyItem {
  id: string;
  recipientEmail: string;
  subject: string;
  content: string;
  status: "PENDING" | "PROCESSING" | "ACCEPTED_BY_SMTP" | "FAILED" | "CANCELLED";
  createdAt: string;
  authorName?: string | null;
  authorEmail?: string | null;
  adminUser?: {
    id: string;
    name: string;
    role: string;
  } | null;
  outbox?: {
    id: string;
    status: "PENDING" | "PROCESSING" | "ACCEPTED_BY_SMTP" | "FAILED" | "CANCELLED";
    attemptCount: number;
    acceptedAt: string | null;
    failedAt: string | null;
    errorCategory: string | null;
    errorExplanation: string | null;
    createdAt: string;
  } | null;
}

interface InquiryDetail {
  id: string;
  referenceNumber: string;
  inquiryType: string;
  fullName: string;
  email: string;
  organization: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  sourceForm: string;
  status: "NEW" | "IN_PROGRESS" | "AWAITING_RESPONSE" | "RESOLVED" | "SPAM" | "ARCHIVED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignedTo: Assignee | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  notes: InquiryNote[];
  activities: InquiryActivity[];
  replies?: InquiryReplyItem[];
}

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const generateSafeUuid = (): string => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID().toLowerCase();
  }
  const bytes = new Uint8Array(16);
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) {
      bytes[i] = (Math.random() * 256) | 0;
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`.toLowerCase();
};

export default function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [submittingNote, setSubmittingNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [replyContent, setReplyContent] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.sessionStorage?.getItem(`aipp_reply_content_${id}`) || "";
    }
    return "";
  });
  const [replySubject, setReplySubject] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.sessionStorage?.getItem(`aipp_reply_subject_${id}`) || "";
    }
    return "";
  });
  const [submittingReply, setSubmittingReply] = useState(false);
  const [previewingReply, setPreviewingReply] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<{
    subject: string;
    htmlBody: string;
    textBody: string;
    recipientEmail: string;
    recipientName: string;
  } | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [replySuccess, setReplySuccess] = useState<string | null>(null);
  const [replyClientToken, setReplyClientToken] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = window.sessionStorage?.getItem(`aipp_reply_token_${id}`);
      if (stored && UUID_V4_REGEX.test(stored)) {
        return stored;
      }
      const fresh = generateSafeUuid();
      window.sessionStorage?.setItem(`aipp_reply_token_${id}`, fresh);
      return fresh;
    }
    return "";
  });
  const [retryingReplyId, setRetryingReplyId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [inqRes, assRes] = await Promise.all([
        fetch(`/api/inquiries/${id}`),
        fetch("/api/inquiries/assignees"),
      ]);

      if (!inqRes.ok) {
        throw new Error("Inquiry not found");
      }

      const inqData = await inqRes.json();
      setInquiry(inqData.inquiry);

      if (assRes.ok) {
        const assData = await assRes.json();
        setAssignees(assData.assignees || []);
      }
    } catch (err) {
      console.error("Failed to load inquiry", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function fetchDetail() {
      try {
        const [inqRes, assRes] = await Promise.all([
          fetch(`/api/inquiries/${id}`),
          fetch("/api/inquiries/assignees"),
        ]);

        if (!ignore && inqRes.status === 403) {
          setPermissionDenied(true);
          return;
        }

        if (!ignore && inqRes.ok) {
          const inqData = await inqRes.json();
          setInquiry(inqData.inquiry);
        }

        if (!ignore && assRes.ok) {
          const assData = await assRes.json();
          setAssignees(assData.assignees || []);
        }
      } catch (err) {
        console.error("Failed to load inquiry", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleUpdate = async (updates: {
    status?: InquiryDetail["status"];
    priority?: InquiryDetail["priority"];
    assignedToId?: string | null;
  }) => {
    setSavingStatus(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      setFeedbackMessage({ type: "success", text: "Inquiry successfully updated." });
      await loadData();
    } catch (err: unknown) {
      setFeedbackMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update inquiry.",
      });
    } finally {
      setSavingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setSubmittingNote(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/inquiries/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add note.");
      }

      setNoteContent("");
      setFeedbackMessage({ type: "success", text: "Internal note recorded." });
      await loadData();
    } catch (err: unknown) {
      setFeedbackMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save note.",
      });
    } finally {
      setSubmittingNote(false);
    }
  };

  const handlePreviewReply = async () => {
    if (!replyContent.trim()) {
      setReplyError("Please enter reply content before previewing.");
      return;
    }
    setPreviewingReply(true);
    setReplyError(null);
    try {
      const res = await fetch(`/api/inquiries/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent.trim(),
          subject: replySubject.trim() || undefined,
          preview: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate preview.");
      }
      setPreviewData(data);
      setShowPreviewModal(true);
    } catch (err: unknown) {
      setReplyError(err instanceof Error ? err.message : "Failed to generate preview.");
    } finally {
      setPreviewingReply(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    setSubmittingReply(true);
    setReplyError(null);
    setReplySuccess(null);
    try {
      let token = replyClientToken;
      if (!token || !UUID_V4_REGEX.test(token)) {
        token = generateSafeUuid();
        setReplyClientToken(token);
        if (typeof window !== "undefined") {
          window.sessionStorage?.setItem(`aipp_reply_token_${id}`, token);
        }
      }
      if (typeof window !== "undefined") {
        window.sessionStorage?.setItem(`aipp_reply_token_${id}`, token);
        window.sessionStorage?.setItem(`aipp_reply_content_${id}`, replyContent.trim());
        window.sessionStorage?.setItem(`aipp_reply_subject_${id}`, replySubject.trim());
      }
      const res = await fetch(`/api/inquiries/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent.trim(),
          subject: replySubject.trim() || undefined,
          clientToken: token,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (
          data.code === "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD" ||
          data.error?.includes("different reply payload") ||
          data.error?.includes("different reply content")
        ) {
          if (typeof window !== "undefined") {
            const nextToken = generateSafeUuid();
            setReplyClientToken(nextToken);
            window.sessionStorage?.setItem(`aipp_reply_token_${id}`, nextToken);
          }
        }
        throw new Error(data.error || "Failed to send inquiry reply.");
      }
      setReplyContent("");
      setReplySubject("");
      if (typeof window !== "undefined") {
        window.sessionStorage?.removeItem(`aipp_reply_token_${id}`);
        window.sessionStorage?.removeItem(`aipp_reply_content_${id}`);
        window.sessionStorage?.removeItem(`aipp_reply_subject_${id}`);
        const nextToken = generateSafeUuid();
        setReplyClientToken(nextToken);
        window.sessionStorage?.setItem(`aipp_reply_token_${id}`, nextToken);
      }
      setShowConfirmModal(false);
      setShowPreviewModal(false);
      setReplySuccess(
        data.idempotent
          ? "Reply acknowledged (idempotent replay of previously confirmed reply)."
          : "Reply enqueued successfully to the transactional outbox."
      );
      await loadData();
    } catch (err: unknown) {
      setReplyError(err instanceof Error ? err.message : "Failed to send reply.");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleRetryReply = async (replyId: string) => {
    setRetryingReplyId(replyId);
    setReplyError(null);
    setReplySuccess(null);
    try {
      const res = await fetch(`/api/inquiries/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "retry",
          replyId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to request redelivery.");
      }
      setReplySuccess("Redelivery requested successfully. Outbox reset to pending.");
      await loadData();
    } catch (err: unknown) {
      setReplyError(err instanceof Error ? err.message : "Failed to retry delivery.");
    } finally {
      setRetryingReplyId(null);
    }
  };

  const getOutboxStatusBadge = (status?: string) => {
    switch (status) {
      case "ACCEPTED_BY_SMTP":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Delivered to Mail Server</span>
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-semibold">
            <Loader2 className="w-3 h-3 text-sky-600 animate-spin" />
            <span>In Transmission</span>
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Delivery Failed</span>
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Queued in Outbox</span>
          </span>
        );
    }
  };

  const formatActivityAction = (action: string) => {
    switch (action) {
      case "INQUIRY_RECEIVED":
        return "Inquiry received and logged";
      case "REPLY_QUEUED":
        return "Official reply queued for delivery";
      case "REPLY_ACCEPTED_BY_SMTP":
        return "Official reply accepted by mail server";
      case "REPLY_FAILED":
        return "Official reply delivery failed";
      case "REPLY_RETRY_REQUESTED":
        return "Reply redelivery requested by administrator";
      case "REPLY_SENT":
        return "Official reply dispatched";
      case "STATUS_CHANGED":
        return "Status changed";
      case "PRIORITY_CHANGED":
        return "Priority updated";
      case "ASSIGNED":
        return "Assigned to administrator";
      case "UNASSIGNED":
        return "Inquiry unassigned";
      case "NOTE_ADDED":
        return "Internal note added";
      case "MARKED_SPAM":
        return "Marked as spam";
      case "ARCHIVED":
        return "Inquiry archived";
      default:
        return action.replace(/_/g, " ");
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#0D2C49] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-[#64717C] font-light">Loading inquiry record...</p>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto my-12 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-serif text-2xl text-[#081D2E]">Access Restricted</h2>
          <p className="text-xs font-sans text-[#64717C] leading-relaxed">
            Your administrator role does not have authorization to view this inquiry.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D2C49] text-white text-xs font-semibold hover:bg-[#081D2E] transition-colors"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="bg-white rounded-2xl border border-[#D9DEE2] p-12 text-center space-y-4 max-w-xl mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="font-serif text-xl text-[#081D2E]">Inquiry Record Not Found</h2>
        <p className="text-xs text-[#64717C]">
          The requested inquiry identifier could not be located in the database.
        </p>
        <Link
          href="/admin/inquiries"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0D2C49] text-white text-xs font-medium hover:bg-[#081D2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Inquiries</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Card with Breadcrumb & Quick Actions */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#D9DEE2] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DEE2]/60 pb-4">
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 text-xs text-[#64717C] hover:text-[#0D2C49] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Inquiries</span>
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-[#0D2C49]/5 text-[#0D2C49] border border-[#0D2C49]/15">
              {inquiry.referenceNumber}
            </span>
            <span className="text-xs text-[#64717C]">
              Received {new Date(inquiry.createdAt).toLocaleDateString()} at{" "}
              {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#081D2E] font-normal tracking-tight">
              {inquiry.subject || inquiry.inquiryType}
            </h1>
            <p className="text-xs font-sans text-[#64717C] mt-1 font-light">
              Submitted by <strong className="text-[#081D2E] font-medium">{inquiry.fullName}</strong>{" "}
              via {inquiry.sourceForm.replace(/_/g, " ")}
            </p>
          </div>

          {/* Quick Workflow Action Shortcuts */}
          <div className="flex items-center gap-2 flex-wrap">
            {inquiry.status !== "RESOLVED" && (
              <button
                type="button"
                onClick={() => handleUpdate({ status: "RESOLVED" })}
                disabled={savingStatus}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Resolved</span>
              </button>
            )}

            {inquiry.status !== "SPAM" && (
              <button
                type="button"
                onClick={() => handleUpdate({ status: "SPAM", priority: "LOW" })}
                disabled={savingStatus}
                className="px-3 py-2 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-sans font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Mark inquiry as spam"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Spam</span>
              </button>
            )}

            {inquiry.status !== "ARCHIVED" && (
              <button
                type="button"
                onClick={() => handleUpdate({ status: "ARCHIVED" })}
                disabled={savingStatus}
                className="px-3 py-2 rounded-lg border border-[#D9DEE2] hover:bg-slate-50 text-[#64717C] text-xs font-sans font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Archive inquiry"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              feedbackMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        )}
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Left Column (2 Cols): Submitter Info, Message, Internal Notes, Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submitter Details Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#D9DEE2] shadow-xs space-y-4">
            <h2 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#B09C4B]">
              Submitter &amp; Channel Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF9F5] border border-[#D9DEE2]/60">
                <User className="w-4 h-4 text-[#0D2C49] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase text-[#64717C] block tracking-wider">
                    Full Name
                  </span>
                  <span className="font-medium text-[#081D2E] text-sm">{inquiry.fullName}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF9F5] border border-[#D9DEE2]/60">
                <Mail className="w-4 h-4 text-[#0D2C49] mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase text-[#64717C] block tracking-wider">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="font-medium text-[#0D2C49] hover:underline block truncate"
                  >
                    {inquiry.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF9F5] border border-[#D9DEE2]/60">
                <Building2 className="w-4 h-4 text-[#0D2C49] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase text-[#64717C] block tracking-wider">
                    Organization / Institution
                  </span>
                  <span className="text-[#081D2E]">
                    {inquiry.organization || "Not Specified"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF9F5] border border-[#D9DEE2]/60">
                <Phone className="w-4 h-4 text-[#0D2C49] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase text-[#64717C] block tracking-wider">
                    Phone Number
                  </span>
                  <span className="text-[#081D2E]">
                    {inquiry.phone || "Not Provided"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Original Message Card */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#D9DEE2] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9DEE2]/60 pb-3">
              <h2 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#0D2C49]">
                Original Submission Message
              </h2>
              <span className="text-[11px] text-[#64717C]">
                {inquiry.message.length} characters
              </span>
            </div>

            <div className="bg-[#FAF9F5] p-5 rounded-xl border border-[#D9DEE2]/60 text-sm font-sans text-[#081D2E] leading-relaxed whitespace-pre-wrap select-text">
              {inquiry.message}
            </div>
          </div>

          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#D9DEE2] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#D9DEE2]/60 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0D2C49]" />
                <h2 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]">
                  Official Submitter Replies
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-semibold">
                Transactional Dispatch
              </span>
            </div>

            <p className="text-xs font-sans text-[#64717C] font-light leading-relaxed">
              Official communications composed here are queued in the transactional outbox and delivered directly to{" "}
              <strong className="text-[#081D2E] font-medium">{inquiry.email}</strong>.
            </p>

            {replySuccess && (
              <div className="p-3 rounded-xl text-xs flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{replySuccess}</span>
              </div>
            )}

            {replyError && (
              <div className="p-3 rounded-xl text-xs flex items-center gap-2 bg-rose-50 text-rose-800 border border-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{replyError}</span>
              </div>
            )}

            {inquiry.replies && inquiry.replies.length > 0 ? (
              <div className="space-y-4 pt-1">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#64717C]">
                  Reply History ({inquiry.replies.length})
                </h3>
                {inquiry.replies.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-xl bg-[#FAF9F5] border border-[#D9DEE2]/70 space-y-3 text-xs font-sans"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DEE2]/50 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-[#081D2E] font-medium">
                          {rep.authorName || rep.adminUser?.name || "Administrator"}
                        </strong>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 text-[9px] uppercase font-semibold">
                          {rep.adminUser?.role ? rep.adminUser.role.replace("_", " ") : "Administrator"}
                        </span>
                        <span className="text-[11px] text-[#64717C]">&bull; Sent to {rep.recipientEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getOutboxStatusBadge(rep.outbox?.status || rep.status)}
                        <span className="text-[11px] text-[#64717C]">
                          {new Date(rep.createdAt).toLocaleDateString()} at{" "}
                          {new Date(rep.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] font-medium text-[#0D2C49]">
                      Subject: {rep.subject}
                    </div>

                    <div className="text-[#081D2E] whitespace-pre-wrap leading-relaxed bg-white p-3.5 rounded-lg border border-[#D9DEE2]/60">
                      {rep.content}
                    </div>

                    {rep.outbox && rep.outbox.errorExplanation && (
                      <div className="text-[11px] text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <strong className="font-semibold block sm:inline">Delivery Notice: </strong>
                          <span>{rep.outbox.errorExplanation}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRetryReply(rep.id)}
                          disabled={retryingReplyId === rep.id}
                          className="px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-800 text-white text-[10px] font-semibold flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer disabled:opacity-50"
                        >
                          {retryingReplyId === rep.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <RotateCcw className="w-3 h-3" />
                          )}
                          <span>Retry Send</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#64717C] bg-[#FAF9F5] rounded-xl border border-dashed border-[#D9DEE2]">
                No official replies have been dispatched to this submitter yet.
              </div>
            )}

            {inquiry.status === "SPAM" ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                <strong>Replies Disabled for Spam</strong>
                <p>This inquiry is classified as spam. To send a reply, update its status first.</p>
              </div>
            ) : (
              <div className="space-y-3 pt-3 border-t border-[#D9DEE2]/60">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#0D2C49]">
                  Compose Institutional Reply
                </h3>

                <div className="space-y-1">
                  <label htmlFor="reply-subject" className="text-[11px] font-medium text-[#64717C]">
                    Email Subject Line (Optional override)
                  </label>
                  <input
                    id="reply-subject"
                    type="text"
                    value={replySubject}
                    onChange={(e) => {
                      setReplySubject(e.target.value);
                      if (typeof window !== "undefined") {
                        window.sessionStorage?.setItem(`aipp_reply_subject_${id}`, e.target.value);
                      }
                    }}
                    placeholder={`AIPP Secretariat Response | ${inquiry.referenceNumber}`}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DEE2] text-xs font-sans text-[#081D2E] placeholder-[#64717C]/70 focus:outline-hidden focus:border-[#0D2C49] focus:ring-1 focus:ring-[#0D2C49]"
                    disabled={submittingReply}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="reply-content" className="text-[11px] font-medium text-[#64717C]">
                    Official Reply Body
                  </label>
                  <textarea
                    id="reply-content"
                    rows={6}
                    value={replyContent}
                    onChange={(e) => {
                      setReplyContent(e.target.value);
                      if (typeof window !== "undefined") {
                        window.sessionStorage?.setItem(`aipp_reply_content_${id}`, e.target.value);
                      }
                    }}
                    placeholder="Compose official institutional reply to the submitter..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D9DEE2] text-xs font-sans text-[#081D2E] placeholder-[#64717C]/70 focus:outline-hidden focus:border-[#0D2C49] focus:ring-1 focus:ring-[#0D2C49]"
                    disabled={submittingReply}
                  />
                  <div className="flex justify-between text-[10px] text-[#64717C]">
                    <span>Minimum 10 characters required</span>
                    <span>{replyContent.length} / 10,000 characters</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handlePreviewReply}
                    disabled={previewingReply || submittingReply || replyContent.trim().length < 10}
                    className="px-4 py-2 rounded-lg border border-[#D9DEE2] hover:bg-slate-50 text-[#0D2C49] text-xs font-sans font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {previewingReply ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                    <span>Preview Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(true)}
                    disabled={submittingReply || replyContent.trim().length < 10}
                    className="px-4 py-2 rounded-lg bg-[#0D2C49] hover:bg-[#081D2E] text-white text-xs font-sans font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReply ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Send Official Reply</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {showPreviewModal && previewData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl border border-[#D9DEE2] shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#D9DEE2]">
                  <div>
                    <h3 className="font-serif text-lg text-[#081D2E]">Email Preview</h3>
                    <p className="text-xs text-[#64717C] font-sans">
                      To: {previewData.recipientName} &lt;{previewData.recipientEmail}&gt;
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(false)}
                    className="p-1.5 rounded-lg text-[#64717C] hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                  <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#D9DEE2] text-xs font-sans space-y-1">
                    <div>
                      <strong className="text-[#081D2E]">Subject:</strong> {previewData.subject}
                    </div>
                  </div>

                  <div className="border border-[#D9DEE2] rounded-xl overflow-hidden">
                    <iframe
                      title="Email HTML Preview"
                      srcDoc={previewData.htmlBody}
                      className="w-full h-96 border-0 bg-white"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 p-4 border-t border-[#D9DEE2] bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-2 rounded-lg border border-[#D9DEE2] hover:bg-white text-xs font-sans text-[#64717C] font-medium"
                  >
                    Close Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPreviewModal(false);
                      setShowConfirmModal(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#0D2C49] hover:bg-[#081D2E] text-white text-xs font-sans font-medium flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Proceed to Send</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl border border-[#D9DEE2] shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in-50 duration-200">
                <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0D2C49] mx-auto">
                  <Send className="w-5 h-5" />
                </div>

                <div className="text-center space-y-1.5">
                  <h3 className="font-serif text-xl text-[#081D2E]">Confirm Inquiry Reply</h3>
                  <p className="text-xs font-sans text-[#64717C]">
                    You are about to enqueue an official response to{" "}
                    <strong className="text-[#081D2E]">{inquiry.fullName}</strong>.
                  </p>
                </div>

                <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#D9DEE2] text-xs font-sans space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#64717C]">Recipient:</span>
                    <span className="font-mono text-[#081D2E]">{inquiry.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64717C]">Reference:</span>
                    <span className="font-mono text-[#081D2E]">{inquiry.referenceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64717C]">Length:</span>
                    <span className="font-mono text-[#081D2E]">{replyContent.length} chars</span>
                  </div>
                </div>

                <p className="text-[11px] font-sans text-[#64717C] text-center">
                  This reply will be saved in the database and enqueued into the EmailOutbox for background worker delivery.
                </p>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    disabled={submittingReply}
                    className="px-4 py-2 rounded-lg border border-[#D9DEE2] hover:bg-slate-50 text-xs font-sans text-[#64717C] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={submittingReply}
                    className="px-4 py-2 rounded-lg bg-[#0D2C49] hover:bg-[#081D2E] text-white text-xs font-sans font-medium flex items-center gap-1.5"
                  >
                    {submittingReply ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Confirm &amp; Enqueue Reply</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Internal Private Notes Thread */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#D9DEE2] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#D9DEE2]/60 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#B09C4B]" />
                <h2 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]">
                  Internal Secretariat Notes
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                Private / Admin Only
              </span>
            </div>

            <p className="text-xs font-sans text-[#64717C] font-light leading-relaxed">
              Internal notes are recorded for collaborative triage and accountability. They are never shared with or exposed to the public.
            </p>

            {/* Existing Notes List */}
            {inquiry.notes && inquiry.notes.length > 0 ? (
              <div className="space-y-3 pt-1">
                {inquiry.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl bg-[#FAF9F5] border border-[#D9DEE2]/70 space-y-2 text-xs font-sans"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#64717C]">
                      <div className="flex items-center gap-2">
                        <strong className="text-[#081D2E] font-medium">{note.adminUser.name}</strong>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 text-[9px] uppercase font-semibold">
                          {note.adminUser.role.replace("_", " ")}
                        </span>
                      </div>
                      <span>
                        {new Date(note.createdAt).toLocaleDateString()} at{" "}
                        {new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[#081D2E] whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#64717C] bg-[#FAF9F5] rounded-xl border border-dashed border-[#D9DEE2]">
                No internal notes added yet. Use the form below to record administrative observations.
              </div>
            )}

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3 pt-2">
              <label htmlFor="note-content" className="sr-only">
                Add an internal note
              </label>
              <textarea
                id="note-content"
                rows={3}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Record private administrative note (e.g. 'Coordinating with Research Directorate for response draft')..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9DEE2] text-xs font-sans text-[#081D2E] placeholder-[#64717C]/70 focus:outline-hidden focus:border-[#0D2C49] focus:ring-1 focus:ring-[#0D2C49]"
                disabled={submittingNote}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingNote || !noteContent.trim()}
                  className="px-4 py-2 rounded-lg bg-[#0D2C49] hover:bg-[#081D2E] text-white text-xs font-sans font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingNote ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Post Internal Note</span>
                </button>
              </div>
            </form>
          </div>

          {/* Activity History Audit Trail */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#D9DEE2] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#D9DEE2]/60 pb-3">
              <History className="w-4 h-4 text-[#0D2C49]" />
              <h2 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]">
                Activity &amp; Audit Timeline
              </h2>
            </div>

            <div className="relative pl-6 space-y-4 border-l-2 border-[#D9DEE2]/70 ml-2">
              {inquiry.activities.map((act) => (
                <div key={act.id} className="relative text-xs font-sans space-y-0.5">
                  <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-[#0D2C49] border-2 border-white ring-1 ring-[#D9DEE2]" />
                  <div className="flex items-center justify-between text-[11px] text-[#64717C]">
                    <span className="font-medium text-[#081D2E]">
                      {formatActivityAction(act.action)}
                    </span>
                    <span>
                      {new Date(act.createdAt).toLocaleDateString()} {new Date(act.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {act.details && (
                    <div className="text-[11px] text-[#64717C] font-mono bg-[#FAF9F5] px-2 py-1 rounded border border-[#D9DEE2]/50 mt-1 max-w-lg truncate">
                      {act.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Workflow & Assignment Controls */}
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#D9DEE2] shadow-xs space-y-5">
            <h2 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#0D2C49] border-b border-[#D9DEE2]/60 pb-3">
              Inquiry Status &amp; Assignment
            </h2>

            {/* Status Control */}
            <div className="space-y-1.5">
              <label htmlFor="status-select" className="text-xs font-sans text-[#64717C] block font-medium">
                Workflow Status
              </label>
              <select
                id="status-select"
                value={inquiry.status}
                onChange={(e) => handleUpdate({ status: e.target.value as InquiryDetail["status"] })}
                disabled={savingStatus}
                className="w-full px-3 py-2 rounded-lg border border-[#D9DEE2] text-xs font-sans text-[#081D2E] bg-white focus:outline-hidden focus:border-[#0D2C49]"
              >
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="AWAITING_RESPONSE">Awaiting Response</option>
                <option value="RESOLVED">Resolved</option>
                <option value="SPAM">Spam</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Priority Control */}
            <div className="space-y-1.5">
              <label htmlFor="priority-select" className="text-xs font-sans text-[#64717C] block font-medium">
                Handling Priority
              </label>
              <select
                id="priority-select"
                value={inquiry.priority}
                onChange={(e) => handleUpdate({ priority: e.target.value as InquiryDetail["priority"] })}
                disabled={savingStatus}
                className="w-full px-3 py-2 rounded-lg border border-[#D9DEE2] text-xs font-sans text-[#081D2E] bg-white focus:outline-hidden focus:border-[#0D2C49]"
              >
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Assigned Administrator Control */}
            <div className="space-y-1.5">
              <label htmlFor="assignee-select" className="text-xs font-sans text-[#64717C] block font-medium">
                Assigned Administrator
              </label>
              <select
                id="assignee-select"
                value={inquiry.assignedTo?.id || ""}
                onChange={(e) => handleUpdate({ assignedToId: e.target.value || null })}
                disabled={savingStatus}
                className="w-full px-3 py-2 rounded-lg border border-[#D9DEE2] text-xs font-sans text-[#081D2E] bg-white focus:outline-hidden focus:border-[#0D2C49]"
              >
                <option value="">Unassigned</option>
                {assignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role.replace("_", " ")})
                  </option>
                ))}
              </select>
            </div>

            {/* Metadata Summary */}
            <div className="pt-4 border-t border-[#D9DEE2]/60 space-y-2 text-[11px] font-sans text-[#64717C]">
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="font-mono">{new Date(inquiry.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="font-mono">{new Date(inquiry.updatedAt).toLocaleString()}</span>
              </div>
              {inquiry.resolvedAt && (
                <div className="flex justify-between text-emerald-700">
                  <span>Resolved:</span>
                  <span className="font-mono">{new Date(inquiry.resolvedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

