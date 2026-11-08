"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { useOfferReveal } from "./useOfferReveal";

interface OfferHeroProps {
  label: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
}

/**
 * Shared hero component for pillar detail pages.
 * Cinematic editorial layout with large typography and women-focused imagery.
 */
export default function OfferHero({
  label,
  headline,
  description,
  image,
  imageAlt,
}: OfferHeroProps) {
  const [headRef, headVisible] = useOfferReveal();
  const [imgRef, imgVisible] = useOfferReveal();

  return (
    <section
      className="relative overflow-hidden border-b border-border pt-28 pb-14 md:pt-36 md:pb-20 lg:pt-40 lg:pb-24"
      aria-label={headline}
    >
      {/* Subtle navy background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7F7F7] via-white to-[#F7F7F7]" />

      <Container wide className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[0.55fr_0.45fr] lg:gap-16 xl:gap-20">
          {/* Text Column */}
          <div
            ref={headRef}
            className="offer-entrance max-w-2xl"
            data-visible={headVisible}
          >
            {/* Eyebrow Label */}
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-10 bg-[var(--hero-gold)]" />
              <span
                className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[var(--hero-slate)]"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                {label}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem] leading-[1.06] font-normal tracking-[-0.015em]"
              style={{
                fontFamily: "var(--font-hero-serif)",
                color: "var(--hero-navy)",
              }}
            >
              {headline}
            </h1>

            {/* Description */}
            <p
              className="mt-6 text-sm sm:text-base leading-relaxed max-w-lg font-light"
              style={{
                fontFamily: "var(--font-hero-sans)",
                color: "var(--hero-muted)",
              }}
            >
              {description}
            </p>
          </div>

          {/* Image Column */}
          <div
            ref={imgRef}
            className="offer-entrance-scale relative"
            data-visible={imgVisible}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden bg-[var(--color-background-muted)]">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                priority
                className="object-cover object-center"
              />
              {/* Subtle navy overlay for editorial quality */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--hero-navy)]/20 via-transparent to-transparent" />
            </div>

            {/* Decorative editorial elements */}
            <span className="absolute -left-3 top-8 hidden h-20 w-px bg-[var(--hero-navy)]/15 lg:block" />
            <div
              className="absolute -bottom-3 right-4 sm:-bottom-4 sm:right-6 flex items-center gap-2 px-3 py-2 border border-[var(--color-border)] bg-white shadow-sm"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--hero-gold)]" />
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[var(--hero-slate)]">
                AIPP
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
