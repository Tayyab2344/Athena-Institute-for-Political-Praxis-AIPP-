"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import Container from "@/components/ui/Container";
import { OFFER_PILLARS, PIPELINE_STAGES } from "@/data/offerData";
import { useOfferReveal } from "@/components/what-we-offer/useOfferReveal";
import OfferCTA from "@/components/what-we-offer/OfferCTA";
import "@/app/what-we-offer/offer.css";

export default function WhatWeOfferPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      {/* ═══ SECTION 1: HERO ═══ */}
      <OverviewHero />

      {/* ═══ SECTION 2: THE AIPP OFFERING SYSTEM ═══ */}
      <OfferingSystem />

      {/* ═══ SECTIONS 3-5: THREE PILLAR EDITORIAL BLOCKS ═══ */}
      {OFFER_PILLARS.map((pillar, index) => (
        <PillarEditorialBlock key={pillar.slug} pillar={pillar} index={index} />
      ))}

      {/* ═══ SECTION 6: HOW THE THREE PILLARS CONNECT ═══ */}
      <PillarFlowSection />

      {/* ═══ SECTION 7: CROSS-PILLAR CTA ═══ */}
      <OfferCTA
        headline="Have an idea that deserves to move forward?"
        description="AIPP is built for ideas that need research, strategy and a public voice. If you have something to explore, we'd like to hear it."
        ctaText="Start a Conversation"
        ctaHref="/#contact"
      />

      <Footer onOpenContact={() => setIsContactOpen(true)} />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </main>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* OVERVIEW HERO                                              */
/* ─────────────────────────────────────────────────────────── */
function OverviewHero() {
  const [headRef, headVisible] = useOfferReveal();
  const [imgRef, imgVisible] = useOfferReveal();

  return (
    <section
      className="relative overflow-hidden border-b border-border pt-28 pb-14 md:pt-36 md:pb-20 lg:pt-40 lg:pb-28"
      aria-label="What We Offer — Hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7F7F7] via-white to-[#F7F7F7]" />

      <Container wide className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[0.52fr_0.48fr] lg:gap-14 xl:gap-20">
          {/* Text */}
          <div
            ref={headRef}
            className="offer-entrance max-w-2xl"
            data-visible={headVisible}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-10 bg-[var(--hero-gold)]" />
              <span
                className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[var(--hero-slate)]"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                What We Offer
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-[3.5rem] xl:text-[4rem] leading-[1.06] font-normal tracking-[-0.015em]"
              style={{
                fontFamily: "var(--font-hero-serif)",
                color: "var(--hero-navy)",
              }}
            >
              Turning Ideas Into{" "}
              <em className="not-italic font-medium" style={{ color: "var(--hero-navy)" }}>
                Influence.
              </em>
            </h1>

            <p
              className="mt-6 text-sm sm:text-base leading-relaxed max-w-lg font-light"
              style={{
                fontFamily: "var(--font-hero-sans)",
                color: "var(--hero-muted)",
              }}
            >
              AIPP brings together research, strategy and public advocacy to
              help women shape the conversations and decisions that define our
              shared future.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <Link
                href="#offering-system"
                className="inline-flex items-center gap-2 text-[var(--hero-navy)] text-xs font-semibold uppercase tracking-[0.12em] hover:text-[var(--hero-gold)] transition-colors"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                Explore below
                <ArrowDown className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Image */}
          <div
            ref={imgRef}
            className="offer-entrance-scale relative"
            data-visible={imgVisible}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4] overflow-hidden bg-[var(--color-background-muted)]">
              <Image
                src="/offer-women-summit.jpg"
                alt="Women leaders and delegates at an international diplomatic summit"
                fill
                sizes="(max-width: 768px) 100vw, 48vw"
                priority
                className="object-cover object-[center_35%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--hero-navy)]/25 via-transparent to-transparent" />
            </div>
            <span className="absolute -left-3 top-8 hidden h-20 w-px bg-[var(--hero-navy)]/15 lg:block" />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* THE AIPP OFFERING SYSTEM                                    */
