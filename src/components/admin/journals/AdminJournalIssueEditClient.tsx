"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  FileText,
  FileCheck2,
  Download,
  Info
} from "lucide-react";
import MediaAssetField from "@/components/admin/media/MediaAssetField";
import DeleteIssueModal from "@/components/admin/journals/DeleteIssueModal";
import type { SelectedMediaAsset } from "@/lib/media/selection";

type JournalStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface AttributedPublication {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  abstract?: string;
}

interface IssueDetail {
  id: string;
  journalId: string;
  volume: number;
  issue: number;
  title: string;
  description?: string | null;
  status: JournalStatusValue;
  coverImageUrl?: string | null;
  coverImageAssetId?: string | null;
  pdfUrl?: string | null;
  pdfAssetId?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  journal: {
    id: string;
    title: string;
    slug: string;
    status: JournalStatusValue;
  };
  coverImageAsset?: {
    id?: string;
    publicId?: string;
    mediaType?: "IMAGE" | "DOCUMENT";
    secureUrl?: string;
    originalFilename?: string;
    format?: string;
    mimeType?: string;
    bytes?: number;
    width?: number | null;
    height?: number | null;
    pages?: number | null;
    folder?: string;
  } | null;
  pdfAsset?: {
    id?: string;
    publicId?: string;
    mediaType?: "IMAGE" | "DOCUMENT";
    secureUrl?: string;
    originalFilename?: string;
    format?: string;
    mimeType?: string;
    bytes?: number;
    width?: number | null;
    height?: number | null;
    pages?: number | null;
    folder?: string;
  } | null;
  publications: AttributedPublication[];
}

function getStatusBadgeClasses(status: JournalStatusValue): string {
  switch (status) {
    case "PUBLISHED":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "ARCHIVED":
      return "bg-slate-100 text-slate-700 border-slate-300";
    case "DRAFT":
    default:
      return "bg-amber-50 text-amber-900 border-amber-200";
  }
}

function formatNumberPad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

