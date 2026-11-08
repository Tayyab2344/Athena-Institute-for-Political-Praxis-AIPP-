"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import { Publication } from "@/types";
import { ArrowLeft, Download, BookOpen, Share2, FileText, Calendar, CheckCircle2 } from "lucide-react";

export default function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  useEffect(() => {
    async function loadPublication() {
      try {
        const res = await fetch(`/api/publications/${slug}`);
        const data = await res.json();
        if (data && !data.error) {
          setPublication(data);
        }
      } catch (e) {
        console.error("Failed to load publication");
      } finally {
        setLoading(false);
      }
    }
    loadPublication();
  }, [slug]);

  const copyCitation = () => {
    if (!publication) return;
    const authorNames = publication.authors?.map((a: any) => a.name).join(", ") || publication.author || "";
    const text = `${authorNames} (${publication.year || 2026}). "${publication.title}". Athena Institute for Political Praxis (AIPP). DOI: ${publication.doi || "10.1080/aipp.2026"}.`;
    navigator.clipboard.writeText(text);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 3000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar onOpenContact={() => setIsContactOpen(true)} />
        <div className="flex-grow flex items-center justify-center py-40 text-xs font-sans text-[#5C6470]">
          Loading publication details from AIPP repository...
        </div>
        <Footer onOpenContact={() => setIsContactOpen(true)} />
      </main>
    );
  }

  if (!publication) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar onOpenContact={() => setIsContactOpen(true)} />
        <div className="flex-grow flex flex-col items-center justify-center py-40 space-y-4">
          <h1 className="font-serif text-3xl text-[#0D1B2A]">Publication Not Found</h1>
          <p className="text-xs font-sans text-[#5C6470]">The requested research paper may have been archived or moved.</p>
          <Link href="/research" className="px-6 py-3 rounded-full bg-[#0A192F] text-white text-xs font-sans font-semibold hover:bg-[#172E54] transition-colors">
            Return to Research Library
          </Link>
        </div>
        <Footer onOpenContact={() => setIsContactOpen(true)} />
      </main>
    );
  }

  const categoryName = typeof publication.category === "object" ? publication.category?.name : publication.category;

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      <section className="pt-36 pb-16 surface-muted border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 space-y-6">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-xs font-sans font-medium text-[#0A192F] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Research Archive</span>
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {publication.type && (
                <span className="px-3.5 py-1 rounded-full bg-[#0A192F] text-white text-[10px] font-sans uppercase tracking-widest font-semibold">
                  {publication.type.replace("_", " ")}
                </span>
              )}
              <span className="text-xs font-sans text-[#5C6470]">
                {publication.publicationDate ? new Date(publication.publicationDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : (publication.year || publication.date)}
              </span>
              {categoryName && (
                <span className="px-3 py-1 rounded-full bg-white text-[#958772] text-[10px] font-sans font-semibold border border-[#0A192F]/10">
                  {categoryName}
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-[#0D1B2A] leading-tight">
              {publication.title}
            </h1>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-sans text-[#0A192F] font-medium border-t border-[#0A192F]/10">
              <div>
                <span className="text-[#5C6470] block text-[10px] uppercase font-semibold">Author(s)</span>
                <span className="text-[#0D1B2A] font-semibold text-sm">
                  {publication.authors?.map((a: any) => a.name).join(", ") || publication.author}
                </span>
              </div>
              {publication.doi && (
                <div>
                  <span className="text-[#5C6470] block text-[10px] uppercase font-semibold">DOI Reference</span>
                  <span className="font-mono text-[#0A192F]">{publication.doi}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 space-y-10 sm:space-y-12">
          
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#F7F6F2] border border-[#0A192F]/10 shadow-sm space-y-4">
            <h2 className="font-serif text-xl text-[#0D1B2A] font-semibold">Executive Abstract</h2>
            <p className="text-sm sm:text-base font-sans text-[#5C6470] font-light leading-relaxed">
              {publication.abstract}
            </p>
          </div>

          {publication.description && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl text-[#0D1B2A] font-semibold">Research Methodology & Analysis</h2>
              <div className="text-sm font-sans text-[#5C6470] font-light leading-relaxed space-y-4 whitespace-pre-line">
                {publication.description}
              </div>
            </div>
          )}

          <div className="p-5 sm:p-6 rounded-2xl bg-[#F7F6F2] border border-[#0A192F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="block font-serif text-sm font-semibold text-[#0D1B2A]">Academic Citation Notice</span>
              <span className="text-xs font-sans text-[#5C6470]">
                Archived under Athena Institute for Political Praxis Open Research Initiative.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={copyCitation}
                className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-full border border-[#0A192F]/30 text-[#0A192F] text-xs font-sans font-semibold hover:bg-[#0A192F]/5 transition-colors flex items-center gap-2"
              >
                {copiedCitation ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? "Citation Copied" : "Copy Citation"}</span>
              </button>

              {publication.pdfUrl && (
                <a
                  href={publication.pdfUrl}
                  download
                  className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-full bg-[#0A192F] text-white text-xs font-sans font-semibold hover:bg-[#172E54] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Document</span>
                </a>
              )}
            </div>
          </div>

          {publication.pdfUrl ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-serif text-xl sm:text-2xl text-[#0D1B2A] font-semibold">Institutional PDF Reader</h2>
                <a
                  href={publication.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-sans text-[#0A192F] font-semibold underline flex items-center gap-1"
                >
                  <span>Open PDF in New Window</span>
                </a>
              </div>

              <div className="rounded-2xl border border-[#0A192F]/20 overflow-hidden shadow-2xl bg-[#06101E] aspect-[4/3] md:aspect-[16/10] min-h-[360px] sm:min-h-[480px]">
                <iframe
                  src={publication.pdfUrl}
                  className="w-full h-full border-none"
                  title={publication.title}
                />
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#F7F6F2] text-center text-xs font-sans text-[#5C6470]">
              Document available via AIPP Library Request. Contact research taskforce for full text.
            </div>
          )}

        </div>
      </section>

      <Footer onOpenContact={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </main>
  );
}
