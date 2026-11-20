"use client";

import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ─────────────────────────────────────────────────────────────
   Section 6: Closing CTA
   - High-impact, minimal closing section inviting engagement
   - One impactful heading (44-56px desktop, 34-40px mobile)
   - One short description (18-20px)
   - One primary CTA opening the contact modal
   - Anchors for #get-involved and #contact
   ───────────────────────────────────────────────────────────── */

interface ClosingCtaSectionProps {
  onOpenContact: (pathway?: string) => void;
}

export default function ClosingCtaSection({ onOpenContact }: ClosingCtaSectionProps) {
  return (
    <section
      id="contact"
      className="relative w-full bg-[#0D2C49] text-white py-20 sm:py-28 lg:py-32 overflow-hidden"
      aria-label="Engage With AIPP"
    >
      {/* Anchor target for #get-involved */}
      <div id="get-involved" className="scroll-mt-28" />

      <Container wide>
        <ScrollReveal variant="fade-up" className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Subtle Institutional Marker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs uppercase tracking-widest text-[#B09C4B] font-semibold">
            Institutional Engagement
          </div>

          {/* Impactful Heading: 44-56px Desktop, 34-40px Mobile */}
          <h2
            className="text-3xl sm:text-4xl lg:text-[3.25rem] font-normal leading-[1.12] tracking-tight text-white text-balance"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Advance the future of international statecraft.
          </h2>

          {/* Short Description: 18-20px */}
          <p
            className="text-lg sm:text-xl leading-relaxed text-white/80 font-normal max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Partner with AIPP to support groundbreaking policy research, participate in executive diplomatic simulations, or collaborate on multilateral peace initiatives.
          </p>

          {/* Simple, Confident CTA Action */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => onOpenContact("General Inquiry")}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#B09C4B] px-8 py-4 text-base font-semibold text-[#081D2E] shadow-sm transition-all duration-200 hover:bg-white hover:text-[#081D2E] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <span>Connect With AIPP</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

        </ScrollReveal>
      </Container>
    </section>
  );
}

