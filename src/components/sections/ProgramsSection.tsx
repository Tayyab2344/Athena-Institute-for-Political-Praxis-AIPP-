"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Calendar, Users } from "lucide-react";
import { PROGRAMS_DATA } from "@/data/mockData";

/* ─────────────────────────────────────────────────────────────
   Section 5 — "Programs & Initiatives"
   Cinematic 50/50 editorial split.
   Left:  Immersive image stage with crossfade transitions.
   Right: Vertical initiative navigator + editorial copy.
   ───────────────────────────────────────────────────────────── */

const AUTOPLAY_DELAY = 6000; // ms between auto-advances

export default function ProgramsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const programs = PROGRAMS_DATA;
  const total = programs.length;
  const active = programs[activeIdx];

  /* ── Detect prefers-reduced-motion ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── IntersectionObserver for entrance animation ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Crossfade transition helper ── */
  const switchTo = useCallback(
    (idx: number) => {
      if (idx === activeIdx || isTransitioning) return;
      if (prefersReducedMotion) {
        setActiveIdx(idx);
        return;
      }
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIdx(idx);
        setIsTransitioning(false);
      }, 320);
    },
    [activeIdx, isTransitioning, prefersReducedMotion]
  );

  /* ── Autoplay ── */
  useEffect(() => {
    if (prefersReducedMotion || isHovered) return;
    timerRef.current = setTimeout(() => {
      switchTo((activeIdx + 1) % total);
    }, AUTOPLAY_DELAY);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIdx, isHovered, prefersReducedMotion, switchTo, total]);

  return (
    <section
      id="programs"
      ref={sectionRef}
      className="relative w-full bg-[#F4F2EE] scroll-mt-24 overflow-hidden"
      aria-label="Programs & Initiatives"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ═══ Architectural top divider — visual bridge from Research section ═══ */}
      <div className="absolute inset-x-0 top-0 z-30 pointer-events-none">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#B09C4B]/60 to-transparent" />
      </div>

      {/* ═══ Section badge — floats above the split ═══ */}
      <div className="relative z-20 pt-5 pb-0 px-6 sm:px-10 lg:px-14">
        <div className="flex items-center gap-2.5">
          <span className="h-[1.5px] w-8 bg-[#B09C4B] flex-shrink-0" />
          <span
            className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#B09C4B]"
            style={{ fontFamily: "var(--font-hero-sans)" }}
          >
            05 / Programs & Initiatives
          </span>
        </div>
      </div>

      {/* ═══ Main two-column stage ═══ */}
      <div
        className={`
          relative z-10 flex flex-col lg:flex-row
          transition-all duration-[900ms] ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >

        {/* ─────────────────────────────────────────────────
            LEFT HALF — Cinematic Image Stage
            ───────────────────────────────────────────────── */}
        <div
          className="
            relative w-full lg:w-1/2
            aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto min-h-[260px] sm:min-h-[320px] lg:min-h-[640px] xl:min-h-[700px]
            flex-shrink-0 overflow-hidden
            mt-6 lg:mt-0
          "
          aria-hidden="true"
        >
          {/* Image crossfade layer */}
          {programs.map((prog, idx) => (
            <div
              key={prog.id}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{
                opacity: idx === activeIdx ? (isTransitioning ? 0 : 1) : 0,
                zIndex: idx === activeIdx ? 2 : 1,
              }}
            >
              <Image
                src={prog.image}
                alt={prog.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`
                  object-cover object-center
                  transition-transform duration-[8000ms] ease-linear
                  ${idx === activeIdx && !prefersReducedMotion ? "scale-[1.04]" : "scale-100"}
                `}
                priority={idx === 0}
              />
            </div>
          ))}

          {/* Atmospheric gradient overlays */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(8,29,46,0.85) 0%, rgba(8,29,46,0.30) 45%, rgba(8,29,46,0.05) 75%, transparent 100%)",
            }}
          />
          {/* Right-edge fade for desktop blend */}
          <div
            className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none hidden lg:block"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, rgba(244,242,238,0.18) 100%)",
            }}
          />

          {/* Atmospheric gradient overlays */}

          {/* ── Bottom info bar: index + location ── */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-5 sm:p-7 flex items-end justify-between">
            {/* Location */}
            <div className="flex items-center gap-1.5">
              <MapPin
                className="w-3 h-3 text-[#B09C4B] flex-shrink-0"
                aria-hidden="true"
              />
              <span
                className="text-[0.6875rem] font-medium text-white/80 leading-none"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                {active?.location}
              </span>
            </div>

            {/* Animated index indicator */}
            <div className="flex items-center gap-2">
              {/* Progress dots */}
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Program index">
                {programs.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === activeIdx}
                    aria-label={`Program ${i + 1}`}
                    onClick={() => switchTo(i)}
                    className={`
                      rounded-full transition-all duration-500 focus:outline-none
                      focus-visible:ring-1 focus-visible:ring-[#B09C4B] focus-visible:ring-offset-1
                      ${i === activeIdx
                        ? "w-6 h-1.5 bg-[#B09C4B]"
                        : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                      }
                    `}
                  />
                ))}
              </div>
              {/* Numeric counter */}
              <span
                className="text-xs font-semibold text-white/60 tabular-nums ml-1"
                style={{ fontFamily: "var(--font-hero-sans)" }}
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="text-white/90">
                  {String(activeIdx + 1).padStart(2, "0")}
                </span>
                <span className="mx-0.5">/</span>
                {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* ── Restrained gold corner accent ── */}
          <div
            className="absolute top-0 right-0 z-10 pointer-events-none hidden lg:block"
            aria-hidden="true"
          >
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M64 0 L64 64 L32 64" stroke="rgba(176,156,75,0.25)" strokeWidth="1" fill="none" />
              <path d="M64 0 L64 32" stroke="rgba(176,156,75,0.4)" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────
            RIGHT HALF — Editorial Initiative Navigator
            ───────────────────────────────────────────────── */}
        <div
          className={`
            relative w-full lg:w-1/2 flex flex-col justify-center
            px-4 sm:px-10 lg:px-14 xl:px-16
            py-10 sm:py-14 lg:py-16
            bg-[#F4F2EE]
            transition-all duration-[1000ms] ease-out delay-150
            ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}
          `}
        >
          {/* Editorial header */}
          <div className="mb-8 sm:mb-10">
            <h2
              className="text-[2.4rem] sm:text-[3rem] md:text-[3.25rem] lg:text-[2.75rem] xl:text-[3.4rem]
                font-normal leading-[1.06] tracking-[-0.02em] text-[#0D2C49] mb-4"
              style={{ fontFamily: "var(--font-hero-serif)" }}
            >
              Turning purpose into{" "}
              <em className="not-italic text-[#B09C4B] font-medium">participation.</em>
            </h2>

            <p
              className="text-sm sm:text-[0.9375rem] text-[#64717C] leading-relaxed font-light max-w-[40ch]"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              Explore how AIPP connects ideas, people, and action to advance
              women&apos;s participation in diplomacy, policy, and public life.
            </p>

            {/* Hairline divider */}
            <div className="mt-7 w-full h-px bg-gradient-to-r from-[#B09C4B]/40 via-[#0D2C49]/10 to-transparent" />
          </div>

          {/* ── Vertical Initiative Navigator ── */}
          <nav aria-label="Programs navigator" className="flex flex-col gap-0 mb-10">
            {programs.map((prog, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={prog.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => switchTo(idx)}
                  className={`
                    group relative text-left w-full
                    pl-5 pr-4 py-5
                    border-b border-[#0D2C49]/08
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B] focus-visible:ring-inset
                    transition-all duration-300
                    ${isActive ? "bg-white/60" : "hover:bg-white/40"}
                  `}
                >
                  {/* Active gold left border — animated height */}
                  <span
                    className={`
                      absolute left-0 top-0 bottom-0 w-[3px] rounded-full
                      transition-all duration-500 ease-out
                      ${isActive ? "bg-[#B09C4B] opacity-100" : "bg-transparent opacity-0"}
                    `}
                    aria-hidden="true"
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Row 1: index + category */}
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span
                          className={`
                            text-[0.6875rem] font-bold tabular-nums transition-colors duration-300
                            ${isActive ? "text-[#B09C4B]" : "text-[#64717C]/60"}
                          `}
                          style={{ fontFamily: "var(--font-hero-sans)" }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`
                            text-[0.5625rem] font-semibold uppercase tracking-[0.18em]
                            transition-colors duration-300
                            ${isActive ? "text-[#B09C4B]" : "text-[#64717C]/50"}
                          `}
                          style={{ fontFamily: "var(--font-hero-sans)" }}
                        >
                          {prog.category}
                        </span>
                      </div>

                      {/* Row 2: Program title */}
                      <h3
                        className={`
                          text-base sm:text-lg font-normal leading-snug transition-colors duration-300
                          ${isActive ? "text-[#0D2C49] font-medium" : "text-[#0D2C49]/65 group-hover:text-[#0D2C49]/85"}
                        `}
                        style={{ fontFamily: "var(--font-hero-serif)" }}
                      >
                        {prog.title}
                      </h3>

                      {/* Row 3: Supporting sentence */}
                      <p
                        className={`
                          text-[0.8125rem] leading-relaxed mt-1 transition-all duration-300
                          ${isActive ? "text-[#64717C] max-h-20 opacity-100" : "text-[#64717C]/0 max-h-0 overflow-hidden opacity-0 group-hover:text-[#64717C]/70 group-hover:max-h-20 group-hover:opacity-70"}
                        `}
                        style={{ fontFamily: "var(--font-hero-sans)" }}
                      >
                        {prog.subtitle}
                      </p>

                      {/* Row 4: Date chip — active only */}
                      <div
                        className={`
                          flex flex-wrap items-center gap-x-2 gap-y-1 mt-2
                          transition-all duration-300
                          ${isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"}
                        `}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#B09C4B] flex-shrink-0" aria-hidden="true" />
                          <span
                            className="text-[0.6875rem] text-[#64748B] font-medium"
                            style={{ fontFamily: "var(--font-hero-sans)" }}
                          >
                            {prog.dates}
                          </span>
                        </span>
                        <span className="text-[#0D2C49]/20 hidden sm:inline">·</span>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-[#B09C4B] flex-shrink-0" aria-hidden="true" />
                          <span
                            className="text-[0.6875rem] text-[#64748B] font-medium"
                            style={{ fontFamily: "var(--font-hero-sans)" }}
                          >
                            {prog.participants}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Arrow icon — revealed on hover/active */}
                    <span
                      className={`
                        flex-shrink-0 w-7 h-7 flex items-center justify-center
                        rounded-full border transition-all duration-300 mt-0.5
                        ${isActive
                          ? "border-[#B09C4B] text-[#B09C4B] bg-[#B09C4B]/08 opacity-100 translate-x-0"
                          : "border-transparent text-transparent opacity-0 translate-x-2 group-hover:border-[#0D2C49]/20 group-hover:text-[#0D2C49]/50 group-hover:opacity-100 group-hover:translate-x-0"
                        }
                      `}
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* ── CTA ── */}
          <div
            className={`
              transition-all duration-[1100ms] ease-out delay-300
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <Link
              href="/#programs"
              className="
                group inline-flex w-full sm:w-auto items-center justify-center gap-3
                px-6 py-3.5 rounded-full
                bg-[#0D2C49] text-white
                text-[0.6875rem] font-bold uppercase tracking-[0.16em]
                hover:bg-[#B09C4B] transition-all duration-300 shadow-sm
                hover:shadow-[0_8px_24px_rgba(176,156,75,0.25)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B] focus-visible:ring-offset-2
              "
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              <span>Explore All Programs</span>
              <ArrowUpRight
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ Bottom section divider ═══ */}
      <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#0D2C49]/12 to-transparent" />
      </div>
    </section>
  );
}