/* ─────────────────────────────────────────────────────────── */
function OfferingSystem() {
  const [ref, visible] = useOfferReveal();

  return (
    <section
      id="offering-system"
      className="aipp-section scroll-mt-20"
      aria-label="Three Ways We Turn Ideas Into Action"
    >
      <Container>
        <div
          ref={ref}
          className="offer-entrance mb-12 lg:mb-16"
          data-visible={visible}
        >
          <p
            className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] mb-4"
            style={{
              fontFamily: "var(--font-hero-sans)",
              color: "var(--hero-gold)",
            }}
          >
            The AIPP Ecosystem
          </p>
          <h2
            className="text-2xl sm:text-3xl lg:text-[2.5rem] font-normal leading-[1.1] max-w-2xl"
            style={{
              fontFamily: "var(--font-hero-serif)",
              color: "var(--hero-navy)",
            }}
          >
            Three Ways We Turn Ideas Into Action
          </h2>
          <p
            className="mt-5 text-sm sm:text-base leading-relaxed max-w-xl font-light"
            style={{
              fontFamily: "var(--font-hero-sans)",
              color: "var(--hero-muted)",
            }}
          >
            AIPP works across research, strategy and communication — three
            interconnected practices that together create the conditions for ideas
            to become public influence.
          </p>
        </div>

        {/* Three Pillar Editorial Blocks */}
        <div className="offer-stagger space-y-0" data-visible={visible}>
          {OFFER_PILLARS.map((pillar) => (
            <Link
              key={pillar.slug}
              href={pillar.route}
              className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 py-7 sm:py-9 border-b border-[var(--color-border)] transition-colors hover:bg-[rgba(13,44,73,0.015)] px-0 sm:px-4"
            >
              {/* Number */}
              <span
                className="text-4xl sm:text-5xl font-normal leading-none transition-colors duration-300 group-hover:text-[var(--hero-gold)]"
                style={{
                  fontFamily: "var(--font-hero-serif)",
                  color: "rgba(13, 44, 73, 0.15)",
                }}
              >
                {pillar.number}
              </span>

              {/* Title & Description */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-xl sm:text-2xl lg:text-[1.625rem] font-medium leading-[1.2] transition-colors duration-300 group-hover:text-[var(--hero-gold)]"
                  style={{
                    fontFamily: "var(--font-hero-serif)",
                    color: "var(--hero-navy)",
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed max-w-md font-light"
                  style={{
                    fontFamily: "var(--font-hero-sans)",
                    color: "var(--hero-muted)",
                  }}
                >
                  {pillar.shortDescription}
                </p>
              </div>

              {/* Arrow */}
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] transition-all duration-300 group-hover:border-[var(--hero-gold)] group-hover:bg-[var(--hero-gold)] group-hover:text-white">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* PILLAR EDITORIAL BLOCKS (Sections 3-5)                      */
/* ─────────────────────────────────────────────────────────── */
function PillarEditorialBlock({
  pillar,
  index,
}: {
  pillar: (typeof OFFER_PILLARS)[number];
  index: number;
}) {
  const [ref, visible] = useOfferReveal();
  const isEven = index % 2 === 0;

  return (
    <section
      className={`aipp-section ${isEven ? "surface-muted" : ""}`}
      aria-label={pillar.title}
    >
      <Container wide>
        <div
          ref={ref}
          className={`offer-entrance grid items-center gap-10 lg:gap-16 xl:gap-20 ${
            isEven
              ? "lg:grid-cols-[0.55fr_0.45fr]"
              : "lg:grid-cols-[0.45fr_0.55fr]"
          }`}
          data-visible={visible}
        >
          {/* Text Column */}
          <div className={!isEven ? "lg:order-2" : ""}>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-10 bg-[var(--hero-gold)]" />
              <span
                className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[var(--hero-slate)]"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                {pillar.number} / {pillar.shortTitle}
              </span>
            </div>

            <h2
              className="text-2xl sm:text-3xl lg:text-[2.25rem] font-normal leading-[1.12] max-w-xl"
              style={{
                fontFamily: "var(--font-hero-serif)",
                color: "var(--hero-navy)",
              }}
            >
              {pillar.tagline}
            </h2>

            <p
              className="mt-5 text-sm sm:text-base leading-relaxed max-w-md font-light"
              style={{
                fontFamily: "var(--font-hero-sans)",
                color: "var(--hero-muted)",
              }}
            >
              {pillar.longDescription}
            </p>

            {/* Capabilities preview */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pillar.capabilities.slice(0, 6).map((cap) => (
                <span
                  key={cap.number}
                  className="text-xs font-medium py-2 px-3 border border-[var(--color-border)] text-[var(--hero-navy)] bg-white/60"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  {cap.title}
                </span>
              ))}
            </div>

            <Link
              href={pillar.route}
              className="group inline-flex items-center gap-2 mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--hero-navy)] hover:text-[var(--hero-gold)] transition-colors"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              {pillar.ctaText}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Image Column */}
          <div className={!isEven ? "lg:order-1" : ""}>
            <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[var(--color-background-muted)]">
              <Image
                src={pillar.image}
                alt={pillar.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--hero-navy)]/15 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* HOW THE THREE PILLARS CONNECT                               */
/* ─────────────────────────────────────────────────────────── */
function PillarFlowSection() {
  const [ref, visible] = useOfferReveal();

  const flowSteps = [
    {
      icon: "01",
      label: "Research",
      sublabel: "produces insight",
      color: "var(--hero-navy)",
    },
    {
      icon: "02",
      label: "Strategy",
      sublabel: "shapes action",
      color: "var(--hero-navy)",
    },
    {
      icon: "03",
      label: "Communication",
      sublabel: "creates public influence",
      color: "var(--hero-navy)",
    },
  ];

  return (
    <section
      className="aipp-section surface-muted"
      aria-label="How the three pillars connect"
    >
      <Container>
        <div
          ref={ref}
          className="offer-entrance text-center mb-12 lg:mb-16"
          data-visible={visible}
        >
          <p
            className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] mb-4"
            style={{
              fontFamily: "var(--font-hero-sans)",
              color: "var(--hero-gold)",
            }}
          >
            The Connected System
          </p>
          <h2
            className="text-2xl sm:text-3xl lg:text-[2.5rem] font-normal leading-[1.1] max-w-xl mx-auto"
            style={{
              fontFamily: "var(--font-hero-serif)",
              color: "var(--hero-navy)",
            }}
          >
            Ideas become influence through a connected practice.
          </h2>
        </div>

        {/* Flow Visualization */}
        <div className="pillar-flow offer-stagger max-w-lg mx-auto" data-visible={visible}>
          {flowSteps.map((step, i) => (
            <span key={step.label} className="contents">
              <div className="pillar-flow-node">
                <span
                  className="text-2xl font-normal shrink-0"
                  style={{
                    fontFamily: "var(--font-hero-serif)",
                    color: "var(--hero-gold)",
                  }}
                >
                  {step.icon}
                </span>
                <div className="text-left">
                  <span
                    className="text-lg font-medium block"
                    style={{
                      fontFamily: "var(--font-hero-serif)",
                      color: step.color,
                    }}
                  >
                    {step.label}
                  </span>
                  <span
                    className="text-xs font-light block mt-0.5"
                    style={{
                      fontFamily: "var(--font-hero-sans)",
                      color: "var(--hero-muted)",
                    }}
                  >
                    {step.sublabel}
                  </span>
                </div>
              </div>
              {i < flowSteps.length - 1 && (
                <div className="pillar-flow-connector">
                  <div className="pillar-flow-connector-line" />
                  <div className="pillar-flow-connector-arrow" />
                </div>
              )}
            </span>
          ))}

          {/* Final result node */}
          <div className="pillar-flow-connector">
            <div className="pillar-flow-connector-line" />
            <div className="pillar-flow-connector-arrow" />
          </div>
          <div className="pillar-flow-node bg-[var(--hero-navy)] text-white border-[var(--hero-navy)]">
            <span
              className="text-lg font-medium"
              style={{ fontFamily: "var(--font-hero-serif)" }}
            >
              Public Influence
            </span>
            <span
              className="text-xs font-light text-white/70 ml-4"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              Ideas that shape conversations and decisions
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
