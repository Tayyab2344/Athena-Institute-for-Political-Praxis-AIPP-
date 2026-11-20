"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Save } from "lucide-react";
import MediaAssetField from "@/components/admin/media/MediaAssetField";
import type { SelectedMediaAsset } from "@/lib/media/selection";

type JournalStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminJournalCreateClient() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAuth() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as {
            permissions?: { view_media?: boolean; upload_files?: boolean };
          };
          setCanViewMedia(Boolean(data.permissions?.view_media));
          setCanUpload(Boolean(data.permissions?.upload_files));
        }
      } catch {}
    }
    loadAuth();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManual(true);
    setSlug(slugify(val));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Journal title is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        description: description.trim() || null,
        status,
        coverImageAssetId: coverImageAssetId || null,
        coverImageUrl: coverImageUrl || null
      };

      const res = await fetch("/api/journals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await res.json()) as { id?: string; error?: string };

      if (!res.ok) {
        setError(data.error || `Failed to create journal (HTTP ${res.status}).`);
        setSaving(false);
        return;
      }

      if (data.id) {
        router.push(`/admin/journals/${data.id}/edit`);
      } else {
        router.push("/admin/journals");
      }
    } catch {
      setError("Network error while creating journal.");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/journals"
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#64717C] hover:text-[#081D2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journals</span>
        </Link>
      </div>

      <header className="space-y-1">
        <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#B09C4B] font-semibold">
          Series Definition
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#081D2E] font-medium">
          Create Institutional Journal
        </h1>
        <p className="text-xs sm:text-sm font-sans text-[#64717C]">
          Establish a new recurring journal series for compiling academic issues, policy briefs, and statecraft audits.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-300 bg-rose-50 p-4 flex items-start gap-3 text-xs font-sans text-rose-950"
        >
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-[#D9DEE2] p-5 sm:p-7 space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="journal-title"
              className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
            >
              Journal Title <span className="text-rose-600">*</span>
            </label>
            <input
              id="journal-title"
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Journal of Women, Peace, and Strategic Statecraft"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-sm font-sans text-[#081D2E] placeholder-[#64717C] focus:outline-none focus:border-[#0D2C49]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="journal-slug"
                className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
              >
                URL Slug <span className="text-rose-600">*</span>
              </label>
              {isSlugManual && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugManual(false);
                    setSlug(slugify(title));
                  }}
                  className="text-[11px] font-sans text-[#0D2C49] hover:underline"
                >
                  Reset to Auto-Slug
                </button>
              )}
            </div>
            <div className="flex items-center rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] px-3.5 py-2 text-xs font-mono text-[#64717C] focus-within:border-[#0D2C49]">
              <span>/journals/</span>
              <input
                id="journal-slug"
                type="text"
                required
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="journal-slug"
                className="w-full bg-transparent text-xs font-mono text-[#081D2E] focus:outline-none pl-1"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="journal-description"
              className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
            >
              Description &amp; Editorial Scope
            </label>
            <textarea
              id="journal-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of the journal's academic scope, editorial mission, and publication frequency..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] placeholder-[#64717C] focus:outline-none focus:border-[#0D2C49]"
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <label
              htmlFor="journal-status"
              className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#081D2E]"
            >
              Publication Status
            </label>
            <select
              id="journal-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as JournalStatusValue)}
              className="w-full sm:w-64 px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
            >
              <option value="DRAFT">Draft (Internal editorial work only)</option>
              <option value="PUBLISHED">Published (Visible on public journal archive)</option>
              <option value="ARCHIVED">Archived (Deprecate series)</option>
            </select>
            <p className="text-[11px] font-sans text-[#64717C]">
              Note: Child issues can only be made publicly visible when this parent journal is marked Published.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#D9DEE2] p-5 sm:p-7 space-y-4">
          <div className="space-y-1">
            <h2 className="font-serif text-lg text-[#081D2E] font-medium">
              Journal Series Cover Art
            </h2>
            <p className="text-xs font-sans text-[#64717C]">
              Attach an institutional cover image from the Media Library or upload a new approved image asset.
            </p>
          </div>

          <MediaAssetField
            field="journal_cover"
            label="Journal Cover Image"
            helperText="Official cover artwork for this journal series. Minimum 1200x1600px recommended."
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

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/journals"
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
            <span>{saving ? "Creating Journal..." : "Create Journal"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
