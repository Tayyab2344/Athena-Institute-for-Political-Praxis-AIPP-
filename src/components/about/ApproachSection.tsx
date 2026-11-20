"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ─────────────────────────────────────────────────────────────
   About Page - Section 4: Our Approach
   - Explains how AIPP approaches its work through existing verified pillars
   - Compact editorial ledger with tight spacing
   ───────────────────────────────────────────────────────────── */

const APPROACH_PILLARS = [
  {
    number: "01",
    phase: "Inquiry",
    title: "Empirical Policy Research",
    description:
      "We investigate the treaties, negotiations, and institutions that shape world affairs, producing research that is rigorous enough for scholars and actionable enough for frontline practitioners.",
    linkText: "Explore Research",
    href: "/research",
  },
  {
    number: "02",
    phase: "Simulation",
    title: "Strategic Action & Crisis Labs",
    description:
      "We translate insight into immersive diplomatic crisis labs, bilateral bargaining war-rooms, and executive fellowships that prepare women leaders for high-stakes geopolitical tension.",
    linkText: "Explore Simulations",
    href: "/what-we-offer/strategic-action-simulation",
  },
  {
    number: "03",
    phase: "Advocacy",
    title: "Public Voice & Representation",
    description:
      "We amplify women's authority across global summits, ambassadorial dialogues, and international media discourse, shifting female leadership from ceremonial presence to decisive influence.",
    linkText: "Explore Advocacy",
    href: "/what-we-offer/communications-public-advocacy",
  },
];

export default function ApproachSection() {
  return (
    <section
      id="approach"
      className="relative w-full bg-[#F7F7F7] text-[#081D2E] py-12 sm:py-16 lg:py-20 border-b border-[#D9DEE2]/80 scroll-mt-20 overflow-hidden"
      aria-label="Our Approach"
    >
      <Container wide>
        {/* Section Header */}
        <ScrollReveal variant="fade-up" className="max-w-3xl mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <span className="h-px w-6 bg-[#B09C4B]" />
            <span
              className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Methodology &amp; Practice
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[3rem] font-normal leading-[1.12] tracking-tight text-[#0D2C49]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            How we translate evidence into diplomatic impact.
          </h2>

          <p
            className="mt-3 text-base sm:text-lg text-[#243748] font-normal leading-relaxed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            AIPP operates across three interconnected disciplines, ensuring that research informs crisis preparation, and crisis preparation translates into institutional policy.
          </p>
        </ScrollReveal>

        {/* Editorial Progression Ledger */}
        <div className="divide-y divide-[#D9DEE2] border-y border-[#D9DEE2]">
          {APPROACH_PILLARS.map((pillar, idx) => (
            <ScrollReveal
              key={pillar.number}
              variant="fade-up"
              delay={idx * 80}
              className="group relative py-6 sm:py-8 transition-colors duration-300 hover:bg-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-start md:items-center">
                
                {/* Index & Discipline Phase (3 cols) */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <span
                    className="text-2xl font-light text-[#B09C4B]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {pillar.number}
                  </span>
                  <span
                    className="text-xs font-semibold uppercase tracking-wider text-[#64717C] bg-white px-3 py-0.5 rounded-full border border-[#D9DEE2]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {pillar.phase}
                  </span>
                </div>

                {/* Title & Description (6 cols) */}
                <div className="md:col-span-6 space-y-1">
                  <h3
                    className="text-xl sm:text-2xl font-normal text-[#0D2C49] leading-tight group-hover:text-[#081D2E] transition-colors"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className="text-sm sm:text-base text-[#243748] font-normal leading-relaxed max-w-xl"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {pillar.description}
                  </p>
                </div>

                {/* Action Link (3 cols) */}
                <div className="md:col-span-3 flex justify-start md:justify-end">
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D9DEE2] bg-white px-4 py-2 text-sm font-semibold text-[#0D2C49] transition-all duration-200 group-hover:border-[#0D2C49] group-hover:bg-[#0D2C49] group-hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
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
