"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Shield,
  RefreshCw,
  Sparkles
} from "lucide-react";
import MediaAssetField from "@/components/admin/media/MediaAssetField";
import type { SelectedMediaAsset } from "@/lib/media/selection";
import { normalizeSlug } from "@/lib/media/slug";

interface AdminAuthorCreateClientProps {
  canViewMedia: boolean;
  canUpload: boolean;
}

export default function AdminAuthorCreateClient({
  canViewMedia,
  canUpload
}: AdminAuthorCreateClientProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    position: "",
    affiliation: "",
    email: "",
    biography: "",
    photoAssetId: null as string | null,
    photoUrl: "",
    photoFileName: "",
    photoFileSize: 0,
    photoMimeType: ""
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nextName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: nextName,
      slug: slugManuallyEdited ? prev.slug : normalizeSlug(nextName)
    }));
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({
      ...prev,
      slug: e.target.value
    }));
  }

  function handleSelectPhoto(asset: SelectedMediaAsset) {
    setFormData((prev) => ({
      ...prev,
      photoAssetId: asset.id,
      photoUrl: asset.secureUrl,
      photoFileName: asset.originalFilename,
      photoFileSize: asset.bytes,
      photoMimeType: asset.mimeType
    }));
  }

  function handleClearPhoto() {
    setFormData((prev) => ({
      ...prev,
      photoAssetId: null,
      photoUrl: "",
      photoFileName: "",
      photoFileSize: 0,
      photoMimeType: ""
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = formData.name.trim();
    if (trimmedName.length < 2) {
      setErrorMessage("Author full name must be at least 2 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: trimmedName,
        slug: formData.slug.trim() ? normalizeSlug(formData.slug) : normalizeSlug(trimmedName),
        position: formData.position.trim() || undefined,
        affiliation: formData.affiliation.trim() || undefined,
        email: formData.email.trim() || undefined,
        biography: formData.biography.trim() || undefined,
        photoAssetId: formData.photoAssetId || undefined,
        photoUrl: formData.photoUrl.trim() || undefined
      };

      const res = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Failed to create author (HTTP ${res.status})`);
      }

      router.push(`/admin/authors/${data.id}/edit?created=1`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Creation failed.";
      setErrorMessage(msg);
      setSubmitting(false);
    }
  }

  const slugPreview = formData.slug.trim()
    ? normalizeSlug(formData.slug)
    : normalizeSlug(formData.name) || "author-slug";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#D9DEE2]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/authors"
            className="p-2 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-[#081D2E] transition-colors"
            title="Back to authors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#081D2E]">
              New Author &amp; Scholar
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[#64717C] mt-0.5 font-light">
              Register a new scholar profile with biography and portrait photograph.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/authors"
            className="px-4 py-2.5 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-xs font-sans font-medium text-[#081D2E] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0D2C49] text-white hover:bg-[#081D2E] text-xs font-sans font-medium transition-colors shadow-xs disabled:opacity-50"
          >
            {submitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{submitting ? "Saving..." : "Create Author"}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs sm:text-sm font-sans font-medium">
            {errorMessage}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 sm:p-6 bg-white rounded-xl border border-[#D9DEE2] space-y-5">
            <h2 className="font-serif text-lg font-medium text-[#081D2E] border-b border-[#D9DEE2] pb-3">
              Scholar Profile Information
            </h2>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Dr. Salma Qureshi"
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E]">
                  URL Slug
                </label>
                {slugManuallyEdited && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlugManuallyEdited(false);
                      setFormData((prev) => ({
                        ...prev,
                        slug: normalizeSlug(prev.name)
                      }));
                    }}
                    className="text-[11px] font-sans text-[#0D2C49] hover:underline"
                  >
                    Reset to auto-slug
                  </button>
                )}
              </div>
              <input
                type="text"
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="e.g. salma-qureshi"
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-mono text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              />
              <div className="mt-1.5 text-[11px] font-mono text-[#64717C] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#B09C4B]" />
                <span>Preview: </span>
                <span className="text-[#0D2C49]">aipp.org/authors/{slugPreview}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                  Academic Position / Title
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g. Senior Research Fellow"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                  Institutional Affiliation
                </label>
                <input
                  type="text"
                  value={formData.affiliation}
                  onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                  placeholder="e.g. AIPP Institute / Harvard Kennedy School"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E]">
                  Contact Email
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-sans font-medium">
                  <Shield className="w-2.5 h-2.5 text-[#B09C4B]" />
                  Administrator-only PII
                </span>
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. author@institution.edu"
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              />
              <p className="mt-1 text-[11px] font-sans text-[#64717C]">
                Strictly redacted from all public responses. Accessible only to administrators with author management rights.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                Academic Biography
              </label>
              <textarea
                rows={6}
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                placeholder="Detailed summary of the scholar's research focus, academic background, and institutional contributions..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49] leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 sm:p-6 bg-white rounded-xl border border-[#D9DEE2] space-y-4">
            <h2 className="font-serif text-lg font-medium text-[#081D2E] border-b border-[#D9DEE2] pb-3">
              Portrait Photograph
            </h2>

            <MediaAssetField
              field="author_photo"
              label="Author Portrait"
              helperText="Select or upload a high-resolution portrait photograph (JPG, PNG, or WebP)."
              assetId={formData.photoAssetId}
              url={formData.photoUrl}
              fileName={formData.photoFileName}
              fileSize={formData.photoFileSize}
              mimeType={formData.photoMimeType}
              canViewMedia={canViewMedia}
              canUpload={canUpload}
              onSelectAsset={handleSelectPhoto}
              onClear={handleClearPhoto}
              onLegacyUrlChange={(url) =>
                setFormData((prev) => ({
                  ...prev,
                  photoAssetId: null,
                  photoUrl: url
                }))
              }
            />
          </div>
        </div>
      </div>
    </form>
  );
}

