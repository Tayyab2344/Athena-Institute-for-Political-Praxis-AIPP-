import Link from "next/link";
import { ArrowLeft, BookOpen, Layers, Users, FileText, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#0D1B2A] flex flex-col font-sans">
      <header className="bg-[#0A192F] text-white border-b border-white/10 px-4 sm:px-6 py-3.5 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Link
                href="/"
                className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Return to Public Website"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                  AIPP Admin CMS
                </span>
                <span className="text-[9px] font-sans uppercase tracking-[0.16em] text-[#D1C4AC]">
                  Research &amp; Journals
                </span>
              </div>
            </div>

            <Link
              href="/"
              target="_blank"
              className="sm:hidden px-3 py-1 rounded-full border border-white/30 text-white hover:bg-white hover:text-[#0A192F] text-[11px] font-sans font-semibold transition-all"
            >
              Public
            </Link>
          </div>

          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            <Link
              href="/admin/publications"
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-sans font-medium text-white hover:bg-white/15 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>Publications</span>
            </Link>
            <Link
              href="/admin/journals"
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-sans font-medium text-white/80 hover:text-white hover:bg-white/15 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>Journals</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex ml-2 sm:ml-4 px-4 py-2 rounded-full border border-white/30 text-white hover:bg-white hover:text-[#0A192F] text-xs font-sans font-semibold transition-all shrink-0"
            >
              View Public Archive
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        {children}
      </main>

      <footer className="bg-white border-t border-[#0A192F]/10 py-6 text-center text-xs font-sans text-[#5C6470]">
        AIPP Executive Research CMS · Internal Administration System
      </footer>
    </div>
  );
}
