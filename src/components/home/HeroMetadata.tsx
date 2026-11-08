"use client";

import type { HeroScrollValues } from "./useHeroScroll";

interface HeroMetadataProps {
  entered: boolean;
  scroll: HeroScrollValues;
}

export default function HeroMetadata({ entered, scroll }: HeroMetadataProps) {
  const isScrolled = scroll.progress > 0;

  return (
    <div
      className="hero-entrance-fade flex w-full items-center justify-between border-t border-hero-border/80 pt-4 pb-1"
      data-entered={entered}
      style={{
        animationDelay: "950ms",
        transform: isScrolled ? `translateY(${scroll.metadata.y}px)` : undefined,
        opacity: isScrolled ? scroll.metadata.opacity : undefined,
      }}
    >
      {/* Left: Institute designation */}
      <div className="flex items-center gap-2.5 hero-meta text-hero-muted text-[10px] sm:text-[11px]">
        <span className="h-1.5 w-1.5 rounded-full bg-hero-gold" />
        <span className="font-semibold text-hero-navy tracking-wider">ATHENA INSTITUTE FOR POLITICAL PRAXIS</span>
        <span className="hidden md:inline text-hero-muted/50">•</span>
        <span className="hidden md:inline text-hero-muted/80">GLOBAL DIPLOMACY & POLICY PRAXIS</span>
      </div>

      {/* Center: Descriptive thematic line (Not duplicating the 3 numbered stages) */}
      <div className="hidden lg:flex items-center gap-2 hero-meta text-[10px] tracking-[0.16em] text-hero-slate/75">
        <span>INDEPENDENT RESEARCH</span>
        <span className="text-hero-gold/40">•</span>
        <span>STRATEGIC ACTION</span>
        <span className="text-hero-gold/40">•</span>
        <span>PUBLIC ADVOCACY</span>
      </div>

      {/* Right: Smooth scroll prompt to Section 2 (#about) */}
      <a
        href="#about"
        className="group flex items-center gap-2 hero-meta text-[10px] sm:text-[11px] text-hero-muted transition-colors hover:text-hero-navy"
      >
        <span>Discover Our Praxis</span>
        <svg
          className="h-3.5 w-3.5 hero-scroll-indicator text-hero-gold transition-transform group-hover:translate-y-0.5"
          fill="none"
          viewBox="0 0 12 12"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 2v8M3 7l3 3 3-3" />
        </svg>
      </a>
    </div>
  );
}
