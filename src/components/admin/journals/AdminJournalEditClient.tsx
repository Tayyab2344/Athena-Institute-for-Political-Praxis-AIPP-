"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Calendar,
  FileText,
  FileCheck2
} from "lucide-react";
import MediaAssetField from "@/components/admin/media/MediaAssetField";
import DeleteJournalModal from "@/components/admin/journals/DeleteJournalModal";
import type { SelectedMediaAsset } from "@/lib/media/selection";

type JournalStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface JournalIssuePublication {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  abstract?: string;
}

interface JournalIssueItem {
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
  coverImageAsset?: {
    id?: string;
    originalFilename?: string;
    secureUrl?: string;
  } | null;
  pdfAsset?: {
    id?: string;
    originalFilename?: string;
    bytes?: number;
    secureUrl?: string;
  } | null;
  publications: JournalIssuePublication[];
}

interface JournalDetail {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  status: JournalStatusValue;
  coverImageUrl?: string | null;
  coverImageAssetId?: string | null;
  createdAt: string;
  updatedAt: string;
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
  issues: JournalIssueItem[];
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

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "Unpublished date";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return iso;
  }
}

export default function AdminJournalEditClient({ journalId }: { journalId: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [journal, setJournal] = useState<JournalDetail | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<JournalStatusValue>("DRAFT");

  const [coverImageAssetId, setCoverImageAssetId] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState("");
  const [coverFileSize, setCoverFileSize] = useState(0);
  const [coverMimeType, setCoverMimeType] = useState("");
  const [canViewMedia, setCanViewMedia] = useState(true);
  const [canUpload, setCanUpload] = useState(true);

  const [saving, setSaving] = useState(false);
  const [actionNotice, setActionNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingIssueId, setUpdatingIssueId] = useState<string | null>(null);

  useEffect(() => {
    async function loadJournal() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`/api/journals/${encodeURIComponent(journalId)}`, {
          cache: "no-store"
        });
        const data = (await res.json()) as JournalDetail & { error?: string };
        if (!res.ok) {
          setLoadError(data.error || `Failed to load journal (HTTP ${res.status}).`);
          return;
        }

        setJournal(data);
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setDescription(data.description || "");
        setStatus(data.status || "DRAFT");
        setCoverImageAssetId(data.coverImageAssetId || null);
        setCoverImageUrl(data.coverImageUrl || null);

        if (data.coverImageAsset) {
          setCoverFileName(data.coverImageAsset.originalFilename || "");
          setCoverFileSize(data.coverImageAsset.bytes || 0);
          setCoverMimeType(data.coverImageAsset.mimeType || "");
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
        setLoadError("Network error while loading journal details.");
      } finally {
        setLoading(false);
      }
    }

    loadJournal();
  }, [journalId]);

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

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setActionNotice({ type: "error", message: "Journal title is required." });
      return;
    }

    setSaving(true);
    setActionNotice(null);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || null,
        status,
        coverImageAssetId: coverImageAssetId || null,
        coverImageUrl: coverImageUrl || null
      };

      const res = await fetch(`/api/journals/${encodeURIComponent(journalId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await res.json()) as JournalDetail & { error?: string };

      if (!res.ok) {
        setActionNotice({
          type: "error",
          message: data.error || `Failed to update journal (HTTP ${res.status}).`
        });
        setSaving(false);
        return;
      }

      setJournal((prev) => (prev ? { ...prev, ...data } : data));
      setActionNotice({
        type: "success",
        message: "Journal details saved successfully."
      });
    } catch {
      setActionNotice({
        type: "error",
        message: "Network error while saving journal."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleIssueStatusChange = async (issueId: string, nextStatus: JournalStatusValue) => {
    setUpdatingIssueId(issueId);
    setActionNotice(null);

    try {
      const res = await fetch(
        `/api/journals/${encodeURIComponent(journalId)}/issues/${encodeURIComponent(issueId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus })
        }
      );
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setActionNotice({
          type: "error",
          message: data.error || `Failed to update issue status (HTTP ${res.status}).`
        });
        return;
      }

      setActionNotice({
        type: "success",
        message: `Issue status updated to ${nextStatus}.`
      });

      setJournal((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          issues: prev.issues.map((iss) =>
            iss.id === issueId ? { ...iss, status: nextStatus } : iss
          )
        };
      });
    } catch {
      setActionNotice({
        type: "error",
        message: "Network error while updating issue status."
      });
    } finally {
      setUpdatingIssueId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setActionNotice(null);

    try {
      const res = await fetch(
        `/api/journals/${encodeURIComponent(journalId)}?restrictIfHasIssues=true`,
        {
          method: "DELETE"
        }
      );
      const data = (await res.json()) as { error?: string; issueCount?: number };

      if (!res.ok) {
        setActionNotice({
          type: "error",
          message: data.error || `Failed to delete journal (HTTP ${res.status}).`
        });
        setDeleteModalOpen(false);
        setDeleting(false);
        return;
      }

      router.push("/admin/journals");
    } catch {
      setActionNotice({
        type: "error",
        message: "Network error while deleting journal."
      });
      setDeleteModalOpen(false);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#D9DEE2] p-12 text-center text-xs font-sans text-[#64717C]">
        Loading journal workspace...
      </div>
    );
  }

  if (loadError || !journal) {
    return (
      <div className="bg-white rounded-xl border border-[#D9DEE2] p-10 text-center space-y-3">
        <p className="text-xs font-sans text-rose-700">{loadError || "Journal not found."}</p>
        <Link
          href="/admin/journals"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journals</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-w-0">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/journals"
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#64717C] hover:text-[#081D2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journals Catalog</span>
        </Link>

        {journal.status === "PUBLISHED" && (
          <Link
            href={`/journals/${journal.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-xs font-sans font-medium text-[#0D2C49] transition-colors"
          >
            <span>View Public Series</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <header className="bg-white rounded-xl border border-[#D9DEE2] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="block text-[10px] font-sans uppercase tracking-[0.18em] text-[#B09C4B] font-semibold">
              Institutional Series Workspace
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${getStatusBadgeClasses(
                journal.status
              )}`}
            >
              {journal.status}
            </span>
            <span className="text-[11px] font-mono text-[#64717C]">
              /{journal.slug}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#081D2E] font-medium truncate">
            {journal.title}
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#64717C]">
            Manage series metadata, official cover artwork, and compiled academic volumes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/admin/journals/${journal.id}/issues/new`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg bg-[#0D2C49] hover:bg-[#081D2E] text-white text-xs font-sans font-medium shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Issue</span>
          </Link>
        </div>
      </header>

      {actionNotice && (
        <div
          role="alert"
          className={`rounded-xl border p-4 flex items-start gap-3 text-xs font-sans ${
            actionNotice.type === "success"
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
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSaveJournal} className="space-y-6">
            <div className="bg-white rounded-xl border border-[#D9DEE2] p-5 sm:p-6 space-y-4">
              <div className="border-b border-[#D9DEE2] pb-3">
                <h2 className="font-serif text-lg text-[#081D2E] font-medium">
                  Journal Details
                </h2>
                <p className="text-xs font-sans text-[#64717C]">
                  Core titles and institutional classification for this series.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="edit-journal-title"
                  className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
                >
                  Journal Title <span className="text-rose-600">*</span>
                </label>
                <input
                  id="edit-journal-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="edit-journal-slug"
                  className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
                >
                  URL Slug <span className="text-rose-600">*</span>
                </label>
                <div className="flex items-center rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] px-3.5 py-2 text-xs font-mono text-[#64717C] focus-within:border-[#0D2C49]">
                  <span>/journals/</span>
                  <input
                    id="edit-journal-slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono text-[#081D2E] focus:outline-none pl-1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="edit-journal-description"
                  className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
                >
                  Editorial Scope &amp; Abstract
                </label>
                <textarea
                  id="edit-journal-description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="edit-journal-status"
                  className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
                >
                  Series Status
                </label>
                <select
                  id="edit-journal-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as JournalStatusValue)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                >
                  <option value="DRAFT">Draft (Internal editorial work only)</option>
                  <option value="PUBLISHED">Published (Visible on public site)</option>
                  <option value="ARCHIVED">Archived (Deprecate series)</option>
                </select>
              </div>

              <div className="pt-2">
                <MediaAssetField
                  field="journal_cover"
                  label="Journal Cover Image"
                  helperText="Official series cover artwork. Minimum 1200x1600px recommended."
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
              </div>

              <div className="pt-3 border-t border-[#D9DEE2] flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[40px] rounded-lg bg-[#0D2C49] hover:bg-[#081D2E] text-white text-xs font-sans font-medium transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving Changes..." : "Save Details"}</span>
                </button>
              </div>
            </div>
          </form>

          <div className="bg-white rounded-xl border border-rose-200 p-5 space-y-3">
            <h3 className="font-serif text-base text-rose-900 font-medium">
              Danger Zone
            </h3>
            <p className="text-xs font-sans text-[#64717C]">
              Permanently delete this journal series. Note: A journal cannot be deleted while it contains compiled issues.
            </p>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-sans font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Journal</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-[#D9DEE2] p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DEE2] pb-4">
              <div>
                <h2 className="font-serif text-lg text-[#081D2E] font-medium flex items-center gap-2">
                  <span>Compiled Issues</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#0D2C49]/5 text-[#0D2C49] text-xs font-mono font-medium">
                    {journal.issues.length}
                  </span>
                </h2>
                <p className="text-xs font-sans text-[#64717C]">
                  Volume compilations published under this institutional series.
                </p>
              </div>

              <Link
                href={`/admin/journals/${journal.id}/issues/new`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0D2C49] hover:bg-[#081D2E] text-white text-xs font-sans font-medium transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Issue</span>
              </Link>
            </div>

            {journal.issues.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-[#D9DEE2] bg-[#F7F7F7] text-center space-y-3">
                <Layers className="w-9 h-9 text-[#0D2C49]/30 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-serif text-[#081D2E]">
                    No issues created for this journal yet.
                  </p>
                  <p className="text-xs font-sans text-[#64717C]">
                    Create Volume 01 Issue 01 to begin attributing articles and publishing compilations.
                  </p>
                </div>
                <Link
                  href={`/admin/journals/${journal.id}/issues/new`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Inaugural Issue</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {journal.issues.map((issue) => {
                  const publiclyVisible =
                    journal.status === "PUBLISHED" && issue.status === "PUBLISHED";
                  const issueCoverSrc = issue.coverImageAsset?.secureUrl || issue.coverImageUrl;

                  return (
                    <div
                      key={issue.id}
                      className="p-4 rounded-xl bg-[#F7F7F7] border border-[#D9DEE2] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 hover:border-[#0D2C49]/40 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {issueCoverSrc ? (
                          <div className="relative w-12 h-16 rounded border border-[#D9DEE2] bg-white overflow-hidden shrink-0">
                            <Image
                              src={issueCoverSrc}
                              alt={`${issue.title} cover`}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-16 rounded border border-[#D9DEE2] bg-white flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-slate-300" />
                          </div>
                        )}

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="px-2 py-0.5 rounded-full bg-[#0D2C49] text-white font-semibold text-[10px]">
                              Vol. {formatNumberPad(issue.volume)} · Issue {formatNumberPad(issue.issue)}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-mono font-semibold ${getStatusBadgeClasses(
                                issue.status
                              )}`}
                            >
                              {issue.status}
                            </span>
                            <span className="text-[11px] font-sans text-[#64717C] flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {formatDate(issue.publishedAt)}
                            </span>
                          </div>

                          <h3 className="font-serif text-base text-[#081D2E] font-medium truncate">
                            <Link
                              href={`/admin/journals/${journal.id}/issues/${issue.id}/edit`}
                              className="hover:text-[#0D2C49] transition-colors"
                            >
                              {issue.title}
                            </Link>
                          </h3>

                          <div className="text-xs font-sans text-[#64717C] flex items-center gap-3">
                            <span>{issue.publications?.length || 0} linked articles</span>
                            <span>·</span>
                            {issue.pdfUrl || issue.pdfAssetId ? (
                              <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                                <FileCheck2 className="w-3 h-3" />
                                Compiled PDF
                              </span>
                            ) : (
                              <span className="text-slate-400">No PDF</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 justify-between sm:justify-end">
                        <select
                          aria-label={`Change status for ${issue.title}`}
                          value={issue.status}
                          disabled={updatingIssueId === issue.id}
                          onChange={(e) =>
                            handleIssueStatusChange(issue.id, e.target.value as JournalStatusValue)
                          }
                          className="min-h-[34px] px-2.5 py-1 rounded-lg bg-white border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>

                        <Link
                          href={`/admin/journals/${journal.id}/issues/${issue.id}/edit`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] bg-white text-xs font-sans font-medium text-[#081D2E] transition-colors"
                        >
                          <span>Edit</span>
                        </Link>

                        {publiclyVisible && (
                          <Link
                            href={`/journals/${journal.slug}?issue=${encodeURIComponent(issue.id)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-[#0D2C49]"
                            title="Preview on public site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteJournalModal
        isOpen={deleteModalOpen}
        journal={{
          id: journal.id,
          title: journal.title,
          issuesCount: journal.issues.length
        }}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />
    </div>
  );
}
