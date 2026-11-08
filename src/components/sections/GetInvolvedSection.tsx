"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Section 7 — "Get Involved"
   Creative Concept: "Your Voice Belongs in the Room"
   50/50 Immersive Invitation:
   - Left:  Cinematic Visual Stage with gold accents & "A Place for Your Perspective"
   - Right: Editorial Narrative + 3 Compact Participation Rows (Contribute, Volunteer, Collaborate)
   ───────────────────────────────────────────────────────────── */

interface GetInvolvedSectionProps {
  onOpenContact: (pathway?: string) => void;
}

const PARTICIPATION_PATHWAYS = [
  {
    number: "01",
    title: "Contribute",
    subtitle: "Share your research, ideas, and expertise.",
    detail: "Publish policy commentary, submit empirical research, or contribute to AIPP peer-reviewed working briefs.",
    pathwayKey: "Contribute",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1400",
    imageCaption: "Scholars and analysts synthesizing bilateral policy drafts"
  },
  {
    number: "02",
    title: "Volunteer",
    subtitle: "Bring your skills to meaningful initiatives.",
    detail: "Support international summit logistics, student diplomatic simulation labs, and civic leadership fellowships.",
    pathwayKey: "Volunteer",
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=1400",
    imageCaption: "Fellows and delegation organizers coordinating assembly sessions"
  },
  {
    number: "03",
    title: "Collaborate",
    subtitle: "Explore opportunities to work with AIPP.",
    detail: "Partner with ministries, academic departments, and foreign policy taskforces on joint institutional praxis.",
    pathwayKey: "Collaborate",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1400",
    imageCaption: "Senior diplomatic practitioners in high-level consultation"
  }
];

