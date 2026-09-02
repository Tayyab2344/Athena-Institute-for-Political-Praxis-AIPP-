"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import { BookOpen, ArrowUpRight, Calendar, FileText } from "lucide-react";

interface JournalIssue {
  id: string;
  volume: number;
  issue: number;
  title: string;
  description?: string;
  coverImageUrl?: string;
  pdfUrl?: string;
  publishedAt?: string;
  publications: { id: string; title: string; slug: string; type: string }[];
}

interface Journal {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  issues: JournalIssue[];
}

export default function PublicJournalsArchivePage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    async function loadJournals() {
      try {
        const res = await fetch("/api/journals");
        const data = await res.json();
        if (Array.isArray(data)) setJournals(data);
      } catch (e) {
        console.error("Failed to load journals");
      } finally {
        setLoading(false);
      }
    }
    loadJournals();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1A1817] flex flex-col font-sans">
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      <section className="pt-36 pb-16 bg-[#EFECE6] border-b border-[#4A121A]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#4A121A]">
              AIPP INSTITUTIONAL JOURNAL ARCHIVE
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A1817]">
              Journals & Volumes
            </h1>
            <p className="text-base font-sans text-[#5C5755] font-light leading-relaxed">
              Quarterly academic volumes compiling peer-reviewed research papers, diplomatic commentaries, and policy audits on female statecraft.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#FAF8F5] flex-grow">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          
          {loading ? (
            <div className="py-20 text-center text-xs font-sans text-[#5C5755]">
              Loading AIPP Journal Collection...
            </div>
          ) : journals.length === 0 ? (
            <div className="py-20 text-center bg-[#EFECE6] rounded-3xl border border-[#4A121A]/10 space-y-4">
              <BookOpen className="w-10 h-10 text-[#4A121A]/30 mx-auto" />
              <p className="font-serif text-xl text-[#1A1817]">No journals published in archive yet.</p>
            </div>
          ) : (
            journals.map((journal) => (
              <div key={journal.id} className="space-y-8">
                <div className="border-b border-[#4A121A]/15 pb-4">
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#4A121A]">
                    PEER-REVIEWED JOURNAL SERIES
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1817] font-semibold mt-1">
                    {journal.title}
                  </h2>
                  <p className="text-sm font-sans text-[#5C5755] font-light mt-2 max-w-2xl">
                    {journal.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {journal.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-[#FAF8F5] rounded-3xl border border-[#4A121A]/10 p-8 shadow-sm hover:border-[#4A121A]/30 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="px-3.5 py-1 rounded-full bg-[#4A121A] text-[#FAF8F5] text-[10px] font-sans font-semibold uppercase tracking-wider">
                            Volume 0{issue.volume} · Issue 0{issue.issue}
                          </span>
                          <span className="text-xs font-sans text-[#5C5755] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#4A121A]" />
                            {issue.publishedAt ? new Date(issue.publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Recent"}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-serif text-2xl text-[#1A1817] group-hover:text-[#4A121A] transition-colors leading-tight font-semibold mb-2">
                            {issue.title}
                          </h3>
                          <p className="text-xs font-sans text-[#5C5755] font-light leading-relaxed">
                            {issue.description}
                          </p>
                        </div>

                        {issue.publications.length > 0 && (
                          <div className="p-4 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 space-y-2">
                            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#4A121A] block">
                              Issue Table of Contents ({issue.publications.length} Articles)
                            </span>
                            <div className="space-y-1.5 pt-1">
                              {issue.publications.map((article, idx) => (
                                <Link
                                  key={article.id}
                                  href={`/research/${article.slug}`}
                                  className="flex items-start gap-2 text-xs font-sans text-[#1A1817] hover:text-[#4A121A] transition-colors group/art"
                                >
                                  <span className="font-mono text-[#4A121A] text-[11px]">0{idx + 1}.</span>
                                  <span className="group-hover/art:underline line-clamp-1">{article.title}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-8 pt-4 border-t border-[#4A121A]/10 flex items-center justify-between">
                        <span className="text-xs font-sans text-[#5C5755]">
                          Full Issue Compiled PDF
                        </span>

                        <Link
                          href={`/journals/${journal.slug}`}
                          className="px-6 py-2.5 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold hover:bg-[#6A1B27] transition-colors flex items-center gap-2"
                        >
                          <span>View Issue</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
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
