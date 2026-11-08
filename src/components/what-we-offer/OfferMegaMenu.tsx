"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";

interface OfferMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OfferMegaMenu({ isOpen, onClose }: OfferMegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);

  /* Close on Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  /* Close on click outside */
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const navbarEl = menuRef.current.closest("header");
        if (navbarEl && navbarEl.contains(e.target as Node)) return;
        onClose();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClick);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={menuRef}
      className="offer-mega-menu"
      data-open={isOpen}
      role="menu"
      aria-label="What We Offer navigation"
    >
      <Container wide>
        <div className="offer-mega-menu-inner">
          {/* Left Column — Editorial Intro (~28%) */}
          <div className="offer-mega-left flex flex-col justify-between">
            <div>
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-2">
                AIPP Ecosystem
              </span>
              <h3 className="text-2xl lg:text-[1.75rem] font-normal text-[var(--hero-navy)] font-serif leading-tight">
                From Research to Strategy to Public Influence.
              </h3>
              <p className="text-xs leading-relaxed text-[var(--color-foreground-muted)] font-sans mt-3">
                A tripartite model built for women leaders in diplomacy, policy innovation, and strategic governance.
              </p>
            </div>

            <div className="pt-6 border-t border-[var(--color-border)] mt-6">
              <Link
                href="/what-we-offer"
                className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--hero-navy)] hover:text-[var(--hero-gold)] transition-colors"
                onClick={onClose}
              >
                <span>Explore Full Ecosystem Overview</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Area — Three Rich Editorial Pillars (~72%) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 01: Research */}
            <Link
              href="/what-we-offer/research-policy-innovation"
              className="group relative flex flex-col justify-between p-5 bg-white border border-[var(--color-border)] transition-all duration-300 hover:border-[var(--hero-gold)] hover:shadow-lg hover:-translate-y-1"
              role="menuitem"
              onClick={onClose}
              onMouseEnter={() => setHoveredPillar(1)}
              onMouseLeave={() => setHoveredPillar(null)}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-lg text-[var(--hero-gold)] font-light">01</span>
                  <span className="text-[0.625rem] font-mono tracking-widest text-[var(--color-foreground-muted)] uppercase">
                    LAB / ARCHIVE
                  </span>
                </div>

                {/* Miniature Visual: Document / Paper / Annotation */}
                <div className="h-28 w-full bg-[var(--color-background-muted)] border border-[var(--color-border)] p-3 relative overflow-hidden mb-4 group-hover:bg-[#FCFBF8] transition-colors">
                  <svg className="w-full h-full" viewBox="0 0 160 80" fill="none">
                    {/* Background page lines */}
                    <rect x="15" y="10" width="130" height="60" rx="2" fill="white" stroke="#D9DEE2" strokeWidth="1" />
                    <line x1="25" y1="22" x2="85" y2="22" stroke="#0D2C49" strokeWidth="2" />
                    <line x1="25" y1="32" x2="135" y2="32" stroke="#64717C" strokeWidth="1" strokeOpacity="0.4" />
                    <line x1="25" y1="40" x2="120" y2="40" stroke="#64717C" strokeWidth="1" strokeOpacity="0.4" />
                    
                    {/* Animated gold highlighter */}
                    <rect
                      x="25"
                      y="46"
                      width={hoveredPillar === 1 ? "95" : "40"}
                      height="8"
                      fill="rgba(176, 156, 75, 0.25)"
                      rx="1"
                      className="transition-all duration-500 ease-out"
                    />
                    <line x1="27" y1="50" x2="115" y2="50" stroke="#0D2C49" strokeWidth="1" strokeOpacity="0.8" />

                    {/* Annotation mark */}
                    <path
                      d="M 110 20 Q 130 18 135 28"
                      stroke="var(--hero-gold)"
                      strokeWidth="1.2"
                      fill="none"
                      strokeDasharray="2 2"
                    />
                    <text x="122" y="38" fontSize="6" fontFamily="serif" fontStyle="italic" fill="var(--hero-gold)">
                      Ref. 4
                    </text>
                  </svg>
                </div>

                <h4 className="font-serif text-lg font-medium text-[var(--hero-navy)] leading-snug group-hover:text-[var(--hero-gold)] transition-colors">
                  Research & Policy Innovation
                </h4>
                <p className="text-xs text-[var(--color-foreground-muted)] font-sans mt-2 leading-relaxed">
                  Evidence, empirical analysis, and working papers shaping multilateral diplomacy.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--color-border)]/60 flex items-center justify-between text-xs font-semibold text-[var(--hero-navy)]">
                <span>Enter Research Lab</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[var(--hero-gold)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>

            {/* 02: Strategic Action */}
            <Link
              href="/what-we-offer/strategic-action-simulation"
              className="group relative flex flex-col justify-between p-5 bg-white border border-[var(--color-border)] transition-all duration-300 hover:border-[var(--hero-gold)] hover:shadow-lg hover:-translate-y-1"
              role="menuitem"
              onClick={onClose}
              onMouseEnter={() => setHoveredPillar(2)}
              onMouseLeave={() => setHoveredPillar(null)}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-lg text-[var(--hero-gold)] font-light">02</span>
                  <span className="text-[0.625rem] font-mono tracking-widest text-[var(--color-foreground-muted)] uppercase">
                    STRATEGY ROOM
                  </span>
                </div>

                {/* Miniature Visual: Branching Strategy Path */}
                <div className="h-28 w-full bg-[var(--hero-dark)] p-3 relative overflow-hidden mb-4 rounded-sm border border-slate-800">
                  <svg className="w-full h-full" viewBox="0 0 160 80" fill="none">
                    {/* Origin node */}
                    <circle cx="25" cy="40" r="5" fill="var(--hero-gold)" />
                    <text x="25" y="55" fontSize="6" fontFamily="sans-serif" textAnchor="middle" fill="#A0AEC0">
                      ORIGIN
                    </text>

                    {/* Branching paths */}
                    <path
                      d="M 30 40 C 55 40, 65 20, 95 20"
                      stroke={hoveredPillar === 2 ? "var(--hero-gold)" : "#334E68"}
                      strokeWidth={hoveredPillar === 2 ? "1.8" : "1.2"}
                      fill="none"
                      className="transition-all duration-300"
                    />
                    <path
                      d="M 30 40 L 95 40"
                      stroke={hoveredPillar === 2 ? "var(--hero-gold)" : "#334E68"}
                      strokeWidth={hoveredPillar === 2 ? "1.8" : "1.2"}
                      fill="none"
                      className="transition-all duration-300"
                    />
                    <path
                      d="M 30 40 C 55 40, 65 60, 95 60"
                      stroke={hoveredPillar === 2 ? "var(--hero-gold)" : "#334E68"}
                      strokeWidth={hoveredPillar === 2 ? "1.8" : "1.2"}
                      fill="none"
                      className="transition-all duration-300"
                    />

                    {/* Nodes A, B, C */}
                    <circle cx="95" cy="20" r="3.5" fill="#627D98" />
                    <circle cx="95" cy="40" r="4" fill="var(--hero-gold)" />
                    <circle cx="95" cy="60" r="3.5" fill="#627D98" />

                    {/* Destination node */}
                    <path
                      d="M 95 40 L 135 40"
                      stroke="var(--hero-gold)"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle cx="135" cy="40" r="4.5" fill="none" stroke="var(--hero-gold)" strokeWidth="1.5" />
                    <circle cx="135" cy="40" r="2" fill="var(--hero-gold)" />
                  </svg>
                </div>

                <h4 className="font-serif text-lg font-medium text-[var(--hero-navy)] leading-snug group-hover:text-[var(--hero-gold)] transition-colors">
                  Strategic Action & Simulation
                </h4>
                <p className="text-xs text-[var(--color-foreground-muted)] font-sans mt-2 leading-relaxed">
                  Bilateral wargaming, crisis negotiation exercises, and scenario planning.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--color-border)]/60 flex items-center justify-between text-xs font-semibold text-[var(--hero-navy)]">
                <span>Enter Strategy Room</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[var(--hero-gold)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>

            {/* 03: Communications */}
            <Link
              href="/what-we-offer/communications-public-advocacy"
              className="group relative flex flex-col justify-between p-5 bg-white border border-[var(--color-border)] transition-all duration-300 hover:border-[var(--hero-gold)] hover:shadow-lg hover:-translate-y-1"
              role="menuitem"
              onClick={onClose}
              onMouseEnter={() => setHoveredPillar(3)}
              onMouseLeave={() => setHoveredPillar(null)}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-lg text-[var(--hero-gold)] font-light">03</span>
                  <span className="text-[0.625rem] font-mono tracking-widest text-[var(--color-foreground-muted)] uppercase">
                    MEDIA STUDIO
                  </span>
                </div>

                {/* Miniature Visual: Voice / Concentric Waves */}
                <div className="h-28 w-full bg-[var(--color-background-muted)] border border-[var(--color-border)] p-3 relative overflow-hidden mb-4 flex items-center justify-center group-hover:bg-[#FCFBF8] transition-colors">
                  <svg className="w-full h-full" viewBox="0 0 160 80" fill="none">
                    {/* Concentric expanding voice ripples */}
                    <circle cx="80" cy="40" r="10" stroke="var(--hero-navy)" strokeWidth="1" strokeOpacity="0.8" />
                    <circle
                      cx="80"
                      cy="40"
                      r={hoveredPillar === 3 ? "24" : "20"}
                      stroke="var(--hero-gold)"
                      strokeWidth="1.2"
                      strokeDasharray="4 3"
                      className="transition-all duration-500 ease-out"
                    />
                    <circle
                      cx="80"
                      cy="40"
                      r={hoveredPillar === 3 ? "36" : "30"}
                      stroke="var(--hero-navy)"
                      strokeWidth="1"
                      strokeOpacity="0.4"
                      className="transition-all duration-500 ease-out"
                    />
                    
                    {/* Center microphone / voice core */}
                    <circle cx="80" cy="40" r="4" fill="var(--hero-gold)" />
                    <text x="80" y="43" fontSize="5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" fill="#0D2C49">
                      VOX
                    </text>
                  </svg>
                </div>

                <h4 className="font-serif text-lg font-medium text-[var(--hero-navy)] leading-snug group-hover:text-[var(--hero-gold)] transition-colors">
                  Communications & Public Advocacy
                </h4>
                <p className="text-xs text-[var(--color-foreground-muted)] font-sans mt-2 leading-relaxed">
                  Keynote advocacy, media syndication, and narrative architecture for public diplomacy.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--color-border)]/60 flex items-center justify-between text-xs font-semibold text-[var(--hero-navy)]">
                <span>Enter Media Studio</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[var(--hero-gold)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
