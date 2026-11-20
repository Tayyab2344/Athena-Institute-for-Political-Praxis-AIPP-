"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ─────────────────────────────────────────────────────────────
   Section 3: About AIPP
   - Short, punchy introduction to the institute
   - One strong heading (44-56px desktop, 34-40px mobile)
   - Concise description (18-20px)
   - One supporting editorial visual featuring women leaders in dialogue
   - Clear, elegant link to About page
   ───────────────────────────────────────────────────────────── */

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full bg-[#F7F7F7] text-[#081D2E] py-20 sm:py-28 lg:py-32 border-b border-[#D9DEE2]/80 scroll-mt-20 overflow-hidden"
      aria-label="About AIPP"
    >
      <Container wide>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Heading, Concise Narrative & Direct Action (7 cols) */}
          <ScrollReveal variant="fade-up" className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#B09C4B]" />
              <span
                className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                About AIPP
              </span>
            </div>

            {/* Section Heading: 44-56px Desktop, 34-40px Mobile */}
            <h2
              className="text-3xl sm:text-4xl lg:text-[3.25rem] font-normal leading-[1.12] tracking-tight text-[#0D2C49]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Bridging empirical research and diplomatic statecraft.
            </h2>

            {/* Concise Description: 18-20px, highly readable */}
            <p
              className="text-lg sm:text-[1.1875rem] leading-relaxed text-[#243748] font-normal max-w-2xl"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              The Athena Institute for Political Praxis (AIPP) is a non-partisan international policy institute dedicated to elevating women in diplomatic affairs, statecraft, and multilateral decision-making.
            </p>

            <p
              className="text-base sm:text-lg leading-relaxed text-[#243748] font-normal max-w-2xl"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              We equip current and emerging women leaders with rigorous geopolitical research, crisis negotiation training, and global advocacy platforms to lead enduring peace accords and international security frameworks.
            </p>

            {/* Direct Link to About Page */}
            <div className="pt-2">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-base font-semibold text-[#0D2C49] hover:text-[#081D2E] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span className="border-b border-[#0D2C49] pb-0.5 group-hover:border-[#B09C4B] transition-colors">
                  Learn more about our mission, governance, and fellows
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#B09C4B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Right Column: Supporting Visual Layout (5 cols) */}
          <ScrollReveal variant="image" delay={120} className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">

              {/* Editorial Image of Women Leaders at International Summit */}
              <div className="relative overflow-hidden rounded-xs border border-[#D9DEE2] bg-white p-2 shadow-sm">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[#0D2C49]">
                  <Image
                    src="/offer-women-summit.jpg"
                    alt="Women leaders in diplomatic dialogue at international peace summit"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />

                  {/* Subtle lower tag */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081D2E]/90 via-[#081D2E]/50 to-transparent p-5 pt-12">
                    <p
                      className="text-xs text-white/90 font-medium"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      Multilateral Peace Summit · Geneva Working Session
                    </p>
                  </div>
                </div>
              </div>

              {/* Editorial Anchor Card */}
              <div className="mt-4 border-l-2 border-[#B09C4B] bg-white p-4 sm:p-5 shadow-xs">
                <p
                  className="text-sm sm:text-[0.9375rem] text-[#243748] leading-relaxed italic"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  &ldquo;When women participate directly in peace negotiations, the resulting agreements are 35% more likely to last at least 15 years.&rdquo;
                </p>
                <p
                  className="mt-2 text-xs font-semibold text-[#0D2C49] uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  UN &amp; AIPP Empirical Security Studies
                </p>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </Container>
    </section>
  );
}

