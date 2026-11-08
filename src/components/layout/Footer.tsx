"use client";

import Link from "next/link";
import { ArrowUp, ArrowUpRight, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";

/* ─────────────────────────────────────────────────────────────
   Final Footer — "An Editorial Institutional Signature"
   Deep Navy Canvas (#06101E)
   - Large low-contrast AIPP watermark in background
   - Thin muted-gold divider
   - Verified navigation & offering pillars
   - Smooth Back-to-Top interaction
   ───────────────────────────────────────────────────────────── */

interface FooterProps {
  onOpenContact: (pathway?: string) => void;
}

const QUICK_NAV = [
  { label: "Home", href: "/" },
  { label: "About AIPP", href: "/about" },
  { label: "What We Offer", href: "/what-we-offer" },
  { label: "Research Archive", href: "/research" },
  { label: "Policy Journals", href: "/journals" },
  { label: "Strategic Programs", href: "/#programs" },
  { label: "Voices & Perspectives", href: "/#perspectives" },
  { label: "Connect", href: "/#contact" },
];

const OFFERING_PILLARS = [
  {
    number: "01",
    label: "Research & Policy Innovation",
    href: "/what-we-offer/research-policy-innovation",
    desc: "Evidence, policy research & knowledge development"
  },
  {
    number: "02",
    label: "Strategic Action & Simulation",
    href: "/what-we-offer/strategic-action-simulation",
    desc: "Scenario planning, decision-making & strategic exercises"
  },
  {
    number: "03",
    label: "Communications & Public Advocacy",
    href: "/what-we-offer/communications-public-advocacy",
    desc: "Public dialogue, storytelling & advocacy"
  },
];

export default function Footer({ onOpenContact }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="footer"
      className="relative w-full max-w-full bg-[#06101E] text-white pt-16 sm:pt-24 pb-12 overflow-hidden overflow-x-clip border-t border-white/10"
      aria-label="AIPP Footer"
    >
      {/* ═══ Giant Subtle Background Watermark Wordmark ═══ */}
      <div
        className="absolute bottom-0 right-0 left-0 w-full max-w-full flex justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden leading-none z-0"
        aria-hidden="true"
      >
        <span
          className="text-[16vw] font-bold tracking-tighter uppercase whitespace-nowrap"
          style={{ fontFamily: "var(--font-hero-serif)" }}
        >
          ATHENA PRAXIS
        </span>
      </div>

      <Container wide className="relative z-10">
        {/* ═══ Top Editorial Header Bar in Footer ═══ */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between pb-16 border-b border-white/10 gap-8">
          <div className="space-y-4 max-w-xl">
            <Link
              href="/"
              className="inline-flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B09C4B] font-serif text-base font-bold text-[#081D2E]">
                A
              </span>
              <div className="flex flex-col">
                <span
                  className="font-serif text-2xl font-bold tracking-wide text-white leading-none"
                  style={{ fontFamily: "var(--font-hero-serif)" }}
                >
                  AIPP
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.2em] text-[#B09C4B] font-medium pt-1"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  Athena Institute for Political Praxis
                </span>
              </div>
            </Link>

            <p
              className="text-xs sm:text-sm text-white/70 font-light leading-relaxed max-w-md"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              A non-partisan international policy institute elevating women in diplomacy,
              geopolitical research, strategic action, and public leadership worldwide.
            </p>
          </div>

          {/* Back to Top Restrained Button */}
          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-medium tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
            style={{ fontFamily: "var(--font-hero-sans)" }}
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#B09C4B] transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* ═══ Footer Columns Grid ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-16 border-b border-white/10">
          
          {/* Col 1: What We Offer (Pillars) */}
          <div className="lg:col-span-5 space-y-5">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B09C4B] block"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              Offering Pillars
            </span>
            <div className="space-y-4">
              {OFFERING_PILLARS.map((pillar) => (
                <Link
                  key={pillar.number}
                  href={pillar.href}
                  className="group block p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#B09C4B]/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[#B09C4B]">
                      {pillar.number}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[#B09C4B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <h4
                    className="text-sm font-medium text-white group-hover:text-[#B09C4B] transition-colors mt-1"
                    style={{ fontFamily: "var(--font-hero-serif)" }}
                  >
                    {pillar.label}
                  </h4>
                  <p className="text-[11px] text-white/50 font-light mt-0.5">
                    {pillar.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-4 lg:col-start-7 space-y-5">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B09C4B] block"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              Institutional Navigation
            </span>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {QUICK_NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-1 group font-light"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Engagement & Inquiries */}
          <div className="md:col-span-2 lg:col-span-2 space-y-5">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B09C4B] block"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              Engagement
            </span>
            <ul className="space-y-3 text-xs text-white/70 font-light">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenContact("Volunteer")}
                  className="hover:text-white transition-colors text-left"
                >
                  Volunteer Opportunities
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenContact("Contribute")}
                  className="hover:text-white transition-colors text-left"
                >
                  Research Contributor
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenContact("Collaborate")}
                  className="hover:text-white transition-colors text-left"
                >
                  Institutional Partnership
                </button>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-1.5 text-[#B09C4B] hover:text-white transition-colors font-medium pt-1"
                >
                  <span>Connect With AIPP</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ═══ Footer Bottom Copyright & Institutional Colophon ═══ */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-white/50 font-light">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-[#B09C4B] shrink-0" />
            <span>
              &copy; {new Date().getFullYear()} Athena Institute for Political Praxis. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-white/40">Non-Partisan Diplomatic Policy Institute</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
