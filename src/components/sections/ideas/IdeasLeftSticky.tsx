"use client";

import Image from "next/image";
import { IDEAS_STAGES } from "./ideasData";
import type { IdeasScrollState } from "./useIdeasScroll";

interface IdeasLeftStickyProps {
  scrollState: IdeasScrollState;
}

export default function IdeasLeftSticky({ scrollState }: IdeasLeftStickyProps) {
  const { activeIndex, imageParallax } = scrollState;
  const activeStage = IDEAS_STAGES[activeIndex] || IDEAS_STAGES[0];

  return (
    <div className="relative flex flex-col justify-between h-full py-2 lg:py-4 pr-0 lg:pr-8 xl:pr-12">
      {/* Top group: Eyebrow + Heading + Copy + Dynamic Statement */}
      <div className="flex flex-col items-start gap-3.5 sm:gap-4">
        {/* Eyebrow: ──────── ABOUT AIPP */}
        <div className="flex items-center gap-3">
          <span className="h-[2px] w-12 bg-hero-gold origin-left transition-all duration-700" />
          <span
            className="text-xs sm:text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-hero-gold"
            style={{ fontFamily: "var(--font-hero-sans)" }}
          >
            About AIPP
          </span>
        </div>

        {/* Main Heading: From ideas to influence. */}
        <h2
          className="text-3xl sm:text-4xl lg:text-[2.85rem] xl:text-[3.45rem] leading-[1.04] font-normal text-white tracking-[-0.015em]"
          style={{ fontFamily: "var(--font-hero-serif)" }}
        >
          From ideas <br />
          <span className="italic font-medium text-white/95">to influence.</span>
        </h2>

        {/* Introduction Copy */}
        <p
          className="text-xs sm:text-sm text-[#C3CDD5] leading-relaxed max-w-md"
          style={{ fontFamily: "var(--font-hero-sans)" }}
        >
          AIPP advances women&apos;s participation in diplomacy, policy and public
          action by connecting research, strategic engagement and public advocacy.
        </p>

        {/* Dynamic Supporting Statement that transitions smoothly */}
        <div className="relative h-7 w-full overflow-hidden border-l-2 border-hero-gold pl-3.5 mt-0.5">
          {IDEAS_STAGES.map((stage, idx) => (
            <div
              key={stage.number}
              className={`absolute inset-0 flex items-center transition-all duration-500 ease-out ${
                activeIndex === idx
                  ? "opacity-100 translate-y-0"
                  : idx < activeIndex
                  ? "opacity-0 -translate-y-2 pointer-events-none"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              <span
                className="text-xs sm:text-[0.8125rem] font-bold tracking-[0.16em] uppercase text-hero-gold"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                {stage.dynamicStatement}
              </span>
            </div>
          ))}
        </div>

        {/* Editorial Progress Indicator: 01 ━━━━━━━ RESEARCH */}
        <div className="flex flex-col gap-2.5 w-full max-w-xs pt-1">
          {IDEAS_STAGES.map((stage, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={stage.number}
                className="flex items-center gap-3 transition-opacity duration-300"
                style={{ opacity: isActive ? 1 : 0.45 }}
              >
                <span
                  className={`text-xs font-semibold ${
                    isActive ? "text-hero-gold" : "text-[#8C9BA8]"
                  }`}
                  style={{ fontFamily: "var(--font-hero-serif)" }}
                >
                  {stage.number}
                </span>

                {/* Animated Gold Bar for Active State */}
                <div className="relative h-[2px] w-14 bg-[#243748] overflow-hidden rounded-full">
                  <div
                    className={`absolute inset-y-0 left-0 bg-hero-gold transition-all duration-500 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </div>

                <span
                  className={`text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-semibold transition-colors duration-300 ${
                    isActive ? "text-white font-bold" : "text-[#8C9BA8]"
                  }`}
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  {stage.stageName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom group: Prominent Women-Only Editorial Image Frame (Desktop only, synchronized with active scroll card) */}
      <div className="relative mt-5 w-full max-w-[360px] xl:max-w-[400px] hidden lg:block">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs border border-[#243748] bg-[#0D2C49] shadow-2xl">
          {IDEAS_STAGES.map((stage, idx) => (
            <div
              key={stage.number}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                activeIndex === idx
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-95 z-0 pointer-events-none"
              }`}
              style={{
                transform: `translateY(${imageParallax.y}px) scale(${imageParallax.scale})`,
                transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.1s linear",
              }}
            >
              <Image
                src={stage.image}
                alt={stage.imageAlt}
                fill
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover object-[center_28%] brightness-[0.92] contrast-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E]/90 via-[#081D2E]/25 to-transparent" />
            </div>
          ))}

          {/* Institutional Corner Tag */}
          <div className="absolute bottom-2.5 left-3 right-3 z-20 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hero-gold opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-hero-gold" />
              </span>
              <span
                className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/90"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                Phase {activeStage.number} • {activeStage.pillText}
              </span>
            </div>
            <span
              className="text-[8px] uppercase tracking-[0.12em] text-[#8C9BA8]"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              Leadership Praxis
            </span>
          </div>
        </div>

        {/* Minimal Gold Accent Corner */}
        <div className="pointer-events-none absolute -bottom-px -left-px h-14 w-px bg-hero-gold" />
        <div className="pointer-events-none absolute -bottom-px -left-px h-px w-14 bg-hero-gold" />
      </div>
    </div>
  );
}