export default function AdminJournalIssueEditClient({
  journalId,
  issueId
}: {
  journalId: string;
  issueId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [issue, setIssue] = useState<IssueDetail | null>(null);

  const [volume, setVolume] = useState<number>(1);
  const [issueNumber, setIssueNumber] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [status, setStatus] = useState<JournalStatusValue>("DRAFT");

  const [coverImageAssetId, setCoverImageAssetId] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState("");
  const [coverFileSize, setCoverFileSize] = useState(0);
  const [coverMimeType, setCoverMimeType] = useState("");

  const [pdfAssetId, setPdfAssetId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfFileSize, setPdfFileSize] = useState(0);
  const [pdfMimeType, setPdfMimeType] = useState("");

  const [canViewMedia, setCanViewMedia] = useState(true);
  const [canUpload, setCanUpload] = useState(true);

  const [saving, setSaving] = useState(false);
  const [actionNotice, setActionNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadIssue() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(
          `/api/journals/${encodeURIComponent(journalId)}/issues/${encodeURIComponent(issueId)}`,
          { cache: "no-store" }
        );
        const data = (await res.json()) as IssueDetail & { error?: string };
        if (!res.ok) {
          setLoadError(data.error || `Failed to load issue (HTTP ${res.status}).`);
          return;
        }

        setIssue(data);
        setVolume(data.volume || 1);
        setIssueNumber(data.issue || 1);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setStatus(data.status || "DRAFT");
        setCoverImageAssetId(data.coverImageAssetId || null);
        setCoverImageUrl(data.coverImageUrl || null);
        setPdfAssetId(data.pdfAssetId || null);
        setPdfUrl(data.pdfUrl || null);

        if (data.publishedAt) {
          const d = new Date(data.publishedAt);
          if (!isNaN(d.getTime())) {
            setPublishedAt(d.toISOString().slice(0, 10));
          }
        }

        if (data.coverImageAsset) {
          setCoverFileName(data.coverImageAsset.originalFilename || "");
          setCoverFileSize(data.coverImageAsset.bytes || 0);
          setCoverMimeType(data.coverImageAsset.mimeType || "");
        }

        if (data.pdfAsset) {
          setPdfFileName(data.pdfAsset.originalFilename || "");
          setPdfFileSize(data.pdfAsset.bytes || 0);
          setPdfMimeType(data.pdfAsset.mimeType || "");
        }

        const meRes = await fetch("/api/auth/me", { cache: "no-store" });
        if (meRes.ok) {
          const meData = (await meRes.json()) as {
            permissions?: { view_media?: boolean; upload_files?: boolean };
          };
          setCanViewMedia(Boolean(meData.permissions?.view_media));
          setCanUpload(Boolean(meData.permissions?.upload_files));
        }
      } catch {
        setLoadError("Network error while loading issue details.");
      } finally {
        setLoading(false);
      }
    }

    loadIssue();
  }, [journalId, issueId]);

  const handleSelectCover = (asset: SelectedMediaAsset) => {
    setCoverImageAssetId(asset.id);
    setCoverImageUrl(asset.secureUrl);
    setCoverFileName(asset.originalFilename);
    setCoverFileSize(asset.bytes);
    setCoverMimeType(asset.mimeType);
  };

  const handleClearCover = () => {
    setCoverImageAssetId(null);
    setCoverImageUrl("");
    setCoverFileName("");
    setCoverFileSize(0);
    setCoverMimeType("");
  };

  const handleSelectPdf = (asset: SelectedMediaAsset) => {
    setPdfAssetId(asset.id);
    setPdfUrl(asset.secureUrl);
    setPdfFileName(asset.originalFilename);
    setPdfFileSize(asset.bytes);
    setPdfMimeType(asset.mimeType);
  };

  const handleClearPdf = () => {
    setPdfAssetId(null);
    setPdfUrl("");
    setPdfFileName("");
    setPdfFileSize(0);
    setPdfMimeType("");
  };

  const handleSaveIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue) return;

    if (!title.trim()) {
      setActionNotice({ type: "error", message: "Issue title is required." });
      return;
    }

    if (volume < 1 || issueNumber < 1) {
      setActionNotice({ type: "error", message: "Volume and issue number must be positive integers." });
      return;
    }

    if (status === "PUBLISHED" && issue.journal.status !== "PUBLISHED") {
      setActionNotice({
        type: "error",
        message: `Cannot publish this issue while parent journal "${issue.journal.title}" is in ${issue.journal.status} status. Publish the parent journal first.`
      });
      return;
    }

    setSaving(true);
    setActionNotice(null);

    try {
      const payload = {
        volume: Number(volume),
        issue: Number(issueNumber),
        title: title.trim(),
        description: description.trim() || null,
        status,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
        coverImageAssetId: coverImageAssetId || null,
        coverImageUrl: coverImageUrl || null,
        pdfAssetId: pdfAssetId || null,
        pdfUrl: pdfUrl || null
      };

      const res = await fetch(
        `/api/journals/${encodeURIComponent(journalId)}/issues/${encodeURIComponent(issueId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = (await res.json()) as IssueDetail & { error?: string };

      if (!res.ok) {
        setActionNotice({
          type: "error",
          message: data.error || `Failed to update issue (HTTP ${res.status}).`
        });
        setSaving(false);
        return;
      }

      setIssue((prev) => (prev ? { ...prev, ...data } : data));
      setActionNotice({
        type: "success",
        message: "Issue details and media saved successfully."
      });
    } catch {
      setActionNotice({
        type: "error",
        message: "Network error while saving issue."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setActionNotice(null);

    try {
      const res = await fetch(
        `/api/journals/${encodeURIComponent(journalId)}/issues/${encodeURIComponent(issueId)}?restrictIfHasPublications=true`,
        {
          method: "DELETE"
        }
      );
      const data = (await res.json()) as { error?: string; publicationCount?: number };

      if (!res.ok) {
        setActionNotice({
          type: "error",
          message: data.error || `Failed to delete issue (HTTP ${res.status}).`
        });
        setDeleteModalOpen(false);
        setDeleting(false);
        return;
      }

      router.push(`/admin/journals/${encodeURIComponent(journalId)}/edit`);
    } catch {
      setActionNotice({
        type: "error",
        message: "Network error while deleting issue."
      });
      setDeleteModalOpen(false);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#D9DEE2] p-12 text-center text-xs font-sans text-[#64717C]">
        Loading issue editor...
      </div>
    );
  }

  if (loadError || !issue) {
    return (
      <div className="bg-white rounded-xl border border-[#D9DEE2] p-10 text-center space-y-3">
        <p className="text-xs font-sans text-rose-700">{loadError || "Issue not found."}</p>
        <Link
          href={`/admin/journals/${journalId}/edit`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal Workspace</span>
        </Link>
      </div>
    );
  }

  const isParentUnpublished = issue.journal.status !== "PUBLISHED";
  const publiclyVisible = issue.journal.status === "PUBLISHED" && issue.status === "PUBLISHED";

  return (
    <div className="space-y-6 min-w-0">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/admin/journals/${journalId}/edit`}
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#64717C] hover:text-[#081D2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {issue.journal.title} Workspace</span>
        </Link>

        {publiclyVisible && (
          <Link
            href={`/journals/${issue.journal.slug}?issue=${encodeURIComponent(issue.id)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-xs font-sans font-medium text-[#0D2C49] transition-colors"
          >
            <span>Preview Public Issue</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <header className="bg-white rounded-xl border border-[#D9DEE2] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0D2C49] text-white font-semibold text-[10px] font-sans">
              Vol. {formatNumberPad(issue.volume)} · Issue {formatNumberPad(issue.issue)}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${getStatusBadgeClasses(
                issue.status
              )}`}
            >
              {issue.status}
            </span>
            <span className="text-xs font-sans text-[#64717C]">
              Parent:{" "}
              <Link
                href={`/admin/journals/${issue.journal.id}/edit`}
                className="text-[#0D2C49] hover:underline font-medium"
              >
                {issue.journal.title}
              </Link>{" "}
              ({issue.journal.status})
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#081D2E] font-medium truncate">
            {issue.title}
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#64717C]">
            Edit issue volume metadata, front cover artwork, compiled master PDF, and inspect attributed research articles.
          </p>
        </div>
      </header>

      {isParentUnpublished && (
        <div
          role="region"
          aria-label="Parent journal status warning"
          className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3 text-xs font-sans text-amber-950"
        >
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Parent Series is {issue.journal.status}:</strong>{" "}
            This issue cannot be published while the parent journal is {issue.journal.status}. Publish the parent journal &ldquo;{issue.journal.title}&rdquo; first to make this issue visible on the public archive.
          </div>
        </div>
      )}

      {actionNotice && (
        <div
          role="alert"
          className={`rounded-xl border p-4 flex items-start gap-3 text-xs font-sans ${actionNotice.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-950"
              : "border-amber-300 bg-amber-50 text-amber-950"
            }`}
        >
          {actionNotice.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          )}
          <span className="flex-1">{actionNotice.message}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveIssue} className="space-y-6">
            <div className="bg-white rounded-xl border border-[#D9DEE2] p-5 sm:p-6 space-y-4">
              <div className="border-b border-[#D9DEE2] pb-3">
                <h2 className="font-serif text-lg text-[#081D2E] font-medium">
                  Issue Metadata
                </h2>
                <p className="text-xs font-sans text-[#64717C]">
                  Volume, numbering, and editorial abstract.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-issue-volume"
                    className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
                  >
                    Volume Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="edit-issue-volume"
                    type="number"
                    min={1}
                    required
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-issue-number"
                    className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
                  >
                    Issue Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="edit-issue-number"
                    type="number"
                    min={1}
                    required
                    value={issueNumber}
                    onChange={(e) => setIssueNumber(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="edit-issue-title"
                  className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
                >
                  Issue Title <span className="text-rose-600">*</span>
                </label>
                <input
                  id="edit-issue-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="edit-issue-description"
                  className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
                >
                  Editorial Summary
                </label>
                <textarea
                  id="edit-issue-description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-issue-published-at"
                    className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
                  >
                    Publication Date
                  </label>
                  <input
                    id="edit-issue-published-at"
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-issue-status"
                    className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
                  >
                    Publication Status
                  </label>
                  <select
                    id="edit-issue-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as JournalStatusValue)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED" disabled={isParentUnpublished}>
                      Published {isParentUnpublished ? "(Requires parent to be Published)" : ""}
                    </option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#D9DEE2] p-5 sm:p-6 space-y-6">
              <div className="border-b border-[#D9DEE2] pb-3">
                <h2 className="font-serif text-lg text-[#081D2E] font-medium">
                  Media &amp; Master Documents
                </h2>
                <p className="text-xs font-sans text-[#64717C]">
                  Volume cover image and compiled master PDF document.
                </p>
              </div>

              <MediaAssetField
                field="journal_issue_cover"
                label="Issue Cover Image"
                helperText="Specific front cover artwork for this volume and issue."
                assetId={coverImageAssetId}
                url={coverImageUrl || ""}
                fileName={coverFileName}
                fileSize={coverFileSize}
                mimeType={coverMimeType}
                canViewMedia={canViewMedia}
                canUpload={canUpload}
                onSelectAsset={handleSelectCover}
                onClear={handleClearCover}
              />

              <div className="pt-2 border-t border-[#D9DEE2] space-y-3">
                <MediaAssetField
                  field="journal_issue_pdf"
                  label="Compiled Issue PDF"
                  helperText="Complete compiled issue PDF document containing all articles."
                  assetId={pdfAssetId}
                  url={pdfUrl || ""}
                  fileName={pdfFileName}
                  fileSize={pdfFileSize}
                  mimeType={pdfMimeType}
                  canViewMedia={canViewMedia}
                  canUpload={canUpload}
                  onSelectAsset={handleSelectPdf}
                  onClear={handleClearPdf}
                />

                {(pdfUrl || pdfFileName) && (
                  <div className="p-3.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] flex items-center justify-between gap-3 text-xs font-sans">
                    <div className="flex items-center gap-2 text-emerald-800 min-w-0">
                      <FileCheck2 className="w-4 h-4 shrink-0" />
                      <span className="truncate font-medium">
                        {pdfFileName || "Compiled Master PDF"}
                      </span>
                      {pdfFileSize ? (
                        <span className="text-[11px] text-[#64717C]">
                          ({formatBytes(pdfFileSize)})
                        </span>
                      ) : null}
                    </div>

                    <a
                      href={pdfUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#D9DEE2] text-xs font-medium text-[#0D2C49] hover:border-[#0D2C49] shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#D9DEE2] flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[40px] rounded-lg bg-[#0D2C49] hover:bg-[#081D2E] text-white text-xs font-sans font-medium transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving Changes..." : "Save Issue Details"}</span>
                </button>
              </div>
            </div>
          </form>

          <div className="bg-white rounded-xl border border-rose-200 p-5 space-y-3">
            <h3 className="font-serif text-base text-rose-900 font-medium">
              Danger Zone
            </h3>
            <p className="text-xs font-sans text-[#64717C]">
              Permanently delete this issue compilation. To protect academic citations, issues with attributed publications cannot be deleted until articles are reassigned.
            </p>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-sans font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Issue</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-[#D9DEE2] p-5 sm:p-6 space-y-4">
            <div className="border-b border-[#D9DEE2] pb-3">
              <h2 className="font-serif text-lg text-[#081D2E] font-medium flex items-center gap-2">
                <span>Attributed Research Articles</span>
                <span className="px-2 py-0.5 rounded-full bg-[#0D2C49]/5 text-[#0D2C49] text-xs font-mono font-medium">
                  {issue.publications.length}
                </span>
              </h2>
              <p className="text-xs font-sans text-[#64717C]">
                Individual research papers and policy briefs compiled into this issue.
              </p>
            </div>

            {issue.publications.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-[#D9DEE2] bg-[#F7F7F7] text-center space-y-2">
                <FileText className="w-8 h-8 text-[#0D2C49]/30 mx-auto" />
                <p className="text-xs font-sans text-[#64717C]">
                  No articles are currently linked to this issue volume.
                </p>
                <Link
                  href="/admin/publications"
                  className="inline-flex items-center gap-1 text-xs font-sans font-medium text-[#0D2C49] hover:underline pt-1"
                >
                  <span>Browse Research &amp; Publications</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {issue.publications.map((pub) => (
                  <div
                    key={pub.id}
                    className="p-3.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] space-y-2 hover:border-[#0D2C49]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap text-[10px] font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-mono font-semibold">
                        {pub.type}
                      </span>
                      <span className="text-[#64717C] font-mono">
                        {pub.status}
                      </span>
                    </div>

                    <h4 className="font-serif text-sm text-[#081D2E] font-medium leading-snug">
                      <Link
                        href={`/admin/publications/${pub.id}/edit`}
                        className="hover:text-[#0D2C49] transition-colors"
                      >
                        {pub.title}
                      </Link>
                    </h4>

                    {pub.abstract && (
                      <p className="text-[11px] font-sans text-[#64717C] line-clamp-2">
                        {pub.abstract}
                      </p>
                    )}

                    <div className="pt-2 border-t border-[#D9DEE2]/60 flex items-center justify-end">
                      <Link
                        href={`/admin/publications/${pub.id}/edit`}
                        className="inline-flex items-center gap-1 text-xs font-sans font-medium text-[#0D2C49] hover:underline"
                      >
                        <span>Edit Article</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteIssueModal
        isOpen={deleteModalOpen}
        issue={{
          id: issue.id,
          journalId: issue.journalId,
          title: issue.title,
          volume: issue.volume,
          issueNumber: issue.issue,
          publicationsCount: issue.publications.length
        }}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />
    </div>
  );
}
