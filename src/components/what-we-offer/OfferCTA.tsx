"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { useOfferReveal } from "./useOfferReveal";

interface OfferCTAProps {
  headline: string;
  description?: string;
  ctaText: string;
  ctaHref: string;
  tone?: "navy" | "gold" | "muted";
}

/**
 * Full-width CTA section for pillar pages and overview.
 * Deep navy background with editorial typography.
 */
export default function OfferCTA({
  headline,
  description,
  ctaText,
  ctaHref,
  tone = "navy",
}: OfferCTAProps) {
  const [ref, visible] = useOfferReveal();

  const bgClass =
    tone === "navy"
      ? "bg-[var(--hero-navy-dark)]"
      : tone === "gold"
        ? "bg-[var(--hero-navy)]"
        : "bg-[var(--color-background-muted)]";

  const textClass = tone === "muted" ? "text-[var(--hero-navy)]" : "text-white";
  const mutedTextClass = tone === "muted" ? "text-[var(--hero-muted)]" : "text-white/70";

  return (
    <section
      className={`relative overflow-hidden py-20 sm:py-24 lg:py-32 ${bgClass}`}
      ref={ref}
    >
      <Container wide>
        <div
          className="offer-entrance flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16"
          data-visible={visible}
        >
          <div className="max-w-2xl">
            <h2
              className={`text-2xl sm:text-3xl lg:text-[2.75rem] xl:text-[3.25rem] font-normal leading-[1.08] ${textClass}`}
              style={{ fontFamily: "var(--font-hero-serif)" }}
            >
              {headline}
            </h2>
            {description && (
              <p
                className={`mt-5 text-sm sm:text-base leading-relaxed max-w-lg font-light ${mutedTextClass}`}
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                {description}
              </p>
            )}
          </div>

          <Link
            href={ctaHref}
            className={`group inline-flex items-center gap-3 shrink-0 px-7 py-3.5 rounded-full font-semibold text-xs uppercase tracking-[0.12em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hero-gold)] ${
              tone === "muted"
                ? "bg-[var(--hero-navy)] text-white hover:bg-[var(--hero-navy-dark)]"
                : "bg-white text-[var(--hero-navy)] hover:bg-[var(--hero-gold)] hover:text-[var(--hero-navy-dark)]"
            }`}
            style={{ fontFamily: "var(--font-hero-sans)" }}
          >
            {ctaText}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>

      {/* Decorative gold accent line */}
      {tone !== "muted" && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--hero-gold)]/30 to-transparent" />
      )}
    </section>
  );
}
