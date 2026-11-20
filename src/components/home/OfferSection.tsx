"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ─────────────────────────────────────────────────────────────
   Section 4: What We Offer
   - The three core AIPP pillars in a sophisticated editorial ledger
   - Replaces generic 3-column card grid with an architectural triptych
   - Clear titles, 15-25 word descriptions, direct routes
   - Subtle visual distinctions between pillars
   - Serves as the anchor for #what-we-offer and #programs
   ───────────────────────────────────────────────────────────── */

const PILLARS = [
  {
    number: "01",
    title: "Research & Policy Innovation",
    description:
      "Empirical policy research, geopolitical risk analysis, and institutional audits delivering evidence for high-stakes diplomatic decision-making.",
    href: "/what-we-offer/research-policy-innovation",
    linkText: "Explore Research & Policy",
    accentColor: "border-[#0D2C49]",
    badge: "Evidence & Investigation",
  },
  {
    number: "02",
    title: "Strategic Action & Simulation",
    description:
      "Immersive diplomatic crisis labs, negotiation war-rooms, and multilateral scenario exercises preparing women leaders for complex real-world statecraft.",
    href: "/what-we-offer/strategic-action-simulation",
    linkText: "Explore Simulation Labs",
    accentColor: "border-[#243748]",
    badge: "Crisis Preparedness",
  },
  {
    number: "03",
    title: "Communications & Public Advocacy",
    description:
      "Strategic communication, ambassadorial dialogues, and global media engagement amplifying women's voices across international foreign policy discourse.",
    href: "/what-we-offer/communications-public-advocacy",
    linkText: "Explore Public Advocacy",
    accentColor: "border-[#B09C4B]",
    badge: "Voice & Influence",
  },
];

export default function OfferSection() {
  return (
    <section
      id="what-we-offer"
      className="relative w-full bg-white text-[#081D2E] py-20 sm:py-28 lg:py-32 border-b border-[#D9DEE2]/80 scroll-mt-20 overflow-hidden"
      aria-label="What We Offer - Institutional Pillars"
    >
      {/* Anchor target for legacy #programs navigation */}
      <div id="programs" className="scroll-mt-28" />

      <Container wide>
        {/* Section Header */}
        <ScrollReveal variant="fade-up" className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <span className="h-px w-6 bg-[#B09C4B]" />
            <span
              className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              What We Offer
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[3.25rem] font-normal leading-[1.12] tracking-tight text-[#0D2C49]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Three dimensions of institutional praxis.
          </h2>

          <p
            className="mt-4 text-lg sm:text-xl text-[#243748] font-normal leading-relaxed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            AIPP integrates scholarly inquiry, crisis simulation labs, and global advocacy to prepare women leaders for the highest levels of international affairs.
          </p>
        </ScrollReveal>

        {/* Editorial Architectural Rows (Distinct from generic SaaS card kit) */}
        <div className="divide-y divide-[#D9DEE2] border-y border-[#D9DEE2]">
          {PILLARS.map((pillar, idx) => (
            <ScrollReveal
              key={pillar.number}
              variant="fade-up"
              delay={idx * 80}
              className="group relative py-8 sm:py-10 lg:py-12 transition-colors duration-300 hover:bg-[#F7F7F7]/60"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start md:items-center">
                
                {/* Index & Badge (3 cols) */}
                <div className="md:col-span-3 flex items-center gap-4">
                  <span
                    className="text-2xl sm:text-3xl font-light text-[#B09C4B]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {pillar.number}
                  </span>
                  <span
                    className="text-xs font-semibold uppercase tracking-wider text-[#64717C] bg-white px-3 py-1 rounded-full border border-[#D9DEE2]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {pillar.badge}
                  </span>
                </div>

                {/* Title & Description (6 cols) */}
                <div className="md:col-span-6 space-y-2">
                  <h3
                    className="text-2xl sm:text-[1.75rem] font-normal text-[#0D2C49] leading-tight group-hover:text-[#081D2E] transition-colors"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className="text-base sm:text-[1.0625rem] text-[#243748] font-normal leading-relaxed max-w-xl"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {pillar.description}
                  </p>
                </div>

                {/* Action Link (3 cols) */}
                <div className="md:col-span-3 flex justify-start md:justify-end">
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D9DEE2] bg-white px-5 py-2.5 text-sm sm:text-base font-semibold text-[#0D2C49] transition-all duration-200 group-hover:border-[#0D2C49] group-hover:bg-[#0D2C49] group-hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    <span>{pillar.linkText}</span>
                    <ArrowUpRight className="h-4 w-4 text-[#B09C4B] group-hover:text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </Container>
    </section>
  );
}

