"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, FileText, Calendar } from "lucide-react";

interface JournalIssue {
  id: string;
  volume: number;
  issue: number;
  title: string;
  pdfUrl?: string;
  publishedAt?: string;
  publications: { id: string; title: string }[];
}

interface Journal {
  id: string;
  title: string;
  slug: string;
  description?: string;
  issues: JournalIssue[];
}

export default function AdminJournalsPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-8">
      <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#4A121A]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#1A1817] font-normal">
            Institutional Journals & Issues CMS
          </h1>
          <p className="text-xs font-sans text-[#5C5755] font-light mt-1">
            Manage volume releases, issue table of contents, and compiled journal PDFs.
          </p>
        </div>

        <Link
          href="/journals"
          target="_blank"
          className="px-6 py-3 rounded-full border border-[#4A121A]/30 text-[#4A121A] hover:bg-[#4A121A] hover:text-[#FAF8F5] text-xs font-sans font-semibold transition-colors shadow-sm"
        >
          View Public Journal Archive
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-sans text-[#5C5755]">Loading journal catalog...</div>
      ) : journals.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF8F5] rounded-2xl border border-[#4A121A]/10 space-y-4">
          <BookOpen className="w-10 h-10 text-[#4A121A]/30 mx-auto" />
          <p className="text-sm font-serif text-[#1A1817]">No journals configured in database yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {journals.map((journal) => (
            <div key={journal.id} className="bg-[#FAF8F5] rounded-2xl border border-[#4A121A]/10 p-8 shadow-sm space-y-6">
              <div className="border-b border-[#4A121A]/10 pb-4">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#4A121A] font-semibold">
                  OFFICIAL INSTITUTIONAL JOURNAL
                </span>
                <h2 className="font-serif text-2xl text-[#1A1817] mt-1 font-semibold">
                  {journal.title}
                </h2>
                <p className="text-xs font-sans text-[#5C5755] mt-1 font-light">
                  {journal.description}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif text-lg text-[#1A1817] font-medium">
                  Volume & Issue Archive ({journal.issues.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {journal.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-6 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-sans">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#4A121A] text-[#FAF8F5] font-semibold">
                            Volume 0{issue.volume} · Issue 0{issue.issue}
                          </span>
                          <span className="text-[#5C5755] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {issue.publishedAt ? new Date(issue.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recent"}
                          </span>
                        </div>

                        <h4 className="font-serif text-xl text-[#1A1817] font-semibold">
                          {issue.title}
                        </h4>

                        <div className="pt-2 text-xs font-sans text-[#5C5755] space-y-1">
                          <span className="font-medium text-[#4A121A] block">Table of Contents ({issue.publications.length} Articles):</span>
                          {issue.publications.map((p, idx) => (
                            <div key={p.id} className="flex items-start gap-1.5 text-[11px]">
                              <span className="font-mono text-[#4A121A]">0{idx + 1}.</span>
                              <span className="line-clamp-1">{p.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#4A121A]/10 flex items-center justify-between text-xs font-sans">
                        <span className="text-[#5C5755]">
                          {issue.pdfUrl ? "Compiled PDF Attached" : "No PDF attached"}
                        </span>
                        <Link
                          href={`/journals/${journal.slug}`}
                          target="_blank"
                          className="text-[#4A121A] font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>Preview Issue</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
