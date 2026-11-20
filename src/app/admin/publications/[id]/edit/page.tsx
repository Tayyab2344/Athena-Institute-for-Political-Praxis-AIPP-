"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import MediaAssetField from "@/components/admin/media/MediaAssetField";
import type { SelectedMediaAsset } from "@/lib/media/selection";

interface Category {
  id: string;
  name: string;
}

interface Author {
  id: string;
  name: string;
}

interface AuthMeResponse {
  permissions?: {
    view_media?: boolean;
    upload_files?: boolean;
  };
}

interface JournalIssueOption {
  id: string;
  volume: number;
  issue: number;
  title: string;
  journalTitle: string;
}

interface LoadedPublicationResponse {
  error?: string;
  title?: string;
  slug?: string;
  abstract?: string;
  description?: string | null;
  type?: string;
  status?: string;
  publicationDate?: string | null;
  year?: number | null;
  coverImageUrl?: string | null;
  coverImageAssetId?: string | null;
  coverImageAsset?: {
    originalFilename?: string;
    bytes?: number;
    mimeType?: string;
  } | null;
  pdfUrl?: string | null;
  pdfAssetId?: string | null;
  pdfFileName?: string | null;
  pdfFileSize?: number | null;
  pdfMimeType?: string | null;
  doi?: string | null;
  categoryId?: string | null;
  journalIssueId?: string | null;
  authors?: Array<{ id: string }>;
}

