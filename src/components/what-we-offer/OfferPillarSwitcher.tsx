"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import { OFFER_PILLARS } from "@/data/offerData";
import { FileText, GitBranch, Radio } from "lucide-react";

/**
 * Shared editorial pillar switcher navigation strip displayed across all three pillar pages.
 * Current page: gold marker. Other pages: muted. Hover: line animation.
 */
export default function OfferPillarSwitcher() {
  const pathname = usePathname();

  const motifs = [
    { icon: FileText, motif: "DOCUMENT / GRID / ANNOTATION" },
    { icon: GitBranch, motif: "PATH / NODE / DECISION" },
    { icon: Radio, motif: "VOICE / CIRCLE / WAVE" }
  ];

  return (
    <div className="w-full bg-white border-b border-[var(--color-border)] sticky top-20 z-30 shadow-sm backdrop-blur-md bg-white/95">
      <Container>
        <nav
          className="flex items-center justify-between overflow-x-auto no-scrollbar py-1"
          aria-label="What We Offer pillar navigation"
        >
          <div className="flex items-center space-x-2 sm:space-x-8 min-w-max">
            {OFFER_PILLARS.map((pillar, idx) => {
              const isActive = pathname === pillar.route;
              const MotifIcon = motifs[idx].icon;

              return (
                <Link
                  key={pillar.slug}
                  href={pillar.route}
                  className={`group relative flex items-center gap-3 py-3 px-3.5 transition-all text-xs sm:text-sm font-medium tracking-wide ${
                    isActive
                      ? "text-[var(--hero-navy)] font-semibold"
                      : "text-[var(--color-foreground-muted)] hover:text-[var(--hero-navy)]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Subtle Motif Icon */}
                  <MotifIcon
                    className={`h-3.5 w-3.5 transition-colors ${
                      isActive ? "text-[var(--hero-gold)]" : "text-slate-400 group-hover:text-[var(--hero-gold)]"
                    }`}
                  />

                  {/* Number */}
                  <span
                    className={`font-serif text-sm transition-transform duration-300 ${
                      isActive
                        ? "text-[var(--hero-gold)] font-bold scale-110"
                        : "text-slate-400 group-hover:text-[var(--hero-gold)] group-hover:scale-105"
                    }`}
                  >
                    {pillar.number}
                  </span>

                  {/* Title */}
                  <span className="font-serif sm:text-base">{pillar.title}</span>

                  {/* Bottom Gold Indicator */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2.5px] transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--hero-gold)] opacity-100"
                        : "bg-[var(--hero-gold)] opacity-0 group-hover:opacity-60 scale-x-75 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Quick breadcrumb label */}
          <div className="hidden lg:flex items-center gap-2 text-[0.6875rem] font-mono tracking-wider text-[var(--color-foreground-muted)] uppercase pl-6 border-l border-[var(--color-border)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--hero-gold)] animate-pulse" />
            <span>AIPP Praxial System</span>
          </div>
        </nav>
      </Container>
    </div>
  );
}
