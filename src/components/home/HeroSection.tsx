"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import Container from "@/components/ui/Container";

/* ─────────────────────────────────────────────────────────────
   Section 2: Hero
   - Cinematic editorial layout with commanding typography (64-80px desktop)
   - One powerful headline communicating AIPP's purpose immediately
   - One short supporting paragraph (≤ 2 lines on desktop, 18-20px)
   - One primary CTA and one secondary CTA
   - One excellent editorial photograph of a woman diplomat in leadership
   - Generous whitespace, zero clutter
   ───────────────────────────────────────────────────────────── */

export default function HeroSection() {
  return (
    <section
      className="relative w-full bg-white text-[#081D2E] pt-28 sm:pt-36 lg:pt-40 pb-20 sm:pb-28 lg:pb-32 overflow-hidden border-b border-[#D9DEE2]/60"
      aria-label="AIPP Introduction Hero"
    >
      <Container wide>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Typography & Intentional Action (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Subtle Eyebrow Marker */}
            <div className="hero-animate-eyebrow flex items-center gap-3 mb-6">
              <span className="h-px w-6 bg-[#B09C4B]" />
              <span
                className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Athena Institute for Political Praxis
              </span>
            </div>

            {/* Powerful Headline: 64-80px Desktop, 42-52px Mobile */}
            <h1
              className="hero-animate-heading text-[2.625rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.25rem] xl:text-[4.75rem] font-normal leading-[1.06] tracking-tight text-[#0D2C49] text-balance mb-6 sm:mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Women shaping the conversations that shape our world.
            </h1>

            {/* Supporting Paragraph: 18-20px, max 2 lines on desktop */}
            <p
              className="hero-animate-body text-lg sm:text-[1.1875rem] lg:text-[1.25rem] leading-relaxed text-[#243748] font-normal max-w-2xl mb-8 sm:mb-10"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Advancing empirical research, strategic crisis simulation, and public advocacy to elevate women leaders in multilateral diplomacy and global statecraft.
            </p>

            {/* Dual CTAs: Clear, Confident, Restrained */}
            <div className="hero-animate-cta flex flex-wrap items-center gap-4 sm:gap-5">
              <a
                href="#what-we-offer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-7 py-3.5 text-base font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#081D2E] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>Explore Our Work</span>
                <ArrowDown className="h-4 w-4 text-[#B09C4B] transition-transform duration-200 group-hover:translate-y-0.5" />
              </a>

              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#D9DEE2] bg-white px-7 py-3.5 text-base font-semibold text-[#081D2E] transition-all duration-200 hover:border-[#0D2C49] hover:bg-[#F7F7F7] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>About the Institute</span>
                <ArrowUpRight className="h-4 w-4 text-[#64717C] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Photograph (5 cols) */}
          <div className="hero-animate-image lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">

              {/* Outer Decorative Frame Accent (Subtle, Muted Gold) */}
              <div className="relative overflow-hidden rounded-xs border border-[#D9DEE2] bg-[#F7F7F7] p-2 shadow-sm">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden bg-[#0D2C49]">
                  <Image
                    src="/hero-diplomat.jpg"
                    alt="Senior woman diplomat addressing an international policy assembly"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
                    className="object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
                  />
                  {/* Subtle Gradient Veil at base for caption legibility */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081D2E]/90 via-[#081D2E]/40 to-transparent p-6 pt-16">
                    <p
                      className="text-xs uppercase tracking-widest text-[#B09C4B] font-semibold"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      Diplomatic Leadership
                    </p>
                    <p
                      className="text-sm sm:text-base text-white/95 font-medium mt-1 leading-snug"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Multilateral accords endure longer when women lead negotiation delegations.
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

