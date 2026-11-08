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
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-white p-5 sm:p-8 rounded-2xl border border-[#0A192F]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0D1B2A] font-normal">
            Institutional Journals &amp; Issues CMS
          </h1>
          <p className="text-xs font-sans text-[#5C6470] font-light mt-1">
            Manage volume releases, issue table of contents, and compiled journal PDFs.
          </p>
        </div>

        <Link
          href="/journals"
          target="_blank"
          className="w-full sm:w-auto text-center px-6 py-3 rounded-full border border-[#0A192F]/20 text-[#0A192F] hover:bg-[#0A192F] hover:text-white text-xs font-sans font-semibold transition-colors shadow-sm"
        >
          View Public Journal Archive
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-sans text-[#5C6470]">Loading journal catalog...</div>
      ) : journals.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#0A192F]/10 space-y-4">
          <BookOpen className="w-10 h-10 text-[#0A192F]/30 mx-auto" />
          <p className="text-sm font-serif text-[#0D1B2A]">No journals configured in database yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {journals.map((journal) => (
            <div key={journal.id} className="bg-white rounded-2xl border border-[#0A192F]/10 p-5 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-[#0A192F]/10 pb-4">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#958772] font-semibold">
                  OFFICIAL INSTITUTIONAL JOURNAL
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-[#0D1B2A] mt-1 font-semibold">
                  {journal.title}
                </h2>
                <p className="text-xs font-sans text-[#5C6470] mt-1 font-light">
                  {journal.description}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif text-base sm:text-lg text-[#0D1B2A] font-medium">
                  Volume &amp; Issue Archive ({journal.issues.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {journal.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-4 sm:p-6 rounded-xl bg-[#F7F6F2] border border-[#0A192F]/10 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-sans">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#0A192F] text-white font-semibold">
                            Volume 0{issue.volume} · Issue 0{issue.issue}
                          </span>
                          <span className="text-[#5C6470] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {issue.publishedAt ? new Date(issue.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recent"}
                          </span>
                        </div>

                        <h4 className="font-serif text-xl text-[#0D1B2A] font-semibold">
                          {issue.title}
                        </h4>

                        <div className="pt-2 text-xs font-sans text-[#5C6470] space-y-1">
                          <span className="font-medium text-[#958772] block">Table of Contents ({issue.publications.length} Articles):</span>
                          {issue.publications.map((p, idx) => (
                            <div key={p.id} className="flex items-start gap-1.5 text-[11px]">
                              <span className="font-mono text-[#0A192F]">0{idx + 1}.</span>
                              <span className="line-clamp-1">{p.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#0A192F]/10 flex items-center justify-between text-xs font-sans">
                        <span className="text-[#5C6470]">
                          {issue.pdfUrl ? "Compiled PDF Attached" : "No PDF attached"}
                        </span>
                        <Link
                          href={`/journals/${journal.slug}`}
                          target="_blank"
                          className="text-[#0A192F] font-semibold hover:underline flex items-center gap-1"
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
