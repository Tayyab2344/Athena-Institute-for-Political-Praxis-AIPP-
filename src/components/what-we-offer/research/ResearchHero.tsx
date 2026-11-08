"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Bookmark, FileSpreadsheet, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";

export default function ResearchHero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 bg-[#FBFBFA] border-b border-[var(--color-border)] research-grid-bg"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Research and Policy Innovation Hero"
    >
      {/* Delicate background coordinate markings */}
      <div className="absolute top-6 right-10 hidden xl:flex items-center gap-6 font-mono text-[0.625rem] text-slate-400 tracking-widest pointer-events-none">
        <span>ARCHIVE REF: AIPP-2026-RPI</span>
        <span>COORD: 46.2044°N, 6.1432°E [GENEVA]</span>
        <span>SECURITY: CLASSIFIED DRAFT LIFTED</span>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Typography (~45%) */}
          <div className="lg:col-span-5 flex flex-col justify-center z-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[var(--hero-gold)]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hero-gold)]">
                01 / RESEARCH & POLICY INNOVATION
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-normal text-[var(--hero-navy)] leading-[1.08] tracking-tight">
              Research That Moves Policy Forward.
            </h1>

            <p className="mt-5 text-sm sm:text-base leading-relaxed text-[var(--hero-muted)] font-sans font-light max-w-lg">
              AIPP develops empirical research and doctrinal policy perspectives that examine complex multilateral issues, generate rigorous evidence, and equip women diplomats with unassailable authority.
            </p>

            {/* Quick Metadata Bar */}
            <div className="mt-6 pt-6 border-t border-[var(--color-border)] grid grid-cols-3 gap-3 font-mono text-[0.6875rem] text-[var(--hero-navy)]">
              <div>
                <span className="block text-[var(--hero-gold)] font-bold text-xs">100%</span>
                <span className="text-slate-500">Peer-Vetted</span>
              </div>
              <div>
                <span className="block text-[var(--hero-gold)] font-bold text-xs">40+</span>
                <span className="text-slate-500">Conflict Zones</span>
              </div>
              <div>
                <span className="block text-[var(--hero-gold)] font-bold text-xs">UNSCR 1325</span>
                <span className="text-slate-500">Praxis Compliant</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#interactive-document"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--hero-navy)] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-all hover:bg-[var(--hero-gold)] hover:shadow-md"
              >
                <span>Examine Policy Brief</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-[var(--color-border)] text-[var(--hero-navy)] bg-white text-xs font-semibold uppercase tracking-[0.14em] transition-all hover:border-[var(--hero-navy)]"
              >
                <span>Publications Archive</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Layered "Research Desk" Editorial Composition (~55%) */}
          <div className="lg:col-span-7 relative h-[480px] sm:h-[540px] lg:h-[600px] w-full flex items-center justify-center">
            {/* 1. Underlying Researcher Image Base */}
            <div
              className="absolute right-2 sm:right-6 top-6 bottom-6 w-[78%] sm:w-[70%] rounded-sm overflow-hidden border border-[var(--color-border)] shadow-xl transition-transform duration-700 ease-out"
              style={{
                transform: `translate(${mousePos.x * -6}px, ${mousePos.y * -6}px)`,
              }}
            >
              <Image
                src="/ideas-research.jpg"
                alt="Senior woman researcher analyzing foreign policy documents in an institutional library"
                fill
                className="object-cover filter contrast-[1.03] brightness-[0.98]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <span className="font-mono text-[0.625rem] tracking-wider text-[var(--hero-gold)] block uppercase">
                  Dr. Amara Sterling — Lead Policy Fellow
                </span>
                <span className="font-serif text-sm opacity-90">
                  Multilateral Treaty Verification Taskforce
                </span>
              </div>
            </div>

            {/* 2. Physical Layered Policy Paper Brief (Front Left) */}
            <div
              className="absolute left-0 sm:left-4 top-12 sm:top-16 w-[88%] sm:w-[72%] p-6 sm:p-7 paper-layer rounded-sm transition-transform duration-500 ease-out z-20"
              style={{
                transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px) rotate(-1deg)`,
              }}
            >
              {/* Paper Header & Editorial Stamp */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-[var(--hero-gold)]" />
                    <span className="font-mono text-[0.625rem] font-bold text-[var(--hero-navy)] tracking-wider uppercase">
                      AIPP WORKING PAPER NO. 28
                    </span>
                  </div>
                  <span className="font-mono text-[0.5625rem] text-slate-400 block mt-0.5">
                    GENEVA DISPATCH / DIPLOMATIC PRAXIS
                  </span>
                </div>
                <span className="editorial-stamp">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  EMBARGO LIFTED
                </span>
              </div>

              {/* Title on paper */}
              <h3 className="font-serif text-base sm:text-lg text-[var(--hero-navy)] font-semibold leading-snug">
                Gender Representation as a Structural Predictor of Ceasefire Sustainability
              </h3>

              {/* Highlighted text passage */}
              <div className="mt-3.5 text-xs text-slate-700 leading-relaxed font-sans">
                <span>Empirical assessment across 40 post-conflict zones demonstrates that </span>
                <mark className="text-highlight-gold font-medium text-slate-900">
                  direct female signatories increase multilateral treaty longevity by 35%
                </mark>
                <span> over a 15-year observation threshold. </span>
                <sup className="font-mono text-[var(--hero-gold)] font-bold text-[0.625rem] ml-0.5">[1]</sup>
              </div>

              {/* Handwritten-style marginal annotation */}
              <div
                className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs transition-transform duration-500"
                style={{
                  transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
                }}
              >
                <span className="handwritten-annotation text-xs sm:text-sm">
                  * "Cross-reference Annex III (Track-I vs Track-II mediation data)"
                </span>
                <span className="font-mono text-[0.5625rem] text-slate-400">doi:10.1080/aipp.2026.04</span>
              </div>
            </div>

            {/* 3. Small Empirical Data Card (Bottom Right Floating) */}
            <div
              className="absolute right-0 sm:right-2 bottom-4 sm:bottom-8 w-60 sm:w-68 p-4 bg-white/95 backdrop-blur-md border border-[var(--hero-gold)]/40 shadow-xl rounded-sm transition-transform duration-600 ease-out z-30 hidden sm:block"
              style={{
                transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[0.5625rem] font-bold uppercase tracking-widest text-[var(--hero-gold)]">
                  EVIDENTIARY METRICS
                </span>
                <FileSpreadsheet className="h-3.5 w-3.5 text-[var(--hero-navy)]" />
              </div>
              <div className="space-y-1.5 font-sans">
                <div className="flex justify-between text-[0.6875rem]">
                  <span className="text-slate-500">Female Chief Negotiators</span>
                  <span className="font-mono font-bold text-[var(--hero-navy)]">+42% durability</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--hero-gold)] h-full w-[78%]" />
                </div>
                <div className="flex justify-between text-[0.5625rem] text-slate-400 font-mono pt-1">
                  <span>SAMPLE: N=142 TREATIES</span>
                  <span>CONFIDENCE: 95%</span>
                </div>
              </div>
            </div>

            {/* Floating gold citation pin */}
            <div
              className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--hero-gold)]/10 border border-[var(--hero-gold)] flex items-center justify-center text-[var(--hero-gold)] shadow-md z-30 transition-transform duration-700"
              style={{
                transform: `translate(${mousePos.x * 14}px, ${mousePos.y * 14}px)`,
              }}
            >
              <Bookmark className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
