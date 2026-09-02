"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import { ArrowLeft, BookOpen, Download, Calendar, FileText, ArrowUpRight } from "lucide-react";

interface JournalIssue {
  id: string;
  volume: number;
  issue: number;
  title: string;
  description?: string;
  coverImageUrl?: string;
  pdfUrl?: string;
  publishedAt?: string;
  publications: {
    id: string;
    title: string;
    slug: string;
    type: string;
    abstract: string;
  }[];
}

interface Journal {
  id: string;
  title: string;
  slug: string;
  description?: string;
  issues: JournalIssue[];
}

export default function JournalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    async function loadJournal() {
      try {
        const res = await fetch("/api/journals");
        const data = await res.json();
        if (Array.isArray(data)) {
          const match = data.find((j: Journal) => j.slug === slug || j.id === slug);
          if (match) setJournal(match);
        }
      } catch (e) {
        console.error("Failed to load journal detail");
      } finally {
        setLoading(false);
      }
    }
    loadJournal();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] text-[#1A1817] flex flex-col font-sans">
        <Navbar onOpenContact={() => setIsContactOpen(true)} />
        <div className="flex-grow flex items-center justify-center py-40 text-xs font-sans text-[#5C5755]">
          Loading Journal Volume Details...
        </div>
        <Footer onOpenContact={() => setIsContactOpen(true)} />
      </main>
    );
  }

  if (!journal || journal.issues.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] text-[#1A1817] flex flex-col font-sans">
        <Navbar onOpenContact={() => setIsContactOpen(true)} />
        <div className="flex-grow flex flex-col items-center justify-center py-40 space-y-4">
          <h1 className="font-serif text-3xl text-[#1A1817]">Journal Issue Not Found</h1>
          <p className="text-xs font-sans text-[#5C5755]">The requested journal issue may have been moved or archived.</p>
          <Link href="/journals" className="px-6 py-3 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold">
            Return to Journal Archive
          </Link>
        </div>
        <Footer onOpenContact={() => setIsContactOpen(true)} />
      </main>
    );
  }

  const latestIssue = journal.issues[0];

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1A1817] flex flex-col font-sans">
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      <section className="pt-36 pb-16 bg-[#EFECE6] border-b border-[#4A121A]/10">
        <div className="max-w-5xl mx-auto px-6 md:px-12 space-y-6">
          <Link
            href="/journals"
            className="inline-flex items-center gap-2 text-xs font-sans font-medium text-[#4A121A] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal Archive</span>
          </Link>

          <div className="space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-[#4A121A] text-[#FAF8F5] text-[10px] font-sans uppercase tracking-widest font-semibold inline-block">
              Volume 0{latestIssue.volume} · Issue 0{latestIssue.issue}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1817] leading-tight">
              {latestIssue.title}
            </h1>

            <p className="text-sm font-sans text-[#5C5755] font-light leading-relaxed max-w-3xl">
              {latestIssue.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#FAF8F5] flex-grow">
        <div className="max-w-5xl mx-auto px-6 md:px-12 space-y-12">
          
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-[#1A1817] font-semibold border-b border-[#4A121A]/15 pb-3">
              Table of Contents & Published Articles ({latestIssue.publications.length})
            </h2>

            <div className="space-y-6">
              {latestIssue.publications.map((article, idx) => (
                <div
                  key={article.id}
                  className="p-6 rounded-2xl bg-[#EFECE6] border border-[#4A121A]/10 hover:border-[#4A121A]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3 text-xs font-sans text-[#4A121A] font-semibold">
                      <span className="font-mono">ARTICLE 0{idx + 1}</span>
                      <span>·</span>
                      <span>{article.type.replace("_", " ")}</span>
                    </div>

                    <Link href={`/research/${article.slug}`}>
                      <h3 className="font-serif text-xl text-[#1A1817] group-hover:text-[#4A121A] transition-colors font-semibold">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-xs font-sans text-[#5C5755] font-light line-clamp-2 leading-relaxed">
                      {article.abstract}
                    </p>
                  </div>

                  <Link
                    href={`/research/${article.slug}`}
                    className="px-5 py-2.5 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold hover:bg-[#6A1B27] transition-colors flex items-center gap-2 flex-shrink-0"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {latestIssue.pdfUrl && (
            <div className="p-8 rounded-3xl bg-[#EFECE6] border border-[#4A121A]/15 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl text-[#1A1817] font-semibold">Complete Compiled Journal Issue PDF</h3>
                  <p className="text-xs font-sans text-[#5C5755] mt-1">Download or view full compiled PDF volume including cover, editorial notes, and articles.</p>
                </div>

                <a
                  href={latestIssue.pdfUrl}
                  download
                  className="px-6 py-3 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold hover:bg-[#6A1B27] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full Issue</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer onOpenContact={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </main>
  );
}
