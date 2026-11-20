"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  AlertTriangle,
  Shield,
  RefreshCw,
  Sparkles,
  Trash2,
  ExternalLink,
  FileText
} from "lucide-react";
import MediaAssetField from "@/components/admin/media/MediaAssetField";
import type { SelectedMediaAsset } from "@/lib/media/selection";
import { normalizeSlug } from "@/lib/media/slug";

interface AttributedPublicationItem {
  publication: {
    id: string;
    title: string;
    slug: string;
    type?: string | null;
    status: string;
    year?: number | null;
    publishedAt?: string | null;
  };
}

interface LoadedAuthor {
  id: string;
  name: string;
  slug: string;
  biography?: string | null;
  affiliation?: string | null;
  position?: string | null;
  photoUrl?: string | null;
  photoAssetId?: string | null;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
  photoAsset?: {
    originalFilename?: string;
    bytes?: number;
    mimeType?: string;
    secureUrl?: string;
  } | null;
  publications: AttributedPublicationItem[];
}

interface AdminAuthorEditClientProps {
  authorId: string;
  canViewMedia: boolean;
  canUpload: boolean;
}

function formatDate(iso: string): string {
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

function getPublicationStatusBadge(status: string) {
  switch (status) {
    case "PUBLISHED":
      return (
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
          Published
        </span>
      );
    case "DRAFT":
      return (
        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
          Draft
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
          Under Review
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-sans font-semibold uppercase tracking-wider">
          Archived
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-sans font-semibold uppercase tracking-wider">
          {status}
        </span>
      );
  }
}

function formatPublicationType(type?: string | null): string {
  if (!type) return "Publication";
  return type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AdminAuthorEditClient({
  authorId,
  canViewMedia,
  canUpload
}: AdminAuthorEditClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justCreated = searchParams.get("created") === "1";

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [author, setAuthor] = useState<LoadedAuthor | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [position, setPosition] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [email, setEmail] = useState("");
  const [biography, setBiography] = useState("");

  const [photoModified, setPhotoModified] = useState(false);
  const [photoAssetId, setPhotoAssetId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFileName, setPhotoFileName] = useState("");
  const [photoFileSize, setPhotoFileSize] = useState(0);
  const [photoMimeType, setPhotoMimeType] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(justCreated);
  const [actionError, setActionError] = useState<string | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAuthor() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`/api/authors/${authorId}`, {
          cache: "no-store",
          signal: controller.signal
        });

        if (controller.signal.aborted) return;

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to fetch author (HTTP ${res.status})`);
        }

        const data: LoadedAuthor = await res.json();
        setAuthor(data);

        setName(data.name || "");
        setSlug(data.slug || "");
        setPosition(data.position || "");
        setAffiliation(data.affiliation || "");
        setEmail(data.email || "");
        setBiography(data.biography || "");

        setPhotoAssetId(data.photoAssetId || null);
        setPhotoUrl(data.photoUrl || "");
        setPhotoFileName(data.photoAsset?.originalFilename || "");
        setPhotoFileSize(data.photoAsset?.bytes || 0);
        setPhotoMimeType(data.photoAsset?.mimeType || "");
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        if (err instanceof Error && err.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Failed to load author data.";
        setLoadError(msg);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchAuthor();
    return () => controller.abort();
  }, [authorId]);

  function handleSelectPhoto(asset: SelectedMediaAsset) {
    setPhotoModified(true);
    setPhotoAssetId(asset.id);
    setPhotoUrl(asset.secureUrl);
    setPhotoFileName(asset.originalFilename);
    setPhotoFileSize(asset.bytes);
    setPhotoMimeType(asset.mimeType);
  }

  function handleClearPhoto() {
    setPhotoModified(true);
    setPhotoAssetId(null);
    setPhotoUrl("");
    setPhotoFileName("");
    setPhotoFileSize(0);
    setPhotoMimeType("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setActionError(null);
    setSaveSuccess(false);

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setActionError("Author full name must be at least 2 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        id: authorId,
        name: trimmedName,
        position: position.trim() || null,
        affiliation: affiliation.trim() || null,
        email: email.trim() || null,
        biography: biography.trim() || null
      };

      if (slug.trim()) {
        payload.slug = normalizeSlug(slug);
      }

      if (photoModified) {
        payload.photoAssetId = photoAssetId;
        payload.photoUrl = photoUrl.trim() || null;
      }

      const res = await fetch(`/api/authors/${authorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Failed to update author (HTTP ${res.status})`);
      }

      setSaveSuccess(true);
      setPhotoModified(false);
      setAuthor((prev) =>
        prev
          ? {
              ...prev,
              name: data.name,
              slug: data.slug,
              position: data.position,
              affiliation: data.affiliation,
              email: data.email,
              biography: data.biography,
              photoAssetId: data.photoAssetId,
              photoUrl: data.photoUrl,
              photoAsset: data.photoAsset,
              updatedAt: data.updatedAt
            }
          : null
      );
      setSlug(data.slug);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed.";
      setActionError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!author) return;
    setDeleting(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/authors/${author.id}`, {
        method: "DELETE"
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Failed to delete author (HTTP ${res.status})`);
      }

      router.push("/admin/authors?deleted=1");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Deletion failed.";
      setActionError(msg);
      setDeleteConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#D9DEE2] p-12 text-center">
        <RefreshCw className="w-6 h-6 text-[#0D2C49] animate-spin mx-auto mb-3" />
        <p className="text-xs sm:text-sm font-sans text-[#64717C]">
          Loading author workspace...
        </p>
      </div>
    );
  }

  if (loadError || !author) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center space-y-4 max-w-xl mx-auto">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
        <div className="space-y-1">
          <h2 className="font-serif text-lg font-medium text-red-900">
            Author Not Found
          </h2>
          <p className="text-xs sm:text-sm font-sans text-red-700">
            {loadError || "The requested author could not be found."}
          </p>
        </div>
        <Link
          href="/admin/authors"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-sans font-medium hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Authors</span>
        </Link>
      </div>
    );
  }

  const publicationCount = author.publications.length;

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
              {author.name}
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[#64717C] mt-0.5 font-light">
              Edit scholar profile, biography, portrait, and view attributed works.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/authors"
            className="px-4 py-2.5 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-xs font-sans font-medium text-[#081D2E] transition-colors"
          >
            Back
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
            <span>{submitting ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            ✓
          </div>
          <div className="text-xs sm:text-sm font-sans font-medium">
            Author profile was updated successfully.
          </div>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs sm:text-sm font-sans font-medium">
            {actionError}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-mono text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              />
              <div className="mt-1.5 text-[11px] font-mono text-[#64717C] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#B09C4B]" />
                <span>Preview: </span>
                <span className="text-[#0D2C49]">aipp.org/authors/{normalizeSlug(slug) || "author-slug"}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                  Academic Position / Title
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
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
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Detailed summary of the scholar's research focus, academic background, and institutional contributions..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49] leading-relaxed"
              />
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-xl border border-[#D9DEE2] space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9DEE2] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0D2C49]" />
                <h2 className="font-serif text-lg font-medium text-[#081D2E]">
                  Attributed Publications
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0D2C49]/5 border border-[#0D2C49]/15 text-[#0D2C49] font-medium text-xs">
                {publicationCount} Work{publicationCount === 1 ? "" : "s"}
              </span>
            </div>

            {publicationCount === 0 ? (
              <div className="p-8 text-center rounded-lg bg-[#F7F7F7] border border-[#D9DEE2]/60 space-y-2">
                <p className="text-xs font-sans text-[#64717C]">
                  No publications are currently attributed to this scholar.
                </p>
                <Link
                  href="/admin/publications/new"
                  className="inline-flex items-center gap-1.5 text-xs text-[#0D2C49] hover:underline font-medium"
                >
                  <span>Create a publication attributing this author</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#D9DEE2] border border-[#D9DEE2] rounded-lg overflow-hidden">
                {author.publications.map(({ publication: pub }) => (
                  <div
                    key={pub.id}
                    className="p-3.5 bg-white hover:bg-[#F7F7F7]/60 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <Link
                        href={`/admin/publications/${pub.id}/edit`}
                        className="text-xs font-medium text-[#081D2E] hover:text-[#0D2C49] hover:underline block truncate"
                      >
                        {pub.title}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-[#64717C]">
                        <span>{formatPublicationType(pub.type)}</span>
                        <span>•</span>
                        <span>{pub.year || (pub.publishedAt ? formatDate(pub.publishedAt) : "Date unassigned")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {getPublicationStatusBadge(pub.status)}
                      <Link
                        href={`/admin/publications/${pub.id}/edit`}
                        className="p-1.5 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-[#64717C] hover:text-[#0D2C49] transition-colors"
                        title="Edit publication"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              assetId={photoAssetId}
              url={photoUrl}
              fileName={photoFileName}
              fileSize={photoFileSize}
              mimeType={photoMimeType}
              canViewMedia={canViewMedia}
              canUpload={canUpload}
              onSelectAsset={handleSelectPhoto}
              onClear={handleClearPhoto}
              onLegacyUrlChange={(url) => {
                setPhotoModified(true);
                setPhotoAssetId(null);
                setPhotoUrl(url);
              }}
            />
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-xl border border-[#D9DEE2] space-y-4">
            <h2 className="font-serif text-lg font-medium text-[#081D2E] border-b border-[#D9DEE2] pb-3">
              Record Metadata
            </h2>

            <div className="space-y-2.5 text-xs font-sans text-[#64717C]">
              <div className="flex items-center justify-between">
                <span>Record Identifier</span>
                <span className="font-mono text-[11px] text-[#081D2E]">{author.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Created Date</span>
                <span className="text-[#081D2E]">{formatDate(author.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Updated</span>
                <span className="text-[#081D2E]">{formatDate(author.updatedAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Attributed Works</span>
                <span className="text-[#081D2E] font-medium">{publicationCount}</span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-xl border border-red-200 space-y-4">
            <h2 className="font-serif text-lg font-medium text-red-900 border-b border-red-200 pb-3">
              Danger Zone
            </h2>

            {publicationCount > 0 ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    Deletion is disabled because this scholar is attributed to <strong>{publicationCount} publication{publicationCount === 1 ? "" : "s"}</strong>. Detach or reassign those publications to delete this record.
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-100 text-slate-400 text-xs font-sans font-medium cursor-not-allowed border border-slate-200"
                >
                  Delete Author (Disabled)
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[#64717C] leading-relaxed">
                  Permanently delete this author profile. Any attached portrait photograph will revert to uploaded status in the Media Library.
                </p>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="w-full py-2.5 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-sans font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Author</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D9DEE2] max-w-md w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-200 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-medium text-[#081D2E]">
                  Confirm Author Deletion
                </h3>
                <p className="text-xs text-[#64717C] leading-relaxed">
                  Are you sure you want to delete <strong className="text-[#081D2E]">{author.name}</strong>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#D9DEE2]">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-xs font-sans font-medium text-[#081D2E] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-sans font-medium transition-colors flex items-center gap-2"
              >
                {deleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
