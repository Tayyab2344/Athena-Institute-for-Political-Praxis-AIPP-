"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ─────────────────────────────────────────────────────────────
   What We Offer — Redesigned with the Frontend Design Skill
   - Editorial, minimal, and authoritative institutional presentation
   - Three interconnected pillars of women's leadership praxis:
     1. Research & Policy Innovation
     2. Strategic Action & Simulation
     3. Communications & Public Advocacy
   - High-craft typography (Cormorant Garamond + Manrope)
   - Verified local imagery, disciplined spacing, and zero generic AI tells
   ───────────────────────────────────────────────────────────── */

const PILLARS_DETAIL = [
  {
    number: "01",
    slug: "research-policy-innovation",
    title: "Research & Policy Innovation",
    discipline: "Empirical Investigation",
    route: "/what-we-offer/research-policy-innovation",
    tagline: "Knowledge that informs diplomatic action.",
    description:
      "AIPP conducts independent empirical investigation, institutional audits, and geopolitical risk analysis to equip women negotiators with data-driven authority in multilateral treaty design.",
    focusAreas: [
      "Bilateral Conflict Mapping",
      "Gender Mainstreaming in Treaties",
      "Institutional Representation Audits",
      "Policy Briefs & Security Monographs",
    ],
    image: "/ideas-research.jpg",
    imageAlt: "Woman researcher examining policy documents in an institutional setting",
    ctaText: "Explore Research & Policy Innovation",
  },
  {
    number: "02",
    slug: "strategic-action-simulation",
    title: "Strategic Action & Simulation",
    discipline: "Crisis Preparedness",
    route: "/what-we-offer/strategic-action-simulation",
    tagline: "High-stakes statecraft tested in real time.",
    description:
      "We pioneer immersive diplomatic simulation labs, negotiation war-rooms, and multilateral scenario exercises where women leaders test tactical leverage, deadlock-breaking, and strategic bargaining.",
    focusAreas: [
      "Diplomatic Crisis Negotiation Labs",
      "Multilateral Summit Simulations",
      "Deadlock-Breaking War Rooms",
      "Executive Bilateral Fellowships",
    ],
    image: "/ideas-strategy.jpg",
    imageAlt: "Women leaders engaged in a diplomatic simulation exercise",
    ctaText: "Explore Strategic Action & Simulation",
  },
  {
    number: "03",
    slug: "communications-public-advocacy",
    title: "Communications & Public Advocacy",
    discipline: "Public Influence",
    route: "/what-we-offer/communications-public-advocacy",
    tagline: "Elevating female authority in the global square.",
    description:
      "We amplify women's voices in international foreign policy discourse through strategic media partnerships, ambassadorial summits, legislative testimony, and multilateral public dialogue.",
    focusAreas: [
      "Global Press & Policy Summits",
      "Ambassadorial Dialogues",
      "Opinion Editorial Syndication",
      "Legislative & Treaty Advocacy",
    ],
    image: "/ideas-advocacy.jpg",
    imageAlt: "Women leaders speaking at an international diplomacy forum",
    ctaText: "Explore Communications & Public Advocacy",
  },
];

