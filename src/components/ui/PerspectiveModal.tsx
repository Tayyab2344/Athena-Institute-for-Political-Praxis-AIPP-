"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Insight } from "@/types";
import { X, Share2, BookOpen, Clock, Calendar, ArrowUpRight, Check } from "lucide-react";
import { useState } from "react";

interface PerspectiveModalProps {
  insight: Insight | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PerspectiveModal({ insight, isOpen, onClose }: PerspectiveModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Close on ESC key & prevent background scrolling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !insight) return null;

  const handleCopyCitation = () => {
    const citation = `${insight.author}. "${insight.title}." AIPP Policy Perspectives (${insight.date}).`;
    navigator.clipboard?.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#081D2E]/75 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="perspective-modal-title"
    >
      <div
        ref={modalRef}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl md:rounded-3xl border border-[#0D2C49]/15 bg-white shadow-2xl"
      >
        {/* Modal Top Header Bar */}
        <div className="flex items-start justify-between border-b border-[#0D2C49]/10 bg-[#FAF9F6] p-4 sm:p-6 md:p-8">
          <div className="space-y-2 sm:space-y-3 pr-4 sm:pr-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-block rounded-full bg-[#0D2C49] px-3 py-0.5 sm:px-3.5 sm:py-1 text-[9px] sm:text-[10px] font-sans font-semibold uppercase tracking-wider text-white">
                {insight.category}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-sans text-[#64717C]">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B09C4B]" />
                <span>{insight.readTime}</span>
              </span>
            </div>
            <h3
              id="perspective-modal-title"
              className="text-xl sm:text-2xl md:text-3xl text-[#081D2E] font-normal leading-snug"
              style={{ fontFamily: "var(--font-hero-serif)" }}
            >
              {insight.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-full p-2 text-[#081D2E] transition-colors hover:bg-[#0D2C49]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-5 sm:space-y-6 flex-grow touch-scroll">
          {/* Author Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 rounded-xl border border-[#0D2C49]/10 bg-[#F4F2EE] p-3.5 sm:p-5">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[#B09C4B] flex-shrink-0">
              <Image
                src={insight.avatar}
                alt={insight.author}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <span
                className="text-sm sm:text-base font-semibold text-[#081D2E] block"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                {insight.author}
              </span>
              <span className="text-xs text-[#64717C] block font-light">
                {insight.role}
              </span>
            </div>
          </div>

          {/* Full Perspective Body Text */}
          <div className="space-y-4 text-xs sm:text-sm text-[#243748] font-light leading-relaxed">
            <p className="font-serif text-base sm:text-lg italic text-[#0D2C49] leading-relaxed border-l-2 border-[#B09C4B] pl-4 my-2">
              &ldquo;{insight.excerpt}&rdquo;
            </p>
            <p>
              When international negotiation frameworks lack substantive female representation at chief mediator levels, diplomatic agreements systematically overlook foundational governance, healthcare, and economic security provisions. The evidence collected across 40 years of bilateral treaties indicates that inclusive negotiating delegations reach durable agreements at a 35% higher rate than non-inclusive bodies.
            </p>
            <p>
              The Athena Institute for Political Praxis engages foreign ministries, multilateral secretariats, and policy research institutes to translate these empirical findings into active institutional protocols. By elevating female envoys and integrating rigorous gender-audited risk models into conflict mediation, modern diplomacy can transition from symbolic quotas to structural transformation.
            </p>
          </div>

          {/* Strategic Implications Box */}
          <div className="space-y-2.5 rounded-xl border border-[#B09C4B]/30 bg-[#FAF8F2] p-4 sm:p-5">
            <span
              className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#B09C4B] block"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              Strategic Implications for Diplomatic Praxis
            </span>
            <ul className="text-xs text-[#64717C] space-y-2 list-disc list-inside font-light">
              <li>Institutionalization of gender-equitable negotiating mandates in bilateral crisis talks.</li>
              <li>Empirical tracking of post-treaty civic outcomes and humanitarian compliance indicators.</li>
              <li>Direct fellowship pathways connecting academic researchers with foreign ministry taskforces.</li>
            </ul>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-t border-[#0D2C49]/10 bg-[#FAF9F6] p-4 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-[#64717C]">
            <BookOpen className="h-4 w-4 text-[#B09C4B] flex-shrink-0" />
            <span className="truncate">AIPP Policy Perspectives Series</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleCopyCitation}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 rounded-full border border-[#0D2C49]/20 px-4 py-2.5 text-xs font-medium text-[#0D2C49] transition-colors hover:bg-[#0D2C49]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Citation Copied" : "Cite Perspective"}</span>
            </button>

            <Link
              href="/research"
              onClick={onClose}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 rounded-full bg-[#0D2C49] px-5 sm:px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#081D2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
            >
              <span>Explore Research</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
