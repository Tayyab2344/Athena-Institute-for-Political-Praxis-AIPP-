"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";

interface OfferingItem {
  number: string;
  stageName: string;
  title: string;
  statement: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
}

const OFFERINGS: OfferingItem[] = [
  {
    number: "01",
    stageName: "RESEARCH & POLICY INNOVATION",
    title: "Research & Policy Innovation",
    statement: "Knowledge that informs action.",
    description:
      "AIPP investigates issues, develops knowledge and contributes rigorous research that informs critical conversations around women, diplomacy, policy and public affairs.",
    ctaText: "Explore Research",
    ctaHref: "/research",
    image: "/ideas-research.jpg",
    imageAlt:
      "Woman policy researcher examining strategic documents and legal briefs in institutional archive",
  },
  {
    number: "02",
    stageName: "STRATEGIC ACTION & SIMULATION",
    title: "Strategic Action & Simulation",
    statement: "Ideas put into practice.",
    description:
      "AIPP creates immersive environments where ideas are tested through diplomatic simulation, scenario planning, executive workshops and collaborative praxis.",
    ctaText: "Explore Strategic Action",
    ctaHref: "/what-we-offer/strategic-action-simulation",
    image: "/ideas-strategy.jpg",
    imageAlt:
      "Women strategists and diplomats collaborating during an executive diplomatic simulation workshop",
  },
  {
    number: "03",
    stageName: "COMMUNICATIONS & PUBLIC ADVOCACY",
    title: "Communications & Public Advocacy",
    statement: "Voices brought into public dialogue.",
    description:
      "AIPP creates high-visibility platforms for women leaders to project ideas, publish incisive briefs and shape public discourse across international forums.",
    ctaText: "Explore Advocacy",
    ctaHref: "/what-we-offer/communications-public-advocacy",
    image: "/ideas-advocacy.jpg",
    imageAlt:
      "Senior woman diplomat delivering keynote address at international multilateral symposium",
  },
];

