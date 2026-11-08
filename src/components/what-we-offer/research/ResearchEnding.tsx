"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import Container from "@/components/ui/Container";

interface ResearchEndingProps {
  onOpenContact?: () => void;
}

export default function ResearchEnding({ onOpenContact }: ResearchEndingProps) {
  return (
    <section className="py-24 sm:py-32 bg-[#0D2C49] text-white relative overflow-hidden" aria-label="Research Conclusion">
      {/* Visual composition: Large research document fading into dark navy background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
        <div className="w-[850px] h-[500px] border border-white/40 p-12 bg-white/5 backdrop-blur-sm transform rotate-[-2deg] rounded-sm">
          <div className="border-b border-white/30 pb-4 mb-6 flex justify-between">
            <span className="font-mono text-xs text-white">AIPP DOCTRINAL DISPATCH // FINAL RECORD</span>
            <span className="font-mono text-xs text-[var(--hero-gold)]">CLASSIFIED &rarr; OPEN</span>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-white/20 rounded w-3/4" />
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/15 rounded w-5/6" />
            <div className="h-4 bg-white/10 rounded w-2/3" />
          </div>
        </div>
      </div>

      <Container>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--hero-gold)]/20 border border-[var(--hero-gold)]/40 flex items-center justify-center text-[var(--hero-gold)] mb-6">
            <BookOpen className="h-5 w-5" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-white">
            Turn complex questions into useful knowledge.
          </h2>

          <p className="mt-6 text-sm sm:text-base text-slate-300 font-sans font-light max-w-xl mx-auto leading-relaxed">
            Whether you represent a foreign ministry seeking empirical treaty backing, an academic institute, or an emerging diplomat formulating doctrine, AIPP welcomes institutional collaboration.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--hero-gold)] text-[var(--hero-navy)] text-xs font-semibold uppercase tracking-[0.16em] transition-all hover:bg-white hover:shadow-xl font-sans"
            >
              <span>Explore Research Archive</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-[0.16em] transition-all font-sans"
            >
              <span>Connect With AIPP</span>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
