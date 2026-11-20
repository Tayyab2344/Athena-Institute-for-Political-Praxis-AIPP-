"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HeroScrollValues } from "./useHeroScroll";

interface HeroContentProps {
  entered: boolean;
  scroll: HeroScrollValues;
}

export default function HeroContent({ entered, scroll }: HeroContentProps) {
  const isScrolled = scroll.progress > 0;

  return (
    <div className="relative z-10 flex flex-col items-start gap-3.5 sm:gap-4 lg:gap-4.5 max-w-xl">
      {/* Gold accent line */}
      <div
        className="hero-entrance-line h-[2px] w-14 bg-hero-gold"
        data-entered={entered}
        style={{ animationDelay: "80ms" }}
      />

      {/* Eyebrow with pulsing live beacon */}
      <div
        className="hero-entrance-fade hero-eyebrow flex flex-wrap items-center gap-x-2.5 gap-y-1 max-w-full"
        data-entered={entered}
        style={{
          animationDelay: "180ms",
          transform: isScrolled ? `translateY(${scroll.eyebrow.y}px)` : undefined,
          opacity: isScrolled ? scroll.eyebrow.opacity : undefined,
        }}
      >
        <span className="relative flex h-2 w-2 mr-0.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hero-gold opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-hero-gold" />
        </span>
        <span>WOMEN</span>
        <span className="text-hero-gold/60">•</span>
        <span>DIPLOMACY</span>
        <span className="text-hero-gold/60">•</span>
        <span>POLICY</span>
        <span className="text-hero-gold/60">•</span>
        <span>ACTION</span>
      </div>

      {/* Headline — 3 lines revealed sequentially */}
      <h1
        className="hero-headline"
        style={
          isScrolled
            ? {
                transform: `translateY(${scroll.headline.y}px)`,
                opacity: scroll.headline.opacity,
              }
            : undefined
        }
      >
        <span
          className="hero-entrance-clip block"
          data-entered={entered}
          style={{ animationDelay: "260ms" }}
        >
          Women shaping
        </span>
        <span
          className="hero-entrance-clip block"
          data-entered={entered}
          style={{ animationDelay: "380ms" }}
        >
          the <em className="italic font-serif hero-gold-shimmer font-medium">conversations</em>
        </span>
        <span
          className="hero-entrance-clip block"
          data-entered={entered}
          style={{ animationDelay: "500ms" }}
        >
          that shape our world.
        </span>
      </h1>

      {/* Description */}
      <p
        className="hero-entrance-fade hero-body max-w-md text-sm sm:text-[0.9375rem] text-[#64717C] leading-relaxed"
        data-entered={entered}
        style={{ animationDelay: "620ms" }}
      >
        A non-partisan international policy institute elevating women in diplomacy,
        empirical research, strategic crisis simulation, and public statecraft.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center gap-3.5 pt-1">
        <a
          href="#what-we-offer"
          className="hero-entrance-fade group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#0D2C49] px-6 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white shadow-md transition-all duration-300 hover:bg-[#081D2E] hover:shadow-lg hover:-translate-y-0.5"
          data-entered={entered}
          style={{
            animationDelay: "720ms",
            fontFamily: "var(--font-hero-sans)",
          }}
        >
          <span className="relative z-10">Explore What We Offer</span>
          <ArrowUpRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </a>
        <a
          href="#about"
          className="hero-entrance-fade group relative inline-flex items-center gap-2 py-3 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#0D2C49] transition-colors duration-300 hover:text-[#B09C4B]"
          data-entered={entered}
          style={{
            animationDelay: "800ms",
            fontFamily: "var(--font-hero-sans)",
          }}
        >
          <span>About AIPP</span>
          <span className="absolute -bottom-0.5 left-3 right-3 h-px bg-[#B09C4B] scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
        </a>
      </div>

      {/* Institutional Focus Pill */}
      <div
        className="hero-entrance-fade inline-flex items-center gap-2 rounded-full border border-[#D9DEE2] bg-white/80 px-3.5 py-1.5 text-[10px] font-medium tracking-wide text-[#243748] backdrop-blur-xs shadow-xs"
        data-entered={entered}
        style={{ animationDelay: "880ms" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#B09C4B] animate-pulse" />
        <span>Diplomacy · Empirical Research · Strategic Simulation · Public Advocacy</span>
      </div>
    </div>
  );
}
