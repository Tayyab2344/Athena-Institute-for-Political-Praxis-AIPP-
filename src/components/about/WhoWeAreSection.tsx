"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ─────────────────────────────────────────────────────────────
   About Page - Section 2: Who We Are
   - Explains what AIPP is and what it does
   - Explicitly features Tayyaba Atiq as Founder
   - Uses local image asset to eliminate blank loading gaps
   - Compact, intentional spacing (no excessive vertical voids)
   ───────────────────────────────────────────────────────────── */

export default function WhoWeAreSection() {
  return (
    <section
      id="who-we-are"
      className="relative w-full bg-[#F7F7F7] text-[#081D2E] py-12 sm:py-16 lg:py-20 border-b border-[#D9DEE2]/80 scroll-mt-20 overflow-hidden"
      aria-label="Who We Are"
    >
      <Container wide>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Heading, Narrative & Founder Profile (7 cols) */}
          <ScrollReveal variant="fade-up" className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#B09C4B]" />
              <span
                className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Who We Are
              </span>
            </div>

            {/* Section Heading: 44-56px Desktop */}
            <h2
              className="text-3xl sm:text-4xl lg:text-[3rem] font-normal leading-[1.12] tracking-tight text-[#0D2C49]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              A non-partisan institute for serious ideas and decisive representation.
            </h2>

            {/* Narrative */}
            <div className="space-y-4 max-w-2xl text-[#243748]">
              <p
                className="text-base sm:text-lg leading-relaxed font-normal"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Founded by <strong className="font-semibold text-[#0D2C49]">Tayyaba Atiq</strong>, the Athena Institute for Political Praxis (AIPP) operates at the intersection of international policy research, diplomatic simulation, and strategic advocacy.
              </p>

              <p
                className="text-base sm:text-[1.0625rem] leading-relaxed font-normal"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                We believe global governance becomes more stable, accountable, and durable when women participate directly in the design and execution of foreign policy. By connecting research, simulation training, and public advocacy, AIPP equips women leaders with the tools, evidence, and authority to lead enduring multilateral agreements.
              </p>
            </div>

            {/* Dedicated Founder Highlight Card */}
            <div className="border-l-2 border-[#B09C4B] bg-white p-5 sm:p-6 shadow-xs max-w-2xl">
              <span
                className="text-[0.6875rem] font-semibold uppercase tracking-widest text-[#B09C4B] block"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Leadership
              </span>
              <h3
                className="text-xl sm:text-2xl font-normal text-[#0D2C49] mt-1"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Tayyaba Atiq
              </h3>
              <p
                className="text-xs font-semibold text-[#0D2C49] uppercase tracking-wider mt-0.5"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Founder, Athena Institute for Political Praxis
              </p>
              <p
                className="text-sm text-[#243748] mt-2 leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Leading AIPP&apos;s institutional mission to elevate women across diplomatic affairs, statecraft, empirical policy research, and multilateral decision-making worldwide.
              </p>
            </div>
          </ScrollReveal>

          {/* Right Column: Editorial Visual Composition (5 cols) */}
          <ScrollReveal variant="image" delay={120} className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              
              <div className="relative overflow-hidden rounded-xs border border-[#D9DEE2] bg-white p-2 shadow-sm">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[#0D2C49]">
                  <Image
                    src="/offer-women-summit.jpg"
                    alt="Women leaders in diplomatic dialogue at international peace summit"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081D2E]/90 via-[#081D2E]/50 to-transparent p-5 pt-12">
                    <p
                      className="text-xs text-white/90 font-medium"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      Bilateral Working Session · Geneva Policy Forum
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </Container>
    </section>
  );
}
