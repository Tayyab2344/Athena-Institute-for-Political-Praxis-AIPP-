"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Container from "@/components/ui/Container";

/* ─────────────────────────────────────────────────────────────
   Section C: AIPP Introduction
   Concise institutional narrative answering:
   - What AIPP is
   - Its mission
   - Why its work matters
   ───────────────────────────────────────────────────────────── */

const PRAXIS_PILLARS = [
  {
    number: "01",
    title: "Empirical Policy Research",
    description: "Independent investigation, policy audits, and data-driven analysis informing international governance.",
  },
  {
    number: "02",
    title: "Strategic Simulation Labs",
    description: "Crisis scenario planning, bilateral bargaining exercises, and high-pressure diplomatic training.",
  },
  {
    number: "03",
    title: "Public Advocacy & Voice",
    description: "Elevating women leaders in international summits, diplomatic assemblies, and global media discourse.",
  },
];

export default function IntroSection() {
  return (
    <section
      id="about"
      className="relative w-full bg-[#F7F7F7] text-[#081D2E] py-20 sm:py-28 lg:py-32 border-y border-[#D9DEE2] scroll-mt-20 overflow-hidden"
      aria-label="About AIPP - Institutional Introduction"
    >
      <Container wide>
        {/* Section Header Eyebrow */}
        <div className="flex items-center gap-3 mb-8 sm:mb-12">
          <span className="h-px w-8 bg-[#B09C4B] shrink-0" />
          <span
            className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-[#B09C4B]"
            style={{ fontFamily: "var(--font-hero-sans)" }}
          >
            01 / Institutional Introduction
          </span>
          <div className="h-px bg-[#D9DEE2] flex-grow" />
        </div>

        {/* 2-Column Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (7 cols): Editorial Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0D2C49] leading-[1.12] tracking-tight"
                style={{ fontFamily: "var(--font-hero-serif)" }}
              >
                Where rigorous policy research meets the frontlines of{" "}
                <span className="italic font-serif text-[#B09C4B]">multilateral diplomacy.</span>
              </h2>

              <p
                className="text-base sm:text-lg text-[#081D2E] font-medium leading-relaxed pt-2"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                The Athena Institute for Political Praxis (AIPP) is a non-partisan international policy institute dedicated to elevating women in diplomatic affairs, statecraft, and global governance.
              </p>

              <p
                className="text-sm sm:text-base text-[#64717C] font-light leading-relaxed"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                We equip current and emerging women leaders with empirical evidence, crisis simulation training, and public platforms to navigate high-stakes international security challenges. International peace accords and multilateral agreements are proven to endure longer and maintain greater stability when women hold decisive negotiating mandates.
              </p>
            </div>

            {/* 3 Structured Core Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#D9DEE2]">
              {PRAXIS_PILLARS.map((item) => (
                <div key={item.number} className="space-y-2">
                  <span
                    className="text-xs font-mono font-bold text-[#B09C4B]"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    {item.number}
                  </span>
                  <h3
                    className="text-base font-medium text-[#0D2C49] leading-tight"
                    style={{ fontFamily: "var(--font-hero-serif)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-xs text-[#64717C] font-light leading-relaxed"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Link to Full About Page */}
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0D2C49] hover:text-[#B09C4B] transition-colors group"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                <span>Discover our governance, mission & leadership</span>
                <ArrowUpRight className="w-4 h-4 text-[#B09C4B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column (5 cols): Authentic Framed Image Stage */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] w-full overflow-hidden rounded-xs border border-[#D9DEE2] shadow-xl group bg-white">
              <Image
                src="/offer-women-summit.jpg"
                alt="International women leaders and delegates in a multilateral diplomacy summit chamber"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Architectural Ambient Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E]/90 via-[#081D2E]/25 to-transparent" />

              {/* Verified Editorial Caption */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B09C4B]" />
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B09C4B]"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    Multilateral Summit Chamber
                  </span>
                </div>
                <p
                  className="text-sm sm:text-base font-normal italic text-white/95 leading-snug"
                  style={{ fontFamily: "var(--font-hero-serif)" }}
                >
                  &ldquo;Sustainable diplomacy is achieved when women are not merely consulted, but hold the pen on international accords.&rdquo;
                </p>
                <span
                  className="block text-[11px] text-white/70 font-light"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  Athena Institute for Political Praxis (AIPP)
                </span>
              </div>

              {/* Corner Gold Architectural Accent */}
              <div className="absolute top-0 right-0 h-10 w-px bg-[#B09C4B]" />
              <div className="absolute top-0 right-0 h-px w-10 bg-[#B09C4B]" />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
