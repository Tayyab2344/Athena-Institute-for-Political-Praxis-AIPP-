"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";

/* ─────────────────────────────────────────────────────────────
   About Page - Section 1: Hero
   - Sophisticated editorial hero with tight, disciplined spacing
   - Large typography (64-80px desktop, 42-52px mobile)
   - Reliable local photography to prevent blank gaps
   ───────────────────────────────────────────────────────────── */

export default function AboutHero() {
  return (
    <section
      className="relative w-full bg-white text-[#081D2E] pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden border-b border-[#D9DEE2]/60"
      aria-label="About AIPP Hero"
    >
      <Container wide>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Typography & Intentional Action (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Eyebrow Marker */}
            <div className="hero-animate-eyebrow flex items-center gap-3 mb-4 sm:mb-6">
              <span className="h-px w-6 bg-[#B09C4B]" />
              <span
                className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                About the Institute
              </span>
            </div>

            {/* Powerful Headline: 64-80px Desktop, 42-52px Mobile */}
            <h1
              className="hero-animate-heading text-[2.625rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.25rem] font-normal leading-[1.06] tracking-tight text-[#0D2C49] text-balance mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Women shaping diplomacy, policy, and public action.
            </h1>

            {/* Short Supporting Paragraph: 18-20px */}
            <p
              className="hero-animate-body text-lg sm:text-[1.1875rem] leading-relaxed text-[#243748] font-normal max-w-2xl mb-8"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              The Athena Institute for Political Praxis connects rigorous policy research, strategic negotiation training, and public advocacy to ensure women hold decisive mandates in global governance.
            </p>

            {/* Dual Restrained CTAs */}
            <div className="hero-animate-cta flex flex-wrap items-center gap-4">
              <a
                href="#who-we-are"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-base font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#081D2E] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>Discover AIPP</span>
                <ArrowDown className="h-4 w-4 text-[#B09C4B] transition-transform duration-200 group-hover:translate-y-0.5" />
              </a>

              <Link
                href="/what-we-offer"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#D9DEE2] bg-white px-6 py-3 text-base font-semibold text-[#081D2E] transition-all duration-200 hover:border-[#0D2C49] hover:bg-[#F7F7F7] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>What We Offer</span>
                <ArrowUpRight className="h-4 w-4 text-[#64717C] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Photograph (5 cols) */}
          <div className="hero-animate-image lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">

              <div className="relative overflow-hidden rounded-xs border border-[#D9DEE2] bg-[#F7F7F7] p-2 shadow-sm">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden bg-[#0D2C49]">
                  <Image
                    src="/ideas-strategy.jpg"
                    alt="Senior women diplomatic leaders in strategic multilateral consultation"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
                    className="object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081D2E]/90 via-[#081D2E]/40 to-transparent p-5 pt-14">
                    <p
                      className="text-xs uppercase tracking-widest text-[#B09C4B] font-semibold"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      Institutional Praxis
                    </p>
                    <p
                      className="text-sm sm:text-base text-white/95 font-medium mt-1 leading-snug"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Research becomes public action when women hold decisive seats at the table.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
