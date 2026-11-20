"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Info
} from "lucide-react";
import MediaAssetField from "@/components/admin/media/MediaAssetField";
import type { SelectedMediaAsset } from "@/lib/media/selection";

type JournalStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface ParentJournalData {
  id: string;
  title: string;
  slug: string;
  status: JournalStatusValue;
  issues: Array<{
    volume: number;
    issue: number;
  }>;
}

export default function AdminJournalIssueCreateClient({ journalId }: { journalId: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [journal, setJournal] = useState<ParentJournalData | null>(null);

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
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function loadParentJournal() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`/api/journals/${encodeURIComponent(journalId)}`, {
          cache: "no-store"
        });
        const data = (await res.json()) as ParentJournalData & { error?: string };
        if (!res.ok) {
          setLoadError(data.error || `Failed to load journal (HTTP ${res.status}).`);
          return;
        }

        setJournal(data);

        if (Array.isArray(data.issues) && data.issues.length > 0) {
          const maxVol = Math.max(...data.issues.map((i) => i.volume));
          const issuesInMaxVol = data.issues.filter((i) => i.volume === maxVol);
          const maxIssue = Math.max(...issuesInMaxVol.map((i) => i.issue));

          setVolume(maxVol);
          setIssueNumber(maxIssue + 1);
          setTitle(`Volume ${maxVol}, Issue ${maxIssue + 1}`);
        } else {
          setVolume(1);
          setIssueNumber(1);
          setTitle("Volume 1, Issue 1");
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
        setLoadError("Network error while loading parent journal.");
      } finally {
        setLoading(false);
      }
    }

    loadParentJournal();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journal) return;

    if (!title.trim()) {
      setSubmitError("Issue title is required.");
      return;
    }

    if (volume < 1 || issueNumber < 1) {
      setSubmitError("Volume and issue number must be positive integers.");
      return;
    }

    if (status === "PUBLISHED" && journal.status !== "PUBLISHED") {
      setSubmitError(
        `Cannot publish this issue while parent journal "${journal.title}" is in ${journal.status} status. Publish the parent journal first.`
      );
      return;
    }

    setSaving(true);
    setSubmitError(null);

    try {
      const payload = {
        journalId: journal.id,
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

      const res = await fetch(`/api/journals/${encodeURIComponent(journal.id)}/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await res.json()) as { id?: string; error?: string };

      if (!res.ok) {
        setSubmitError(data.error || `Failed to create issue (HTTP ${res.status}).`);
        setSaving(false);
        return;
      }

      router.push(`/admin/journals/${encodeURIComponent(journal.id)}/edit`);
    } catch {
      setSubmitError("Network error while creating journal issue.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#D9DEE2] p-12 text-center text-xs font-sans text-[#64717C]">
        Loading journal context...
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

  const isParentUnpublished = journal.status !== "PUBLISHED";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/admin/journals/${journal.id}/edit`}
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#64717C] hover:text-[#081D2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {journal.title} Workspace</span>
        </Link>
      </div>

      <header className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#B09C4B] font-semibold">
            Compiled Volume Creation
          </span>
          <span className="text-xs font-mono text-[#64717C]">
            Parent: {journal.title} ({journal.status})
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#081D2E] font-medium">
          Create Journal Issue
        </h1>
        <p className="text-xs sm:text-sm font-sans text-[#64717C]">
          Compile a new academic issue volume, assign publication dates, attach specific cover artwork, and upload the master PDF.
        </p>
      </header>

      {isParentUnpublished && (
        <div
          role="region"
          aria-label="Parent journal status notice"
          className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3 text-xs font-sans text-amber-950"
        >
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Parent Series is {journal.status}:</strong>{" "}
            This issue can be drafted and compiled freely now. However, to maintain catalog integrity, this issue cannot be marked{" "}
            <strong>Published</strong> until the parent journal &ldquo;{journal.title}&rdquo; is also Published.
          </div>
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-300 bg-rose-50 p-4 flex items-start gap-3 text-xs font-sans text-rose-950"
        >
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <span className="flex-1">{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-[#D9DEE2] p-5 sm:p-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="issue-volume"
                className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
              >
                Volume Number <span className="text-rose-600">*</span>
              </label>
              <input
                id="issue-volume"
                type="number"
                min={1}
                required
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-sm font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="issue-number"
                className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
              >
                Issue Number <span className="text-rose-600">*</span>
              </label>
              <input
                id="issue-number"
                type="number"
                min={1}
                required
                value={issueNumber}
                onChange={(e) => setIssueNumber(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-sm font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="issue-title"
              className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
            >
              Issue Title <span className="text-rose-600">*</span>
            </label>
            <input
              id="issue-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Volume 01, Issue 01: Diplomatic Protocols in Fragile Contexts"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-sm font-sans text-[#081D2E] placeholder-[#64717C] focus:outline-none focus:border-[#0D2C49]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="issue-description"
              className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
            >
              Editorial Note &amp; Issue Abstract
            </label>
            <textarea
              id="issue-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of this compiled issue's thematic focus, editorial board remarks, and major articles..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] placeholder-[#64717C] focus:outline-none focus:border-[#0D2C49]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label
                htmlFor="issue-published-at"
                className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
              >
                Publication Date
              </label>
              <input
                id="issue-published-at"
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              />
              <p className="text-[11px] font-sans text-[#64717C]">
                Official release or print compilation date for citations and metadata.
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="issue-status"
                className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
              >
                Publication Status
              </label>
              <select
                id="issue-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as JournalStatusValue)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              >
                <option value="DRAFT">Draft (Internal preparation)</option>
                <option value="PUBLISHED" disabled={isParentUnpublished}>
                  Published {isParentUnpublished ? "(Requires parent journal to be Published)" : "(Visible on public archive)"}
                </option>
                <option value="ARCHIVED">Archived (Archived volume)</option>
              </select>
              {isParentUnpublished && status === "PUBLISHED" && (
                <p className="text-[11px] font-sans text-amber-700">
                  Warning: Cannot save as Published while parent journal is {journal.status}.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#D9DEE2] p-5 sm:p-7 space-y-6">
          <div className="space-y-1 border-b border-[#D9DEE2] pb-3">
            <h2 className="font-serif text-lg text-[#081D2E] font-medium">
              Issue Media &amp; Master Documents
            </h2>
            <p className="text-xs font-sans text-[#64717C]">
              Attach the volume cover artwork and the compiled PDF containing all issue papers and tables of contents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MediaAssetField
              field="journal_issue_cover"
              label="Issue Cover Artwork"
              helperText="Front cover art for this volume compilation."
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

            <MediaAssetField
              field="journal_issue_pdf"
              label="Compiled Issue PDF Document"
              helperText="Full compiled issue document containing all articles and editorial pages."
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
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href={`/admin/journals/${journal.id}/edit`}
            className="px-5 py-2.5 min-h-[42px] rounded-lg border border-[#D9DEE2] text-xs font-sans font-medium text-[#081D2E] hover:border-[#0D2C49] bg-white transition-colors flex items-center justify-center"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 min-h-[42px] rounded-lg bg-[#0D2C49] hover:bg-[#081D2E] text-white text-xs font-sans font-medium shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Creating Issue..." : "Create Issue"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
