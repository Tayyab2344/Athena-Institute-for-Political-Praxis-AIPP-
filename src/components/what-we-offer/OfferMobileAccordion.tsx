"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowRight, FileText, GitBranch, Radio } from "lucide-react";
import { OFFER_PILLARS } from "@/data/offerData";

interface OfferMobileAccordionProps {
  onNavigate: () => void;
}

export default function OfferMobileAccordion({ onNavigate }: OfferMobileAccordionProps) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const isActive = pathname.startsWith("/what-we-offer");

  const motifs = [
    { icon: FileText, label: "Document Motif", hint: "Research Lab" },
    { icon: GitBranch, label: "Path Motif", hint: "Strategy Room" },
    { icon: Radio, label: "Voice Motif", hint: "Media Studio" }
  ];

  return (
    <div className="border-b border-[var(--color-border)] pb-2">
      {/* Toggle Button */}
      <button
        type="button"
        className="w-full flex items-center justify-between py-3 text-left font-serif text-lg font-medium text-[var(--hero-navy)]"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls="offer-mobile-panel"
      >
        <span className={isActive ? "text-[var(--hero-gold)]" : ""}>What We Offer</span>
        <ChevronDown
          className={`h-5 w-5 text-[var(--hero-navy)] transition-transform duration-300 ${
            expanded ? "rotate-180 text-[var(--hero-gold)]" : ""
          }`}
        />
      </button>

      {/* Accordion Panel */}
      <div
        id="offer-mobile-panel"
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-[600px] opacity-100 mt-2 mb-3" : "max-h-0 opacity-0"
        }`}
        role="region"
        aria-label="What We Offer sub-navigation"
      >
        <div className="space-y-3 pl-2">
          {/* Overview Link */}
          <Link
            href="/what-we-offer"
            className="flex items-center justify-between p-3 bg-slate-50 border border-[var(--color-border)] rounded-sm text-xs font-semibold uppercase tracking-wider text-[var(--hero-navy)]"
            aria-current={pathname === "/what-we-offer" ? "page" : undefined}
            onClick={onNavigate}
          >
            <span>Overview: The Tripartite Model</span>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--hero-gold)]" />
          </Link>

          {/* Pillar Links with Motifs */}
          {OFFER_PILLARS.map((pillar, idx) => {
            const isPillarActive = pathname === pillar.route;
            const MotifIcon = motifs[idx].icon;

            return (
              <Link
                key={pillar.slug}
                href={pillar.route}
                className={`block p-3.5 border transition-all rounded-sm ${
                  isPillarActive
                    ? "bg-white border-[var(--hero-gold)] shadow-sm"
                    : "bg-white border-[var(--color-border)] hover:border-[var(--hero-navy)]"
                }`}
                aria-current={isPillarActive ? "page" : undefined}
                onClick={onNavigate}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm text-[var(--hero-gold)] font-light">
                      {pillar.number}
                    </span>
                    <span className="font-serif text-base font-medium text-[var(--hero-navy)]">
                      {pillar.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--hero-gold)]">
                    <MotifIcon className="h-4 w-4" />
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
                <p className="text-xs text-[var(--color-foreground-muted)] font-sans mt-1.5 line-clamp-2">
                  {pillar.shortDescription}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
