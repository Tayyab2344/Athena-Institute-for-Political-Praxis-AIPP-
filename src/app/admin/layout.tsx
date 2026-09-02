import Link from "next/link";
import { ArrowLeft, BookOpen, Layers, Users, FileText, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#1A1817] flex flex-col font-sans">
      <header className="bg-[#4A121A] text-[#FAF8F5] border-b border-[#FAF8F5]/10 px-6 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-full hover:bg-[#FAF8F5]/10 text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition-colors"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-[#FAF8F5]">
                AIPP Admin CMS
              </span>
              <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#A8656C]">
                Research & Journals Management
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/admin/publications"
              className="px-4 py-2 rounded-lg text-xs font-sans font-medium text-[#FAF8F5] hover:bg-[#FAF8F5]/15 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Publications</span>
            </Link>
            <Link
              href="/admin/journals"
              className="px-4 py-2 rounded-lg text-xs font-sans font-medium text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:bg-[#FAF8F5]/15 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Journals</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="ml-4 px-4 py-2 rounded-full border border-[#FAF8F5]/30 text-[#FAF8F5] hover:bg-[#FAF8F5] hover:text-[#4A121A] text-xs font-sans font-semibold transition-all"
            >
              View Public Archive
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">
        {children}
      </main>

      <footer className="bg-[#EFECE6] border-t border-[#4A121A]/10 py-6 text-center text-xs font-sans text-[#5C5755]">
        AIPP Executive Research CMS · Internal Administration System
      </footer>
    </div>
  );
}
