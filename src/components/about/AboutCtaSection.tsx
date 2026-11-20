"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ─────────────────────────────────────────────────────────────
   About Page - Section 5: Closing CTA
   - High-impact closing section encouraging exploration of What We Offer
   - One clear heading (44-56px desktop, 34-40px mobile)
   - Tight, disciplined spacing (no giant gaps)
   ───────────────────────────────────────────────────────────── */

interface AboutCtaSectionProps {
  onOpenContact: () => void;
}

export default function AboutCtaSection({ onOpenContact }: AboutCtaSectionProps) {
  return (
    <section
      className="relative w-full bg-[#0D2C49] text-white py-14 sm:py-18 lg:py-20 overflow-hidden"
      aria-label="Explore What We Offer CTA"
    >
      <Container wide>
        <ScrollReveal variant="fade-up" className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs uppercase tracking-widest text-[#B09C4B] font-semibold">
            Institutional Programs
          </div>

          {/* Heading: 44-56px Desktop, 34-40px Mobile */}
          <h2
            className="text-3xl sm:text-4xl lg:text-[3rem] font-normal leading-[1.12] tracking-tight text-white text-balance"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Discover the three pillars of AIPP&apos;s work.
          </h2>

          {/* Description: 18-20px */}
          <p
            className="text-base sm:text-lg leading-relaxed text-white/80 font-normal max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            From empirical research and policy audits to immersive diplomatic simulation labs and strategic advocacy, explore how AIPP elevates women in statecraft.
          </p>

          {/* Clear, Confident Action CTAs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/what-we-offer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#B09C4B] px-7 py-3.5 text-base font-semibold text-[#081D2E] shadow-xs transition-all duration-200 hover:bg-white hover:text-[#081D2E] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <span>Explore What We Offer</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <button
              type="button"
              onClick={onOpenContact}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white/10 active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <span>Connect With Our Team</span>
            </button>
          </div>

        </ScrollReveal>
      </Container>
    </section>
  );
}
