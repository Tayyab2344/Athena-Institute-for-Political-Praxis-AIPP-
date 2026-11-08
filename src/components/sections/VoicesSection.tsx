"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock, Sparkles } from "lucide-react";
import { INSIGHTS_DATA } from "@/data/mockData";
import { Insight } from "@/types";
import PerspectiveModal from "@/components/ui/PerspectiveModal";

/* ─────────────────────────────────────────────────────────────
   Section 6 — "Voices & Perspectives"
   A World Shaped by Women's Voices.
   50/50 Editorial Composition:
   - Left:  Perspective Feature + Signature Perspective Shift Selector
   - Right: Editorial Portrait Stage with gold accents & atmospheric overlay
   ───────────────────────────────────────────────────────────── */

const AUTOPLAY_DURATION = 6500; // ms per perspective

export default function VoicesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [selectedInsightForModal, setSelectedInsightForModal] = useState<Insight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const perspectives = INSIGHTS_DATA;
  const total = perspectives.length;
  const active = perspectives[activeIdx] || perspectives[0];

  /* ── Check for prefers-reduced-motion ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── IntersectionObserver for entrance reveal ── */
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

  /* ── Switch perspective with subtle crossfade ── */
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
      }, 300);
    },
    [activeIdx, isTransitioning, prefersReducedMotion]
  );

  /* ── Autoplay timer with pause on hover ── */
  useEffect(() => {
    if (prefersReducedMotion || isHovered || isModalOpen) return;
    timerRef.current = setTimeout(() => {
      switchTo((activeIdx + 1) % total);
    }, AUTOPLAY_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIdx, isHovered, isModalOpen, prefersReducedMotion, switchTo, total]);

  const handleOpenModal = (item: Insight) => {
    setSelectedInsightForModal(item);
    setIsModalOpen(true);
  };

  return (
    <section
      id="perspectives"
      ref={sectionRef}
      className="relative w-full bg-[#FAF9F6] text-[#081D2E] scroll-mt-20 overflow-hidden border-t border-[#E5E0D8]"
      aria-label="Voices & Perspectives"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
    >
      {/* Compatibility anchor for navigation links targeting #insights */}
      <span id="insights" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />

      {/* ═══ Top Editorial Accent Hairline ═══ */}
      <div className="absolute inset-x-0 top-0 z-30 pointer-events-none">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#B09C4B]/50 to-transparent" />
      </div>

      {/* ═══ Section Eyebrow Bar ═══ */}
      <div className="relative z-20 pt-8 pb-4 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#B09C4B] flex-shrink-0" />
            <span
              className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-[#B09C4B]"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              06 / Voices &amp; Perspectives
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#64717C] font-light">
            <Sparkles className="w-3.5 h-3.5 text-[#B09C4B]" />
            <span style={{ fontFamily: "var(--font-hero-sans)" }}>A World Shaped by Women&apos;s Voices</span>
          </div>
        </div>
      </div>

      {/* ═══ Main 50/50 Two-Column Stage ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 pb-20 md:pb-28">
        <div
          className={`
            grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch
            transition-all duration-[900ms] ease-out
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN (~50%): Perspective Feature & Selector
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col justify-between pt-2 lg:pt-0">
            {/* Top Editorial Narrative Block */}
            <div className="space-y-6">
              <div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#081D2E] leading-[1.12] tracking-tight"
                  style={{ fontFamily: "var(--font-hero-serif)" }}
                >
                  Different voices.{" "}
                  <span className="italic text-[#B09C4B] font-serif">Shared possibilities.</span>
                </h2>
                <p
                  className="mt-4 text-sm sm:text-base text-[#64717C] font-light leading-relaxed max-w-xl"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  Discover the ideas, experiences, and perspectives shaping conversations around women,
                  diplomacy, policy, and public life.
                </p>
              </div>

              {/* Active Perspective Showcase Card */}
              <div
                className={`
                  p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#0D2C49]/10
                  shadow-[0_10px_35px_rgba(13,44,73,0.06)] space-y-4 sm:space-y-5
                  transition-all duration-300
                  ${isTransitioning ? "opacity-40 translate-y-1" : "opacity-100 translate-y-0"}
                `}
              >
                {/* Meta row: Category pill & Read time */}
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#B09C4B]/40 text-[#0D2C49] text-[10px] font-bold uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B09C4B]" />
                    {active.category}
                  </span>

                  <div className="flex items-center gap-3 text-xs text-[#64717C] font-light">
                    <span>{active.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#B09C4B]" />
                      {active.readTime}
                    </span>
                  </div>
                </div>

                {/* Perspective Title */}
                <h3
                  className="text-xl sm:text-2xl text-[#081D2E] font-normal leading-snug hover:text-[#0D2C49] transition-colors"
                  style={{ fontFamily: "var(--font-hero-serif)" }}
                >
                  &ldquo;{active.title}&rdquo;
                </h3>

                {/* Excerpt */}
                <p
                  className="text-xs sm:text-sm text-[#64717C] font-light leading-relaxed line-clamp-3"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  {active.excerpt}
                </p>

                {/* Author attribution & Reading CTA */}
                <div className="pt-4 border-t border-[#0D2C49]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#B09C4B] flex-shrink-0">
                      <Image
                        src={active.avatar}
                        alt={active.author}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span
                        className="block text-xs font-semibold text-[#081D2E]"
                        style={{ fontFamily: "var(--font-hero-sans)" }}
                      >
                        {active.author}
                      </span>
                      <span className="block text-[11px] text-[#64717C] font-light line-clamp-1">
                        {active.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenModal(active)}
                    className="group inline-flex w-full sm:w-auto items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#0D2C49] text-white hover:bg-[#081D2E] text-xs font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                    aria-label={`Read full perspective by ${active.author}`}
                  >
                    <span>Read Full Perspective</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                SIGNATURE INTERACTION: The Perspective Shift Selector
                Refined editorial selector with animated gold progress timer
                ───────────────────────────────────────────────────────────── */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64717C]"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  Select Perspective
                </span>
                <span className="text-[10px] text-[#64717C] font-light">
                  {isHovered ? "Autoplay paused" : "Auto-advancing"}
                </span>
              </div>

              <div
                role="tablist"
                aria-label="Available Perspectives"
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                {perspectives.map((p, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={p.id}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`perspective-panel-${idx}`}
                      onClick={() => switchTo(idx)}
                      className={`
                        relative text-left p-3.5 rounded-xl border transition-all duration-300
                        overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B]
                        ${
                          isActive
                            ? "bg-white border-[#B09C4B]/60 shadow-sm"
                            : "bg-white/60 hover:bg-white border-[#0D2C49]/10 text-[#64717C]"
                        }
                      `}
                    >
                      {/* Animated Gold Progress Line on Active Tab */}
                      {isActive && (
                        <div className="absolute inset-x-0 bottom-0 h-[2.5px] bg-[#B09C4B]/20 overflow-hidden">
                          <div
                            key={`progress-${activeIdx}-${isHovered}`}
                            className={`h-full bg-[#B09C4B] ${
                              !prefersReducedMotion && !isHovered
                                ? "animate-perspective-progress"
                                : "w-full"
                            }`}
                            style={{
                              animationDuration: `${AUTOPLAY_DURATION}ms`,
                              animationTimingFunction: "linear",
                            }}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-mono font-semibold ${
                            isActive ? "text-[#B09C4B]" : "text-[#64717C]/70"
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <span
                          className="text-[9px] uppercase tracking-wider font-semibold text-[#64717C]/80 line-clamp-1"
                          style={{ fontFamily: "var(--font-hero-sans)" }}
                        >
                          {p.category}
                        </span>
                      </div>

                      <span
                        className={`block text-xs leading-snug line-clamp-2 transition-colors ${
                          isActive
                            ? "font-serif text-[#081D2E] font-medium"
                            : "font-sans text-[#64717C] font-light hover:text-[#081D2E]"
                        }`}
                      >
                        {p.author}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Section Bottom CTA */}
              <div className="pt-4 flex items-center justify-between">
                <Link
                  href="/research"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#0D2C49]/20 text-[#0D2C49] hover:bg-[#0D2C49] hover:text-white text-xs font-semibold tracking-wider transition-all duration-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  <span>Explore All Perspectives ↗</span>
                </Link>

                <div className="hidden sm:flex items-center gap-2 text-xs text-[#64717C]">
                  <BookOpen className="w-3.5 h-3.5 text-[#B09C4B]" />
                  <span>AIPP Editorial Journal</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN (~50%): Editorial Portrait Stage
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 relative flex flex-col">
            <div
              className="
                relative w-full flex-grow
                min-h-[320px] sm:min-h-[500px] lg:min-h-[640px]
                rounded-2xl sm:rounded-3xl overflow-hidden
                shadow-[0_20px_60px_rgba(13,44,73,0.12)]
                border border-[#0D2C49]/10 bg-[#081D2E]
              "
            >
              {/* Restrained Gold Corner Frame Accents */}
              <div className="absolute top-5 left-5 z-20 pointer-events-none">
                <div className="w-8 h-8 border-t-2 border-l-2 border-[#B09C4B]/80" />
              </div>
              <div className="absolute top-5 right-5 z-20 pointer-events-none">
                <div className="w-8 h-8 border-t-2 border-r-2 border-[#B09C4B]/80" />
              </div>

              {/* Crossfading Editorial Portraits (All strictly featuring women scholars & leaders) */}
              {perspectives.map((item, idx) => (
                <div
                  key={item.id}
                  className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                  style={{
                    opacity: idx === activeIdx ? (isTransitioning ? 0.3 : 1) : 0,
                    zIndex: idx === activeIdx ? 2 : 1,
                  }}
                  aria-hidden={idx !== activeIdx}
                >
                  <Image
                    src={item.image}
                    alt={`${item.author} — ${item.role}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`
                      object-cover object-center
                      transition-transform duration-[8000ms] ease-out
                      ${idx === activeIdx && !prefersReducedMotion ? "scale-[1.04]" : "scale-100"}
                    `}
                    priority={idx === 0}
                  />
                </div>
              ))}

              {/* Atmospheric Navy Gradient Overlay */}
              <div
                className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#081D2E] via-[#0D2C49]/40 to-transparent"
                style={{ mixBlendMode: "multiply" }}
              />
              <div
                className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#081D2E]/95 via-transparent to-black/20"
              />

              {/* Bottom In-Image Contributor Spotlight Card */}
              <div className="absolute bottom-0 inset-x-0 z-20 p-6 sm:p-8 flex items-end justify-between gap-4">
                <div className="space-y-1.5 max-w-[80%]">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B09C4B] block"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    Featured Contributor
                  </span>
                  <h4
                    className="text-2xl sm:text-3xl text-white font-normal leading-tight"
                    style={{ fontFamily: "var(--font-hero-serif)" }}
                  >
                    {active.author}
                  </h4>
                  <p
                    className="text-xs sm:text-sm text-white/80 font-light line-clamp-1"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    {active.role}
                  </p>
                </div>

                {/* Index Counter */}
                <div
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  <span className="text-[#B09C4B] font-semibold">0{activeIdx + 1}</span>
                  <span className="text-white/40">/</span>
                  <span className="text-white/70">0{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Editorial Perspective Reader Modal */}
      <PerspectiveModal
        insight={selectedInsightForModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
