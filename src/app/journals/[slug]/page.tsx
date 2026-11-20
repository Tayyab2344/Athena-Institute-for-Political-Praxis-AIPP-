"use client";

import { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import { ArrowLeft, Download, Calendar, ArrowUpRight } from "lucide-react";

interface JournalIssue {
  id: string;
  volume: number;
  issue: number;
  title: string;
  description?: string | null;
  status?: string;
  coverImageUrl?: string | null;
  pdfUrl?: string | null;
  publishedAt?: string | null;
  createdAt?: string;
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
  description?: string | null;
  status?: string;
  issues: JournalIssue[];
}

function compareIssuesDeterministically(a: JournalIssue, b: JournalIssue): number {
  const aTime = a.publishedAt ? Date.parse(a.publishedAt) : Number.NEGATIVE_INFINITY;
  const bTime = b.publishedAt ? Date.parse(b.publishedAt) : Number.NEGATIVE_INFINITY;
  const normA = Number.isNaN(aTime) ? Number.NEGATIVE_INFINITY : aTime;
  const normB = Number.isNaN(bTime) ? Number.NEGATIVE_INFINITY : bTime;
  if (normB !== normA) return normB - normA;
  if (b.volume !== a.volume) return b.volume - a.volume;
  if (b.issue !== a.issue) return b.issue - a.issue;
  const aCreated = a.createdAt ? Date.parse(a.createdAt) : 0;
  const bCreated = b.createdAt ? Date.parse(b.createdAt) : 0;
  if (bCreated !== aCreated) return bCreated - aCreated;
  return b.id.localeCompare(a.id);
}

function formatNumberPad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function JournalDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [journal, setJournal] = useState<Journal | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const queryIssueId =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("issue")
        : null;

    async function loadJournal() {
      try {
        const res = await fetch(`/api/journals/${encodeURIComponent(slug)}?publicOnly=true`);
        if (!res.ok) {
          setJournal(null);
          return;
        }
        const data = (await res.json()) as Journal;
        if (!data || !Array.isArray(data.issues) || (data.status && data.status !== "PUBLISHED")) {
          setJournal(null);
          return;
        }
        const publishedIssues = data.issues
          .filter((iss) => !iss.status || iss.status === "PUBLISHED")
          .sort(compareIssuesDeterministically);
        setJournal({ ...data, issues: publishedIssues });
        if (queryIssueId && publishedIssues.some((iss) => iss.id === queryIssueId)) {
          setSelectedIssueId(queryIssueId);
        } else {
          setSelectedIssueId(publishedIssues[0]?.id ?? null);
        }
      } catch {
        setJournal(null);
      } finally {
        setLoading(false);
      }
    }
    loadJournal();
  }, [slug]);

  const sortedIssues = useMemo(
    () => (journal ? [...journal.issues].sort(compareIssuesDeterministically) : []),
    [journal]
  );

  const activeIssue = useMemo(() => {
    if (sortedIssues.length === 0) return null;
    if (selectedIssueId) {
      const explicit = sortedIssues.find((iss) => iss.id === selectedIssueId);
      if (explicit) return explicit;
    }
    return sortedIssues[0];
  }, [sortedIssues, selectedIssueId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar onOpenContact={() => setIsContactOpen(true)} />
        <div className="flex-grow flex items-center justify-center py-40 text-xs font-sans text-[#5C6470]">
          Loading Journal Volume Details...
        </div>
        <Footer onOpenContact={() => setIsContactOpen(true)} />
      </main>
    );
  }

  if (!journal || !activeIssue) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar onOpenContact={() => setIsContactOpen(true)} />
        <div className="flex-grow flex flex-col items-center justify-center py-40 space-y-4 px-4 text-center">
          <h1 className="font-serif text-3xl text-[#081D2E]">Journal Issue Not Found</h1>
          <p className="text-xs font-sans text-[#5C6470]">
            The requested journal issue may have been moved, unpublished, or archived.
          </p>
          <Link
            href="/journals"
            className="px-6 py-3 rounded-full bg-[#0D2C49] text-white text-xs font-sans font-semibold hover:bg-[#081D2E] transition-colors"
          >
            Return to Journal Archive
          </Link>
        </div>
        <Footer onOpenContact={() => setIsContactOpen(true)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      <section className="pt-36 pb-16 surface-muted border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 space-y-6">
          <Link
            href="/journals"
            className="inline-flex items-center gap-2 text-xs font-sans font-medium text-[#0D2C49] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal Archive</span>
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-[#0D2C49] text-white text-[10px] font-sans uppercase tracking-widest font-semibold inline-block">
                Volume {formatNumberPad(activeIssue.volume)} · Issue {formatNumberPad(activeIssue.issue)}
              </span>
              <span className="text-xs font-sans text-[#64717C] inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B09C4B]" />
                {activeIssue.publishedAt
                  ? new Date(activeIssue.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })
                  : "Published"}
              </span>
            </div>

            <p className="text-xs font-sans uppercase tracking-[0.18em] text-[#B09C4B] font-semibold">
              {journal.title}
            </p>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-[#081D2E] leading-tight">
              {activeIssue.title}
            </h1>

            {activeIssue.description && (
              <p className="text-sm font-sans text-[#5C6470] font-light leading-relaxed max-w-3xl">
                {activeIssue.description}
              </p>
            )}
          </div>

          {sortedIssues.length > 1 && (
            <div className="pt-4 border-t border-[#D9DEE2] space-y-2">
              <span className="block text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-[#64717C]">
                Published Issues in This Journal ({sortedIssues.length})
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {sortedIssues.map((iss) => {
                  const isCurrent = iss.id === activeIssue.id;
                  return (
                    <button
                      key={iss.id}
                      type="button"
                      onClick={() => setSelectedIssueId(iss.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium border transition-colors cursor-pointer ${
                        isCurrent
                          ? "bg-[#0D2C49] text-white border-[#0D2C49]"
                          : "bg-white text-[#081D2E] border-[#D9DEE2] hover:border-[#0D2C49]"
                      }`}
                    >
                      Vol. {formatNumberPad(iss.volume)} · Issue {formatNumberPad(iss.issue)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 space-y-10 sm:space-y-12">
          <div className="space-y-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#081D2E] font-semibold border-b border-[#D9DEE2] pb-3">
              Table of Contents &amp; Published Articles ({activeIssue.publications.length})
            </h2>

            {activeIssue.publications.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#64717C]">
                No published articles are linked to this issue yet.
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {activeIssue.publications.map((article, idx) => (
                  <div
                    key={article.id}
                    className="p-4 sm:p-6 rounded-2xl bg-[#F7F7F7] border border-[#D9DEE2] hover:border-[#0D2C49]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 group shadow-sm"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-3 text-xs font-sans text-[#B09C4B] font-semibold">
                        <span className="font-mono">ARTICLE {formatNumberPad(idx + 1)}</span>
                        <span>·</span>
                        <span>{article.type.replace("_", " ")}</span>
                      </div>

                      <Link href={`/research/${article.slug}`}>
                        <h3 className="font-serif text-lg sm:text-xl text-[#081D2E] group-hover:text-[#0D2C49] transition-colors font-semibold">
                          {article.title}
                        </h3>
                      </Link>

                      <p className="text-xs font-sans text-[#5C6470] font-light line-clamp-2 leading-relaxed">
                        {article.abstract}
                      </p>
                    </div>

                    <Link
                      href={`/research/${article.slug}`}
                      className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-full bg-[#0D2C49] text-white text-xs font-sans font-semibold hover:bg-[#081D2E] transition-colors flex items-center gap-2 flex-shrink-0"
                    >
                      <span>Read Article</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {activeIssue.pdfUrl && (
            <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#F7F7F7] border border-[#D9DEE2] space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl text-[#081D2E] font-semibold">
                    Complete Compiled Journal Issue PDF
                  </h3>
                  <p className="text-xs font-sans text-[#5C6470] mt-1">
                    Download or view full compiled PDF volume including cover, editorial notes, and articles.
                  </p>
                </div>

                <a
                  href={activeIssue.pdfUrl}
                  download
                  className="w-full sm:w-auto justify-center px-6 py-3 rounded-full bg-[#0D2C49] text-white text-xs font-sans font-semibold hover:bg-[#081D2E] transition-colors flex items-center gap-2 shadow-sm"
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
