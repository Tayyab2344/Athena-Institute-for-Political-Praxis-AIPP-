"use client";

import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ─────────────────────────────────────────────────────────────
   About Page - Section 3: Mission & Vision
   - Visually distinctive architectural split
   - Two strong, balanced content areas
   - Tight, disciplined spacing (no giant gaps)
   ───────────────────────────────────────────────────────────── */

export default function MissionVisionSection() {
  return (
    <section
      className="relative w-full bg-white text-[#081D2E] py-12 sm:py-16 lg:py-20 border-b border-[#D9DEE2]/80 overflow-hidden"
      aria-label="Mission and Vision"
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
              Purpose &amp; Horizon
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[3rem] font-normal leading-[1.12] tracking-tight text-[#0D2C49]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            The mandate driving our institutional praxis.
          </h2>
        </ScrollReveal>

        {/* Two Strong Content Areas: Architectural Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 border-t border-[#D9DEE2] pt-8 sm:pt-10">
          
          {/* Mission Panel */}
          <ScrollReveal variant="fade-up" delay={60} className="flex flex-col justify-between space-y-4 lg:pr-8 lg:border-r border-[#D9DEE2]">
            <div className="space-y-3">
              <span
                className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                01 / Our Mission
              </span>
              <h3
                className="text-xl sm:text-2xl lg:text-[1.85rem] font-normal text-[#0D2C49] leading-snug"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                To equip and elevate women leaders with the empirical evidence, crisis simulation tools, and public platforms needed to resolve complex international security challenges.
              </h3>
            </div>

            <p
              className="text-base text-[#243748] font-normal leading-relaxed pt-3 border-t border-[#D9DEE2]/60"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              We advance systemic inclusion across bilateral delegations, treaty negotiations, and diplomatic ministries worldwide—moving women&apos;s leadership from token representation to decisive mandate.
            </p>
          </ScrollReveal>

          {/* Vision Panel */}
          <ScrollReveal variant="fade-up" delay={140} className="flex flex-col justify-between space-y-4 lg:pl-8">
            <div className="space-y-3">
              <span
                className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                02 / Our Vision
              </span>
              <h3
                className="text-xl sm:text-2xl lg:text-[1.85rem] font-normal text-[#0D2C49] leading-snug"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                A global governance architecture where women hold equal, decisive authority in international diplomacy, peacebuilding, and multilateral statecraft.
              </h3>
            </div>

            <p
              className="text-base text-[#243748] font-normal leading-relaxed pt-3 border-t border-[#D9DEE2]/60"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Grounded in the proven empirical principle that multilateral agreements are 35% more durable and conflict resolution is significantly more lasting when women lead negotiation delegations.
            </p>
          </ScrollReveal>

        </div>
      </Container>
    </section>
  );
}