export default function PillarsSection() {
  return (
    <section
      id="pillars"
      className="relative w-full bg-[#081D2E] text-white py-16 sm:py-24 lg:py-36 scroll-mt-20 [clip-path:inset(0)]"
      aria-label="What We Offer - Core Pillars"
    >
      {/* Architectural Border Differentiation Divider at Top */}
      <div className="absolute inset-x-0 top-0 z-30 pointer-events-none">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-hero-gold/40 to-transparent mt-[1px]" />
        <div className="flex justify-center -translate-y-1/2">
          <div className="inline-flex items-center gap-2.5 px-4 py-1 rounded-full bg-[#081D2E] border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <span className="h-1.5 w-1.5 rounded-full bg-hero-gold animate-pulse" />
            <span
              className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-hero-gold"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              03 / WHAT WE OFFER
            </span>
          </div>
        </div>
      </div>

      {/* 1. Completely Static Viewport Background Photograph - Clipped strictly to this section */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="relative h-full w-full">
          <Image
            src="/offer-women-summit.jpg"
            alt="International women leaders and delegates in a multilateral diplomacy summit chamber"
            fill
            sizes="100vw"
            priority={false}
            className="object-cover object-[center_35%] brightness-[0.90] contrast-[1.04]"
          />

          {/* 2. Translucent Navy Tint Overlay (Keeps image clearly visible while providing text contrast) */}
          <div className="absolute inset-0 bg-[#081D2E]/55" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 85% 65% at 50% 35%, rgba(8, 29, 46, 0.20) 0%, rgba(8, 29, 46, 0.65) 100%)",
            }}
          />

          {/* Subtle Ambient Edge Transitions */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#081D2E]/90 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#081D2E]/95 to-transparent" />

          {/* Low-opacity Editorial Grid Linework */}
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.03]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="pillars-grid"
                width="64"
                height="64"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 64 0 L 0 0 0 64"
                  fill="none"
                  stroke="#C3CDD5"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pillars-grid)" />
          </svg>
        </div>
      </div>

      {/* 3. Section Content - Scrolls smoothly over the static background */}
      <Container wide className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12 mb-14 sm:mb-16 lg:mb-20">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-3.5">
              <span className="h-[2px] w-12 bg-hero-gold origin-left" />
              <span
                className="text-xs sm:text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-hero-gold"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                What We Offer
              </span>
            </div>

            {/* Main Heading */}
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4.1rem] leading-[1.06] font-normal text-white tracking-[-0.015em]"
              style={{ fontFamily: "var(--font-hero-serif)" }}
            >
              Turning ideas into <br />
              <span className="italic font-medium text-white/95">meaningful impact.</span>
            </h2>
          </div>

          {/* Supporting Description */}
          <p
            className="text-sm sm:text-base text-[#C3CDD5] leading-relaxed max-w-lg font-light lg:pb-1"
            style={{ fontFamily: "var(--font-hero-sans)" }}
          >
            AIPP connects research, strategic engagement and public advocacy to
            advance women&apos;s participation in diplomacy, policy and public life.
          </p>
        </div>

        {/* 4. Three Offering Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {OFFERINGS.map((item, index) => (
            <Link
              key={item.number}
              href={item.ctaHref}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/12 bg-[#081D2E]/85 backdrop-blur-md p-5 sm:p-7 transition-all duration-500 hover:border-hero-gold/60 hover:bg-[#0c263c]/90 hover:shadow-[0_20px_50px_rgba(8,29,46,0.85),0_0_35px_rgba(176,156,75,0.15)] hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-hero-gold ${
                index === 2 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Top Animated Gold Accent Border Line */}
              <div className="absolute inset-x-0 top-0 h-[2.5px] w-full bg-gradient-to-r from-transparent via-hero-gold/30 to-transparent transition-all duration-500 group-hover:via-hero-gold group-hover:h-[3px]" />

              {/* Upper Section: Index & Stage Name */}
              <div>
                <div className="flex items-baseline justify-between border-b border-white/10 pb-4 mb-5">
                  <span
                    className="text-3xl sm:text-4xl font-normal text-hero-gold tracking-tight"
                    style={{ fontFamily: "var(--font-hero-serif)" }}
                  >
                    {item.number}
                  </span>
                  <span
                    className="text-[0.6875rem] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#C3CDD5]/80 group-hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    {item.stageName}
                  </span>
                </div>

                {/* Integrated Women-Focused Photo Frame */}
                <div className="relative w-full h-44 sm:h-52 min-h-[176px] overflow-hidden rounded-lg border border-white/10 mb-5 bg-[#081D2E]">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.92] group-hover:brightness-105"
                  />
                  {/* Atmospheric Photo Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E]/80 via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none" />
                </div>

                {/* Offering Statement */}
                <h3
                  className="text-xl sm:text-2xl font-normal text-white mb-2.5 tracking-[-0.01em] transition-colors duration-300 group-hover:text-hero-gold-light"
                  style={{ fontFamily: "var(--font-hero-serif)" }}
                >
                  {item.statement}
                </h3>

                {/* Description */}
                <p
                  className="text-xs sm:text-[0.84rem] text-[#C3CDD5] leading-relaxed font-light mb-6"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  {item.description}
                </p>
              </div>

              {/* Lower Section: Action CTA with Arrow */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs sm:text-[0.8125rem] font-semibold tracking-wide text-white transition-colors duration-300 group-hover:text-hero-gold">
                <span
                  className="uppercase tracking-[0.12em]"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  {item.ctaText}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all duration-300 group-hover:border-hero-gold group-hover:bg-hero-gold group-hover:text-[#081D2E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 5. Institutional Accreditation / Bottom Grounding Bar */}
        <div className="mt-12 sm:mt-16 lg:mt-20 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#C3CDD5]/70">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-hero-gold animate-pulse" />
            <span
              className="tracking-wider uppercase font-medium"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              Athena Institute for Political Praxis
            </span>
          </div>
          <div
            className="flex flex-wrap items-center gap-x-4 sm:gap-6 gap-y-1 text-[0.7rem] uppercase tracking-[0.14em] text-[#C3CDD5]/60"
            style={{ fontFamily: "var(--font-hero-sans)" }}
          >
            <span>01 Research</span>
            <span>•</span>
            <span>02 Simulation</span>
            <span>•</span>
            <span>03 Advocacy</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
