"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, Image as ImageIcon, Save, CheckCircle2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Author {
  id: string;
  name: string;
}

export default function NewPublicationPage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    abstract: "",
    description: "",
    type: "RESEARCH_PAPER",
    status: "DRAFT",
    publicationDate: new Date().toISOString().split("T")[0],
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
    async function loadMetadata() {
      try {
        const [catRes, authRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/authors")
        ]);
        const catData = await catRes.json();
        const authData = await authRes.json();

        if (Array.isArray(catData)) setCategories(catData);
        if (Array.isArray(authData)) setAuthors(authData);
        if (catData.length > 0) setFormData((prev) => ({ ...prev, categoryId: catData[0].id }));
        if (authData.length > 0) setFormData((prev) => ({ ...prev, authorIds: [authData[0].id] }));
      } catch (e) {
        console.error("Failed to load metadata");
      } finally {
        setLoadingMetadata(false);
      }
    }
    loadMetadata();
  }, []);

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

  const toggleAuthor = (id: string) => {
    setFormData((prev) => {
      const exists = prev.authorIds.includes(id);
      return {
        ...prev,
        authorIds: exists
          ? prev.authorIds.filter((aId) => aId !== id)
          : [...prev.authorIds, id]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.authorIds.length === 0) {
      alert("Please select at least one author.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await res.json();

      if (res.ok) {
        alert("Publication created successfully!");
        router.push("/admin/publications");
      } else {
        alert(result.error || "Failed to create publication.");
      }
    } catch (e) {
      alert("Error submitting publication");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingMetadata) {
    return <div className="p-12 text-center text-xs font-sans text-[#5C5755]">Loading publishing environment...</div>;
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

      <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#4A121A]/10 shadow-sm">
        <h1 className="font-serif text-3xl text-[#1A1817] font-normal mb-2">
          New Research Publication
        </h1>
        <p className="text-xs font-sans text-[#5C5755] font-light">
          Publish peer-reviewed papers, policy briefs, reports, or journal articles to the AIPP digital archive.
        </p>
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
                placeholder="e.g. Women at the Negotiation Table: Impact Metrics in Multilateral Peace Treaties"
                className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
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
                placeholder="Concise 2–3 sentence executive summary of key research findings..."
                className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                Detailed Research Description / Methodology
              </label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed methodology, empirical data sources, findings, and treaty recommendations..."
                className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
              />
            </div>
          </div>

          <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#4A121A]/10 space-y-5 shadow-sm">
            <h2 className="font-serif text-lg text-[#1A1817] border-b border-[#4A121A]/10 pb-3 font-semibold">
              PDF Document Upload
            </h2>

            <div className="border-2 border-dashed border-[#4A121A]/20 rounded-2xl p-6 text-center space-y-3 bg-[#EFECE6]">
              <FileText className="w-8 h-8 text-[#4A121A] mx-auto opacity-70" />
              <div>
                <span className="block text-xs font-sans font-semibold text-[#1A1817]">
                  {formData.pdfFileName ? formData.pdfFileName : "Upload PDF Publication Document"}
                </span>
                <span className="block text-[10px] font-sans text-[#5C5755] mt-1">
                  PDF format only · Maximum file size 25MB
                </span>
              </div>

              {formData.pdfUrl && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-sans font-medium">
                  <CheckCircle2 className="w-3 h-3" /> PDF Uploaded: {formData.pdfUrl}
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
                  id="pdf-input"
                />
                <label
                  htmlFor="pdf-input"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold cursor-pointer hover:bg-[#6A1B27] transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingPdf ? "Uploading PDF..." : "Select PDF File"}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                Cover Image URL / Upload
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                  placeholder="https://... or upload image"
                  className="flex-grow px-4 py-2.5 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817]"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "cover");
                  }}
                  className="hidden"
                  id="cover-input"
                />
                <label
                  htmlFor="cover-input"
                  className="px-4 py-2.5 rounded-xl border border-[#4A121A]/30 text-[#4A121A] text-xs font-sans font-semibold cursor-pointer hover:bg-[#4A121A] hover:text-[#FAF8F5] transition-colors flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>{uploadingCover ? "Uploading..." : "Upload Cover"}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#4A121A]/10 space-y-5 shadow-sm">
            <h2 className="font-serif text-lg text-[#1A1817] border-b border-[#4A121A]/10 pb-3 font-semibold">
              Publishing Workflow
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
                <option value="DRAFT">DRAFT (Internal only)</option>
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
                Research Category *
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
                Select Author(s) *
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

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                DOI Reference
              </label>
              <input
                type="text"
                value={formData.doi}
                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                placeholder="10.1080/aipp.2026.01"
                className="w-full px-4 py-2.5 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817]"
              />
            </div>

            <div className="pt-4 border-t border-[#4A121A]/10">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold tracking-wider hover:bg-[#6A1B27] transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? "Saving Publication..." : "Save & Create Publication"}</span>
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
