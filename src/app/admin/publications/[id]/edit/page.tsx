"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, Image as ImageIcon, Save, CheckCircle2, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Author {
  id: string;
  name: string;
}

export default function EditPublicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    pdfUrl: "",
    pdfFileName: "",
    pdfFileSize: 0,
    pdfMimeType: "application/pdf",
    doi: "",
    categoryId: "",
    authorIds: [] as string[]
  });

  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, authRes, pubRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/authors"),
          fetch(`/api/publications/${id}?admin=true`)
        ]);

        const catData = await catRes.json();
        const authData = await authRes.json();
        const pubData = await pubRes.json();

        if (Array.isArray(catData)) setCategories(catData);
        if (Array.isArray(authData)) setAuthors(authData);

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
            pdfUrl: pubData.pdfUrl || "",
            pdfFileName: pubData.pdfFileName || "",
            pdfFileSize: pubData.pdfFileSize || 0,
            pdfMimeType: pubData.pdfMimeType || "application/pdf",
            doi: pubData.doi || "",
            categoryId: pubData.categoryId || (catData[0]?.id || ""),
            authorIds: pubData.authors ? pubData.authors.map((a: { id: string }) => a.id) : []
          });
        }
      } catch (e) {
        console.error("Failed to load publication data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleFileUpload = async (file: File, uploadType: "pdf" | "cover") => {
    const data = new FormData();
    data.append("file", file);
    data.append("type", uploadType);

    if (uploadType === "pdf") setUploadingPdf(true);
    else setUploadingCover(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data
      });
      const result = await res.json();

      if (res.ok && result.url) {
        if (uploadType === "pdf") {
          setFormData((prev) => ({
            ...prev,
            pdfUrl: result.url,
            pdfFileName: result.fileName,
            pdfFileSize: result.fileSize,
            pdfMimeType: result.mimeType
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            coverImageUrl: result.url
          }));
        }
      } else {
        alert(result.error || "Failed to upload file");
      }
    } catch (e) {
      alert("Error uploading file");
    } finally {
      setUploadingPdf(false);
      setUploadingCover(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/publications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await res.json();

      if (res.ok) {
        alert("Publication updated successfully!");
        router.push("/admin/publications");
      } else {
        alert(result.error || "Failed to update publication.");
      }
    } catch (e) {
      alert("Error updating publication");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs font-sans text-[#5C5755]">Loading publication details...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/publications"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#4A121A] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Publications</span>
        </Link>
      </div>

      <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#4A121A]/10 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[#1A1817] font-normal mb-1">
            Edit Publication
          </h1>
          <p className="text-xs font-sans text-[#5C5755] font-light">
            Update metadata, PDF files, category tags, or publication status.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#4A121A]/10 space-y-5 shadow-sm">
            <h2 className="font-serif text-lg text-[#1A1817] border-b border-[#4A121A]/10 pb-3 font-semibold">
              Publication Content & Metadata
            </h2>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                Publication Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                Executive Abstract *
              </label>
              <textarea
                rows={4}
                required
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                Detailed Research Description
              </label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817]"
              />
            </div>
          </div>

          <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#4A121A]/10 space-y-5 shadow-sm">
            <h2 className="font-serif text-lg text-[#1A1817] border-b border-[#4A121A]/10 pb-3 font-semibold">
              PDF & Cover Files
            </h2>

            <div className="border-2 border-dashed border-[#4A121A]/20 rounded-2xl p-6 text-center space-y-3 bg-[#EFECE6]">
              <FileText className="w-8 h-8 text-[#4A121A] mx-auto opacity-70" />
              <div>
                <span className="block text-xs font-sans font-semibold text-[#1A1817]">
                  {formData.pdfFileName ? formData.pdfFileName : "Upload PDF Publication Document"}
                </span>
                <span className="block text-[10px] font-sans text-[#5C5755] mt-1">
                  PDF format only · Max 25MB
                </span>
              </div>

              {formData.pdfUrl && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-sans font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Attached PDF: {formData.pdfUrl}
                </div>
              )}

              <div>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "pdf");
                  }}
                  className="hidden"
                  id="pdf-input-edit"
                />
                <label
                  htmlFor="pdf-input-edit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold cursor-pointer hover:bg-[#6A1B27] transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingPdf ? "Uploading PDF..." : "Replace PDF File"}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#4A121A]/10 space-y-5 shadow-sm">
            <h2 className="font-serif text-lg text-[#1A1817] border-b border-[#4A121A]/10 pb-3 font-semibold">
              Publishing Settings
            </h2>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                Publication Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans font-semibold text-[#4A121A]"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="APPROVED">APPROVED</option>
                <option value="PUBLISHED">PUBLISHED (Visible to Public)</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                Publication Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817]"
              >
                <option value="RESEARCH_PAPER">RESEARCH PAPER</option>
                <option value="POLICY_BRIEF">POLICY BRIEF</option>
                <option value="REPORT">REPORT</option>
                <option value="JOURNAL">JOURNAL ARTICLE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                Author(s) *
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto p-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10">
                {authors.map((auth) => (
                  <label key={auth.id} className="flex items-center gap-2 text-xs font-sans text-[#1A1817] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.authorIds.includes(auth.id)}
                      onChange={() => toggleAuthor(auth.id)}
                      className="rounded text-[#4A121A]"
                    />
                    <span>{auth.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#4A121A]/10">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold tracking-wider hover:bg-[#6A1B27] transition-colors flex items-center justify-center gap-2 shadow-lg"
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
