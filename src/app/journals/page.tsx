"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import { BookOpen, ArrowUpRight, Calendar } from "lucide-react";

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
  publications: { id: string; title: string; slug: string; type: string }[];
}

interface Journal {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  status?: string;
  coverImageUrl?: string | null;
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

export default function PublicJournalsArchivePage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    async function loadJournals() {
      try {
        const res = await fetch("/api/journals?publicOnly=true");
        const data = (await res.json()) as Journal[];
        if (Array.isArray(data)) {
          const publishedOnly = data
            .filter((j) => !j.status || j.status === "PUBLISHED")
            .map((j) => ({
              ...j,
              issues: (j.issues || [])
                .filter((iss) => !iss.status || iss.status === "PUBLISHED")
                .sort(compareIssuesDeterministically)
            }));
          setJournals(publishedOnly);
        }
      } catch {
        setJournals([]);
      } finally {
        setLoading(false);
      }
    }
    loadJournals();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      <section className="pt-36 pb-16 surface-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#B09C4B]">
              AIPP INSTITUTIONAL JOURNAL ARCHIVE
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#081D2E]">
              Journals &amp; Volumes
            </h1>
            <p className="text-sm sm:text-base font-sans text-[#5C6470] font-light leading-relaxed">
              Quarterly academic volumes compiling peer-reviewed research papers, diplomatic commentaries, and policy audits on female statecraft.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12 sm:space-y-16">
          {loading ? (
            <div className="py-20 text-center text-xs font-sans text-[#5C6470]">
              Loading AIPP Journal Collection...
            </div>
          ) : journals.length === 0 ? (
            <div className="py-20 text-center bg-[#F7F7F7] rounded-3xl border border-[#D9DEE2] space-y-4">
              <BookOpen className="w-10 h-10 text-[#0D2C49]/30 mx-auto" />
              <p className="font-serif text-xl text-[#081D2E]">
                No journals published in archive yet.
              </p>
            </div>
          ) : (
            journals.map((journal) => (
              <div key={journal.id} className="space-y-8">
                <div className="border-b border-[#D9DEE2] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#B09C4B]">
                      PEER-REVIEWED JOURNAL SERIES
                    </span>
                    <h2 className="font-serif text-2xl sm:text-4xl text-[#081D2E] font-semibold mt-1">
                      {journal.title}
                    </h2>
                    {journal.description && (
                      <p className="text-sm font-sans text-[#5C6470] font-light mt-2 max-w-2xl">
                        {journal.description}
                      </p>
                    )}
                  </div>
                  {journal.issues.length > 0 && (
                    <Link
                      href={`/journals/${journal.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#0D2C49] hover:underline shrink-0"
                    >
                      <span>View Journal Series</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {journal.issues.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#64717C]">
                    No published issues are currently available in this series.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {journal.issues.map((issue) => (
                      <div
                        key={issue.id}
                        className="bg-white rounded-3xl border border-[#D9DEE2] p-5 sm:p-8 shadow-sm hover:border-[#0D2C49]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div className="space-y-6">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="px-3.5 py-1 rounded-full bg-[#0D2C49] text-white text-[10px] font-sans font-semibold uppercase tracking-wider">
                              Volume {formatNumberPad(issue.volume)} · Issue {formatNumberPad(issue.issue)}
                            </span>
                            <span className="text-xs font-sans text-[#5C6470] flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#B09C4B]" />
                              {issue.publishedAt
                                ? new Date(issue.publishedAt).toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric"
                                  })
                                : "Published"}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-serif text-xl sm:text-2xl text-[#081D2E] group-hover:text-[#0D2C49] transition-colors leading-tight font-semibold mb-2">
                              {issue.title}
                            </h3>
                            {issue.description && (
                              <p className="text-xs font-sans text-[#5C6470] font-light leading-relaxed">
                                {issue.description}
                              </p>
                            )}
                          </div>

                          {issue.publications.length > 0 && (
                            <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#D9DEE2] space-y-2">
                              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#B09C4B] block">
                                Issue Table of Contents ({issue.publications.length} Articles)
                              </span>
                              <div className="space-y-1.5 pt-1">
                                {issue.publications.map((article, idx) => (
                                  <Link
                                    key={article.id}
                                    href={`/research/${article.slug}`}
                                    className="flex items-start gap-2 text-xs font-sans text-[#081D2E] hover:text-[#0D2C49] transition-colors group/art"
                                  >
                                    <span className="font-mono text-[#0D2C49] text-[11px]">
                                      {formatNumberPad(idx + 1)}.
                                    </span>
                                    <span className="group-hover/art:underline line-clamp-1">
                                      {article.title}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-8 pt-4 border-t border-[#D9DEE2] flex items-center justify-between">
                          <span className="text-xs font-sans text-[#5C6470]">
                            {issue.pdfUrl ? "Full Issue Compiled PDF" : "Editorial Release"}
                          </span>

                          <Link
                            href={`/journals/${journal.slug}?issue=${encodeURIComponent(issue.id)}`}
                            className="px-6 py-2.5 rounded-full bg-[#0D2C49] text-white text-xs font-sans font-semibold hover:bg-[#081D2E] transition-colors flex items-center gap-2"
                          >
                            <span>View Issue</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <Footer onOpenContact={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </main>
  );
}
