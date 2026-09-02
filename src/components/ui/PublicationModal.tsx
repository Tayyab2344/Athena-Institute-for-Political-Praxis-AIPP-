"use client";

import { Publication } from "@/types";
import { X, Download, FileText, Share2, BookOpen } from "lucide-react";

interface PublicationModalProps {
  publication: Publication | null;
  onClose: () => void;
}

export default function PublicationModal({ publication, onClose }: PublicationModalProps) {
  if (!publication) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1817]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#4A121A]/20 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
        
        <div className="p-6 md:p-8 bg-[#EFECE6] border-b border-[#4A121A]/10 flex items-start justify-between">
          <div className="space-y-2 pr-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[#4A121A] text-[#FAF8F5] text-[10px] font-sans uppercase tracking-widest font-semibold">
              {publication.category}
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-[#1A1817] leading-tight">
              {publication.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#4A121A]/10 text-[#1A1817] transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 rounded-xl bg-[#FAF8F5] border border-[#4A121A]/10 text-xs font-sans text-[#5C5755]">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#4A121A] font-semibold">Author</span>
              <span className="font-medium text-[#1A1817] block mt-0.5">{publication.author}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#4A121A] font-semibold">Publication Date</span>
              <span className="font-medium text-[#1A1817] block mt-0.5">{publication.date}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#4A121A] font-semibold">Specification</span>
              <span className="font-medium text-[#1A1817] block mt-0.5">{publication.pages} Pages · Peer Reviewed</span>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg text-[#1A1817] mb-2 font-semibold">Executive Abstract</h4>
            <p className="text-sm font-sans text-[#5C5755] leading-relaxed font-light">
              {publication.excerpt}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 space-y-3">
            <h5 className="font-serif text-sm font-semibold text-[#4A121A]">Methodology & Citation Notice</h5>
            <p className="text-xs font-sans text-[#5C5755] leading-relaxed">
              This publication is archived under AIPP Open Policy Initiative. DOI: <span className="font-mono">{publication.doi || "10.1080/aipp.2026"}</span>.
            </p>
          </div>
        </div>

        <div className="p-6 bg-[#EFECE6] border-t border-[#4A121A]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-sans text-[#5C5755]">
            <BookOpen className="w-4 h-4 text-[#4A121A]" />
            <span>AIPP Digital Archive</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Citation copied to clipboard.")}
              className="px-4 py-2.5 rounded-full border border-[#4A121A]/20 text-[#4A121A] text-xs font-sans font-medium hover:bg-[#4A121A]/5 transition-colors flex items-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Cite Paper</span>
            </button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`Downloading PDF for: ${publication.title}`);
              }}
              className="px-6 py-2.5 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold hover:bg-[#6A1B27] transition-colors flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