export default function EditPublicationPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [journalIssues, setJournalIssues] = useState<JournalIssueOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [canViewMedia, setCanViewMedia] = useState(false);
  const [canUpload, setCanUpload] = useState(false);

  const [coverModified, setCoverModified] = useState(false);
  const [pdfModified, setPdfModified] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    abstract: "",
    description: "",
    type: "RESEARCH_PAPER",
    status: "DRAFT",
    publicationDate: "",
    year: new Date().getFullYear(),
    coverImageUrl: "",
    coverImageAssetId: null as string | null,
    coverImageFileName: "",
    coverImageFileSize: 0,
    coverImageMimeType: "",
    pdfUrl: "",
    pdfAssetId: null as string | null,
    pdfFileName: "",
    pdfFileSize: 0,
    pdfMimeType: "",
    doi: "",
    categoryId: "",
    journalIssueId: null as string | null,
    authorIds: [] as string[]
  });

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch("/api/auth/me", { cache: "no-store" });
        const meData = meRes.ok ? ((await meRes.json()) as AuthMeResponse) : {};
        setCanViewMedia(Boolean(meData.permissions?.view_media));
        setCanUpload(Boolean(meData.permissions?.upload_files));

        const catRes = await fetch("/api/categories");
        const catData = (await catRes.json()) as Category[];
        if (Array.isArray(catData)) setCategories(catData);

        const authRes = await fetch("/api/authors");
        const authData = (await authRes.json()) as Author[];
        if (Array.isArray(authData)) setAuthors(authData);

        const jRes = await fetch("/api/journals");
        const jData = (await jRes.json()) as Array<{
          id: string;
          title: string;
          issues?: Array<{
            id: string;
            volume: number;
            issue: number;
            title: string;
          }>;
        }>;
        if (Array.isArray(jData)) {
          const flatIssues: JournalIssueOption[] = [];
          for (const j of jData) {
            if (Array.isArray(j.issues)) {
              for (const iss of j.issues) {
                flatIssues.push({
                  id: iss.id,
                  volume: iss.volume,
                  issue: iss.issue,
                  title: iss.title,
                  journalTitle: j.title
                });
              }
            }
          }
          setJournalIssues(flatIssues);
        }

        const pubRes = await fetch(`/api/publications/${id}?admin=true`, { cache: "no-store" });
        const pubData = (await pubRes.json()) as LoadedPublicationResponse;

        if (pubData && !pubData.error) {
          setFormData({
            title: pubData.title || "",
            slug: pubData.slug || "",
            abstract: pubData.abstract || "",
            description: pubData.description || "",
            type: pubData.type || "RESEARCH_PAPER",
            status: pubData.status || "DRAFT",
            publicationDate: pubData.publicationDate ? pubData.publicationDate.split("T")[0] : "",
            year: pubData.year || new Date().getFullYear(),
            coverImageUrl: pubData.coverImageUrl || "",
            coverImageAssetId: pubData.coverImageAssetId || null,
            coverImageFileName: pubData.coverImageAsset?.originalFilename || "",
            coverImageFileSize: pubData.coverImageAsset?.bytes || 0,
            coverImageMimeType: pubData.coverImageAsset?.mimeType || "",
            pdfUrl: pubData.pdfUrl || "",
            pdfAssetId: pubData.pdfAssetId || null,
            pdfFileName: pubData.pdfFileName || "",
            pdfFileSize: pubData.pdfFileSize || 0,
            pdfMimeType: pubData.pdfMimeType || "",
            doi: pubData.doi || "",
            categoryId: pubData.categoryId || (Array.isArray(catData) && catData[0]?.id ? catData[0].id : ""),
            journalIssueId: pubData.journalIssueId || null,
            authorIds: pubData.authors ? pubData.authors.map((a) => a.id) : []
          });
          setCoverModified(false);
          setPdfModified(false);
        } else {
          setFormError(pubData?.error || "Publication not found.");
        }
      } catch {
        setFormError("Failed to load publication details.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const toggleAuthor = (authId: string) => {
    setFormData((prev) => {
      const exists = prev.authorIds.includes(authId);
      return {
        ...prev,
        authorIds: exists
          ? prev.authorIds.filter((aId) => aId !== authId)
          : [...prev.authorIds, authId]
      };
    });
  };

  const handleSelectCover = (asset: SelectedMediaAsset) => {
    setCoverModified(true);
    setFormData((prev) => ({
      ...prev,
      coverImageAssetId: asset.id,
      coverImageUrl: asset.secureUrl,
      coverImageFileName: asset.originalFilename,
      coverImageFileSize: asset.bytes,
      coverImageMimeType: asset.mimeType
    }));
  };

  const handleClearCover = () => {
    setCoverModified(true);
    setFormData((prev) => ({
      ...prev,
      coverImageAssetId: null,
      coverImageUrl: "",
      coverImageFileName: "",
      coverImageFileSize: 0,
      coverImageMimeType: ""
    }));
  };

  const handleLegacyCoverUrlChange = (url: string) => {
    setCoverModified(true);
    setFormData((prev) => ({
      ...prev,
      coverImageAssetId: null,
      coverImageUrl: url,
      coverImageFileName: "",
      coverImageFileSize: 0,
      coverImageMimeType: ""
    }));
  };

  const handleSelectPdf = (asset: SelectedMediaAsset) => {
    setPdfModified(true);
    setFormData((prev) => ({
      ...prev,
      pdfAssetId: asset.id,
      pdfUrl: asset.secureUrl,
      pdfFileName: asset.originalFilename,
      pdfFileSize: asset.bytes,
      pdfMimeType: asset.mimeType
    }));
  };

  const handleClearPdf = () => {
    setPdfModified(true);
    setFormData((prev) => ({
      ...prev,
      pdfAssetId: null,
      pdfUrl: "",
      pdfFileName: "",
      pdfFileSize: 0,
      pdfMimeType: ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        title: formData.title,
        slug: formData.slug,
        abstract: formData.abstract,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        publicationDate: formData.publicationDate,
        year: formData.year,
        doi: formData.doi,
        categoryId: formData.categoryId,
        journalIssueId: formData.journalIssueId || null,
        authorIds: formData.authorIds
      };

      if (coverModified) {
        if (formData.coverImageAssetId) {
          payload.coverImageAssetId = formData.coverImageAssetId;
          payload.coverImageUrl = formData.coverImageUrl;
        } else if (formData.coverImageUrl.trim()) {
          payload.coverImageUrl = formData.coverImageUrl.trim();
        } else {
          payload.coverImageAssetId = null;
          payload.coverImageUrl = "";
        }
      }

      if (pdfModified) {
        if (formData.pdfAssetId) {
          payload.pdfAssetId = formData.pdfAssetId;
          payload.pdfUrl = formData.pdfUrl;
          payload.pdfFileName = formData.pdfFileName;
          payload.pdfFileSize = formData.pdfFileSize;
          payload.pdfMimeType = formData.pdfMimeType;
        } else if (formData.pdfUrl.trim()) {
          payload.pdfUrl = formData.pdfUrl.trim();
          payload.pdfFileName = formData.pdfFileName;
          payload.pdfFileSize = formData.pdfFileSize;
          payload.pdfMimeType = formData.pdfMimeType || "application/pdf";
        } else {
          payload.pdfAssetId = null;
          payload.pdfUrl = "";
          payload.pdfFileName = "";
          payload.pdfFileSize = 0;
          payload.pdfMimeType = "";
        }
      }

      const res = await fetch(`/api/publications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await res.json()) as { error?: string };

      if (res.ok) {
        router.push("/admin/publications");
      } else {
        setFormError(result.error || "Failed to update publication.");
      }
    } catch {
      setFormError("Error updating publication. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-sans text-[#64717C]">
        Loading publication details...
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/publications"
          className="inline-flex items-center gap-2 text-xs font-sans font-medium text-[#0D2C49] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Publications</span>
        </Link>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#D9DEE2]">
        <span className="block text-[10px] font-sans uppercase tracking-[0.18em] text-[#B09C4B] font-semibold">
          Research &amp; Publishing
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#081D2E] font-medium mt-1">
          Edit Publication
        </h1>
        <p className="text-xs sm:text-sm font-sans text-[#64717C] mt-1">
          Update metadata, attached media assets, category tags, or publication status.
        </p>
      </div>

      {formError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-sans flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="p-5 sm:p-6 bg-white rounded-xl border border-[#D9DEE2] space-y-5">
            <h2 className="font-serif text-lg text-[#081D2E] border-b border-[#D9DEE2] pb-3 font-medium">
              Publication Content &amp; Metadata
            </h2>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                Publication Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-sm sm:text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                Executive Abstract *
              </label>
              <textarea
                rows={4}
                required
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-sm sm:text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                Detailed Research Description
              </label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-sm sm:text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              />
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-xl border border-[#D9DEE2] space-y-6">
            <h2 className="font-serif text-lg text-[#081D2E] border-b border-[#D9DEE2] pb-3 font-medium">
              PDF &amp; Cover Files
            </h2>

            <MediaAssetField
              field="publication_pdf"
              label="PDF Publication Document"
              assetId={formData.pdfAssetId}
              url={formData.pdfUrl}
              fileName={formData.pdfFileName}
              fileSize={formData.pdfFileSize}
              mimeType={formData.pdfMimeType}
              canViewMedia={canViewMedia}
              canUpload={canUpload}
              onSelectAsset={handleSelectPdf}
              onClear={handleClearPdf}
            />

            <div className="border-t border-[#D9DEE2]/70 pt-5">
              <MediaAssetField
                field="publication_cover"
                label="Cover Image"
                assetId={formData.coverImageAssetId}
                url={formData.coverImageUrl}
                fileName={formData.coverImageFileName}
                fileSize={formData.coverImageFileSize}
                mimeType={formData.coverImageMimeType}
                canViewMedia={canViewMedia}
                canUpload={canUpload}
                onSelectAsset={handleSelectCover}
                onClear={handleClearCover}
                onLegacyUrlChange={handleLegacyCoverUrlChange}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 sm:p-6 bg-white rounded-xl border border-[#D9DEE2] space-y-5">
            <h2 className="font-serif text-lg text-[#081D2E] border-b border-[#D9DEE2] pb-3 font-medium">
              Publishing Settings
            </h2>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                Publication Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full min-h-[42px] px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans font-semibold text-[#0D2C49]"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="APPROVED">APPROVED</option>
                <option value="PUBLISHED">PUBLISHED (Visible to Public)</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                Publication Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full min-h-[42px] px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E]"
              >
                <option value="RESEARCH_PAPER">RESEARCH PAPER</option>
                <option value="POLICY_BRIEF">POLICY BRIEF</option>
                <option value="REPORT">REPORT</option>
                <option value="JOURNAL">JOURNAL ARTICLE</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full min-h-[42px] px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                Institutional Journal Issue (Optional)
              </label>
              <select
                value={formData.journalIssueId || ""}
                onChange={(e) => setFormData({ ...formData, journalIssueId: e.target.value || null })}
                className="w-full min-h-[42px] px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E]"
              >
                <option value="">None (Independent Publication)</option>
                {journalIssues.map((ji) => (
                  <option key={ji.id} value={ji.id}>
                    {ji.journalTitle} — Vol. {ji.volume}, Issue {ji.issue}: {ji.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5">
                Author(s) *
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto p-3 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2]">
                {authors.map((auth) => (
                  <label
                    key={auth.id}
                    className="flex items-center gap-2 text-xs font-sans text-[#081D2E] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.authorIds.includes(auth.id)}
                      onChange={() => toggleAuthor(auth.id)}
                      className="rounded text-[#0D2C49]"
                    />
                    <span>{auth.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#D9DEE2]">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-semibold tracking-wider hover:bg-[#081D2E] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? "Saving Changes..." : "Update Publication"}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