export default function GetInvolvedSection({ onOpenContact }: GetInvolvedSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const activePathway = PARTICIPATION_PATHWAYS[activeIdx];

  /* Detect prefers-reduced-motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* IntersectionObserver for smooth entrance */
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleRowHover = (idx: number) => {
    if (idx === activeIdx || isTransitioning) return;
    if (prefersReducedMotion) {
      setActiveIdx(idx);
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setIsTransitioning(false);
    }, 250);
  };

  return (
    <section
      id="get-involved"
      ref={sectionRef}
      className="relative w-full bg-white text-[#081D2E] scroll-mt-20 overflow-hidden border-t border-[#E5E0D8]"
      aria-label="Get Involved"
    >
      {/* ═══ Section Eyebrow Header ═══ */}
      <div className="relative z-20 pt-10 pb-4 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#B09C4B] flex-shrink-0" />
            <span
              className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-[#B09C4B]"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              07 / Get Involved
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#64717C] font-light">
            <Sparkles className="w-3.5 h-3.5 text-[#B09C4B]" />
            <span style={{ fontFamily: "var(--font-hero-sans)" }}>Engagement &amp; Civic Praxis</span>
          </div>
        </div>
      </div>

      {/* ═══ Main 50/50 Stage ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 pb-20 md:pb-28">
        <div
          className={`
            grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch
            transition-all duration-[900ms] ease-out
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN (~50%): Cinematic Visual Stage
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 relative flex flex-col">
            <div
              className="
                relative w-full flex-grow
                min-h-[320px] sm:min-h-[480px] lg:min-h-[600px]
                rounded-2xl sm:rounded-3xl overflow-hidden
                shadow-[0_20px_60px_rgba(13,44,73,0.12)]
                border border-[#0D2C49]/10 bg-[#081D2E]
              "
            >
              {/* Restrained Gold Framing Accents */}
              <div className="absolute top-5 left-5 z-20 pointer-events-none">
                <div className="w-8 h-8 border-t-2 border-l-2 border-[#B09C4B]/80" />
              </div>
              <div className="absolute top-5 right-5 z-20 pointer-events-none">
                <div className="w-8 h-8 border-t-2 border-r-2 border-[#B09C4B]/80" />
              </div>

              {/* Crossfading Images (All Women in Policy/Leadership Collaboration) */}
              {PARTICIPATION_PATHWAYS.map((p, idx) => (
                <div
                  key={p.pathwayKey}
                  className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                  style={{
                    opacity: idx === activeIdx ? (isTransitioning ? 0.3 : 1) : 0,
                    zIndex: idx === activeIdx ? 2 : 1,
                  }}
                  aria-hidden={idx !== activeIdx}
                >
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`
                      object-cover object-center
                      transition-transform duration-[7000ms] ease-out
                      ${idx === activeIdx && !prefersReducedMotion ? "scale-[1.03]" : "scale-100"}
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

              {/* Bottom In-Image Pathway Indicator */}
              <div className="absolute bottom-0 inset-x-0 z-20 p-6 sm:p-8 flex items-end justify-between gap-4">
                <div className="space-y-1.5 max-w-[80%]">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B09C4B] block"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    Active Pathway — {activePathway.number}
                  </span>
                  <h4
                    className="text-2xl sm:text-3xl text-white font-normal leading-tight"
                    style={{ fontFamily: "var(--font-hero-serif)" }}
                  >
                    {activePathway.title}
                  </h4>
                  <p
                    className="text-xs sm:text-sm text-white/80 font-light line-clamp-1"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    {activePathway.imageCaption}
                  </p>
                </div>

                <div
                  className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-mono"
                >
                  <span className="text-[#B09C4B] font-semibold">{activePathway.number}</span>
                  <span className="text-white/40">/</span>
                  <span className="text-white/70">03</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN (~50%): Editorial Narrative & Participation Rows
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col justify-between pt-2 lg:pt-0">
            {/* Top Narrative Block */}
            <div className="space-y-6">
              <div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#081D2E] leading-[1.12] tracking-tight"
                  style={{ fontFamily: "var(--font-hero-serif)" }}
                >
                  Your voice belongs in the{" "}
                  <span className="italic text-[#B09C4B] font-serif">room.</span>
                </h2>
                <p
                  className="mt-4 text-sm sm:text-base text-[#64717C] font-light leading-relaxed max-w-xl"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  AIPP brings together women who want to contribute ideas, share expertise, and help
                  shape conversations around diplomacy, policy, and public life.
                </p>
              </div>

              {/* Three Compact Editorial Participation Rows */}
              <div
                role="list"
                aria-label="Participation Pathways"
                className="divide-y divide-[#0D2C49]/10 border-y border-[#0D2C49]/10 pt-2"
              >
                {PARTICIPATION_PATHWAYS.map((p, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <div
                      key={p.pathwayKey}
                      role="listitem"
                      tabIndex={0}
                      onMouseEnter={() => handleRowHover(idx)}
                      onFocus={() => handleRowHover(idx)}
                      onClick={() => onOpenContact(p.pathwayKey)}
                      className={`
                        group relative py-5 px-3 sm:px-4 rounded-xl cursor-pointer
                        transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B]
                        ${isActive ? "bg-[#FAF9F6]" : "hover:bg-[#FAF9F6]/60"}
                      `}
                    >
                      {/* Active Left Gold Indicator */}
                      <span
                        className={`
                          absolute left-0 top-3 bottom-3 w-[3px] rounded-r bg-[#B09C4B]
                          transition-all duration-300
                          ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 group-hover:opacity-60 group-hover:scale-y-75"}
                        `}
                      />

                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs font-mono font-semibold transition-colors ${
                                isActive ? "text-[#B09C4B]" : "text-[#64717C]/70 group-hover:text-[#B09C4B]"
                              }`}
                            >
                              {p.number}
                            </span>
                            <span className="text-[#0D2C49]/20 font-light">|</span>
                            <h3
                              className={`text-xl sm:text-2xl transition-colors ${
                                isActive
                                  ? "text-[#081D2E] font-medium"
                                  : "text-[#243748] group-hover:text-[#081D2E]"
                              }`}
                              style={{ fontFamily: "var(--font-hero-serif)" }}
                            >
                              {p.title}
                            </h3>
                          </div>

                          <p
                            className="text-xs sm:text-sm text-[#081D2E] font-normal"
                            style={{ fontFamily: "var(--font-hero-sans)" }}
                          >
                            &ldquo;{p.subtitle}&rdquo;
                          </p>
                          <p
                            className="text-xs text-[#64717C] font-light leading-relaxed pt-0.5"
                            style={{ fontFamily: "var(--font-hero-sans)" }}
                          >
                            {p.detail}
                          </p>
                        </div>

                        {/* Animated Arrow Reveal */}
                        <div
                          className={`
                            flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center
                            transition-all duration-300 mt-1
                            ${
                              isActive
                                ? "bg-[#0D2C49] border-[#0D2C49] text-white shadow-sm"
                                : "border-[#0D2C49]/15 text-[#0D2C49] group-hover:bg-[#0D2C49] group-hover:border-[#0D2C49] group-hover:text-white"
                            }
                          `}
                        >
                          <ArrowUpRight
                            className={`w-3.5 h-3.5 transition-transform duration-300 ${
                              isActive
                                ? "translate-x-0.5 -translate-y-0.5"
                                : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Section CTA */}
            <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={() => onOpenContact(activePathway.pathwayKey)}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#0D2C49] text-white hover:bg-[#081D2E] text-xs font-semibold tracking-wider transition-all duration-300 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                <span>Find Your Place at AIPP</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#64717C]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B09C4B] shrink-0" />
                <span>Open to scholars, diplomats &amp; emerging leaders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