export default function WhatWeOfferPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactPathway, setContactPathway] = useState("General Inquiry");

  const handleOpenContact = (pathway?: string) => {
    setContactPathway(pathway || "Institutional Collaboration");
    setIsContactOpen(true);
  };

  return (
    <main className="min-h-screen bg-white text-[#081D2E] flex flex-col font-sans selection:bg-[#0D2C49] selection:text-white">
      {/* Global Navigation */}
      <Navbar onOpenContact={() => handleOpenContact("General Inquiry")} />

      {/* ═══ SECTION 1: HERO ═══ */}
      <section
        className="relative w-full bg-white text-[#081D2E] pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden border-b border-[#D9DEE2]/60"
        aria-label="What We Offer Hero"
      >
        <Container wide>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Typography & Intentional Action (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="hero-animate-eyebrow flex items-center gap-3 mb-4 sm:mb-6">
                <span className="h-px w-6 bg-[#B09C4B]" />
                <span
                  className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  The AIPP Ecosystem
                </span>
              </div>

              <h1
                className="hero-animate-heading text-[2.625rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.25rem] font-normal leading-[1.06] tracking-tight text-[#0D2C49] text-balance mb-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Three dimensions of institutional statecraft.
              </h1>

              <p
                className="hero-animate-body text-lg sm:text-[1.1875rem] leading-relaxed text-[#243748] font-normal max-w-2xl mb-8"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                The Athena Institute for Political Praxis connects independent policy research, immersive crisis simulation labs, and strategic advocacy to equip women leaders for the highest levels of international affairs.
              </p>

              <div className="hero-animate-cta flex flex-wrap items-center gap-4">
                <a
                  href="#pillars"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-base font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#081D2E] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>Explore the Pillars</span>
                  <ArrowDown className="h-4 w-4 text-[#B09C4B] transition-transform duration-200 group-hover:translate-y-0.5" />
                </a>

                <button
                  type="button"
                  onClick={() => handleOpenContact("Institutional Collaboration")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9DEE2] bg-white px-6 py-3 text-base font-semibold text-[#081D2E] transition-all duration-200 hover:border-[#0D2C49] hover:bg-[#F7F7F7] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>Start a Collaboration</span>
                  <ArrowUpRight className="h-4 w-4 text-[#64717C]" />
                </button>
              </div>
            </div>

            {/* Right Column: Editorial Photograph (5 cols) */}
            <div className="hero-animate-image lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="relative overflow-hidden rounded-xs border border-[#D9DEE2] bg-[#F7F7F7] p-2 shadow-sm">
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden bg-[#0D2C49]">
                    <Image
                      src="/offer-women-summit.jpg"
                      alt="Women leaders and delegates in diplomatic consultation at international peace summit"
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
                        Institutional Impact
                      </p>
                      <p
                        className="text-sm sm:text-base text-white/95 font-medium mt-1 leading-snug"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Empowering women negotiators to lead enduring multilateral agreements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ═══ SECTION 2: THREE PILLARS EDITORIAL SHOWCASE ═══ */}
      <section
        id="pillars"
        className="relative w-full bg-[#F7F7F7] text-[#081D2E] py-12 sm:py-16 lg:py-20 border-b border-[#D9DEE2]/80 scroll-mt-20 overflow-hidden"
        aria-label="Our Three Pillars"
      >
        <Container wide>
          {/* Section Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span className="h-px w-6 bg-[#B09C4B]" />
              <span
                className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Core Pillars
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-[3rem] font-normal leading-[1.12] tracking-tight text-[#0D2C49]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Independent centers of excellence, unified in purpose.
            </h2>

            <p
              className="mt-3 text-base sm:text-lg text-[#243748] font-normal leading-relaxed"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Each pillar provides dedicated methodology, practical tools, and institutional access to advance women across foreign policy decision-making.
            </p>
          </div>

          {/* Pillars Editorial Deep-Dive Stacks */}
          <div className="space-y-10 sm:space-y-14">
            {PILLARS_DETAIL.map((pillar, index) => {
              const isEven = index % 2 === 0;

              return (
                <ScrollReveal
                  key={pillar.slug}
                  variant="fade-up"
                  delay={index * 80}
                  className="bg-white border border-[#D9DEE2] rounded-xs p-6 sm:p-8 lg:p-10 shadow-xs"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Text Column (7 cols) */}
                    <div className={`space-y-5 lg:col-span-7 ${!isEven ? "lg:order-2" : ""}`}>
                      <div className="flex items-center gap-4">
                        <span
                          className="text-2xl sm:text-3xl font-light text-[#B09C4B]"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          {pillar.number}
                        </span>
                        <span
                          className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49] bg-[#F7F7F7] px-3 py-1 rounded-full border border-[#D9DEE2]"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {pillar.discipline}
                        </span>
                      </div>

                      <h3
                        className="text-2xl sm:text-3xl font-normal text-[#0D2C49] leading-tight"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {pillar.title}
                      </h3>

                      <p
                        className="text-base sm:text-lg text-[#0D2C49] font-medium leading-snug italic"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        &ldquo;{pillar.tagline}&rdquo;
                      </p>

                      <p
                        className="text-base text-[#243748] font-normal leading-relaxed max-w-xl"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {pillar.description}
                      </p>

                      {/* Capabilities Focus Points */}
                      <div className="pt-2">
                        <span
                          className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49] block mb-2"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          Core Capabilities
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#243748]">
                          {pillar.focusAreas.map((area) => (
                            <li key={area} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#B09C4B] shrink-0" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4">
                        <Link
                          href={pillar.route}
                          className="inline-flex items-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-xs hover:bg-[#081D2E] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          <span>{pillar.ctaText}</span>
                          <ArrowUpRight className="h-4 w-4 text-[#B09C4B]" />
                        </Link>
                      </div>
                    </div>

                    {/* Image Column (5 cols) */}
                    <div className={`lg:col-span-5 ${!isEven ? "lg:order-1" : ""}`}>
                      <div className="relative overflow-hidden rounded-xs border border-[#D9DEE2] bg-[#F7F7F7] p-2 shadow-xs">
                        <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[#0D2C49]">
                          <Image
                            src={pillar.image}
                            alt={pillar.imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 480px"
                            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ═══ SECTION 3: THE CONNECTED SYSTEM (HOW THEY INTERCONNECT) ═══ */}
      <section
        className="relative w-full bg-white text-[#081D2E] py-12 sm:py-16 lg:py-20 border-b border-[#D9DEE2]/80 overflow-hidden"
        aria-label="How the Pillars Connect"
      >
        <Container wide>
          <div className="max-w-3xl mb-10 sm:mb-14">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span className="h-px w-6 bg-[#B09C4B]" />
              <span
                className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Connected Methodology
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-[3rem] font-normal leading-[1.12] tracking-tight text-[#0D2C49]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Ideas become influence through a connected practice.
            </h2>

            <p
              className="mt-3 text-base sm:text-lg text-[#243748] font-normal leading-relaxed"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Our three pillars reinforce one another, ensuring that policy investigation is grounded in reality, tested under pressure, and elevated to international decision-makers.
            </p>
          </div>

          {/* 3 Interconnected Stages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 border-t border-[#D9DEE2] pt-8 sm:pt-10">
            
            <div className="space-y-3 p-6 bg-[#F7F7F7] border border-[#D9DEE2] rounded-xs">
              <span
                className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Phase 01 · Inquiry
              </span>
              <h3
                className="text-xl font-normal text-[#0D2C49]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Research Produces Evidence
              </h3>
              <p
                className="text-sm text-[#243748] leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Empirical investigation reveals systemic hurdles and establishes rigorous metrics for how women negotiators impact treaty outcomes.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-[#F7F7F7] border border-[#D9DEE2] rounded-xs">
              <span
                className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Phase 02 · Simulation
              </span>
              <h3
                className="text-xl font-normal text-[#0D2C49]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Strategy Tests Execution
              </h3>
              <p
                className="text-sm text-[#243748] leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Diplomatic war-rooms and simulation labs translate evidence into real-world tactical poise, deadlock breaking, and crisis consensus.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-[#F7F7F7] border border-[#D9DEE2] rounded-xs">
              <span
                className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Phase 03 · Advocacy
              </span>
              <h3
                className="text-xl font-normal text-[#0D2C49]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Public Influence Delivers Accords
              </h3>
              <p
                className="text-sm text-[#243748] leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Strategic summits and media dialogues build institutional consensus to place women at the head of bilateral and multilateral delegations.
              </p>
            </div>

          </div>
        </Container>
      </section>

      {/* ═══ SECTION 4: CLOSING CTA ═══ */}
      <section
        className="relative w-full bg-[#0D2C49] text-white py-14 sm:py-18 lg:py-20 overflow-hidden"
        aria-label="Engage With AIPP Offerings"
      >
        <Container wide>
          <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs uppercase tracking-widest text-[#B09C4B] font-semibold">
              Institutional Partnership
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-[3rem] font-normal leading-[1.12] tracking-tight text-white text-balance"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Have a policy initiative that deserves to move forward?
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed text-white/80 font-normal max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              AIPP partners with foreign ministries, diplomatic institutes, international organizations, and universities to advance women leaders across research, crisis simulation, and public statecraft.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleOpenContact("Institutional Collaboration")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B09C4B] px-8 py-4 text-base font-semibold text-[#081D2E] shadow-xs transition-all duration-200 hover:bg-white hover:text-[#081D2E] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>Start a Conversation</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>About AIPP</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Global Footer & Interactive Contact Modal */}
      <Footer onOpenContact={() => handleOpenContact("General Inquiry")} />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultPathway={contactPathway}
      />
    </main>
  );
}
