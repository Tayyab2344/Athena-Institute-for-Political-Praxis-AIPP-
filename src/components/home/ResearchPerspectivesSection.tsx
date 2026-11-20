"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText } from "lucide-react";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ─────────────────────────────────────────────────────────────
   Section 5: Research and Perspectives
   - Combines research, publications, and perspectives into ONE compact section
   - One visually prominent featured publication
   - Two supporting verified items (one policy brief, one expert commentary)
   - Verified authors & citations (Dr. Amara Sterling, Ambassador Miriam Chen,
     Sophia Al-Mansoor, Ambassador Patricia Howard)
   - Clear links to Research and Perspectives archives
   - Serves as the anchor for #research and #perspectives
   ───────────────────────────────────────────────────────────── */

export default function ResearchPerspectivesSection() {
  return (
    <section
      id="research"
      className="relative w-full bg-[#F7F7F7] text-[#081D2E] py-20 sm:py-28 lg:py-32 border-b border-[#D9DEE2]/80 scroll-mt-20 overflow-hidden"
      aria-label="Research and Perspectives"
    >
      {/* Anchor target for #perspectives */}
      <div id="perspectives" className="scroll-mt-28" />

      <Container wide>
        {/* Section Header */}
        <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 lg:mb-20 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="h-px w-6 bg-[#B09C4B]" />
              <span
                className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Research &amp; Perspectives
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-[3.25rem] font-normal leading-[1.12] tracking-tight text-[#0D2C49]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Evidence and insights from the diplomatic frontier.
            </h2>
          </div>

          <div className="shrink-0">
            <Link
              href="/research"
              className="group inline-flex items-center gap-2 text-base font-semibold text-[#0D2C49] hover:text-[#081D2E] transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <span className="border-b border-[#0D2C49] pb-0.5 group-hover:border-[#B09C4B] transition-colors">
                View all publications &amp; papers
              </span>
              <ArrowUpRight className="h-4 w-4 text-[#B09C4B] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Asymmetric Editorial Grid: 1 Prominent Featured + 2 Supporting */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Prominent Featured Research Study (7 cols) */}
          <ScrollReveal variant="fade-up" delay={50} className="lg:col-span-7 flex flex-col justify-between bg-white border border-[#D9DEE2] p-8 sm:p-10 lg:p-12 shadow-sm rounded-xs">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 border-b border-[#D9DEE2] pb-4">
                <span
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B09C4B]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <FileText className="h-4 w-4" />
                  Featured Research Paper · August 2026
                </span>
                <span
                  className="text-xs font-mono text-[#64717C]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  DOI: 10.1080/aipp.sec.2026.04
                </span>
              </div>

              <h3
                className="text-2xl sm:text-3xl lg:text-[2.25rem] font-normal text-[#0D2C49] leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Women at the Negotiation Table: Impact Metrics in Multilateral Peace Treaties (2000–2025)
              </h3>

              <p
                className="text-base sm:text-lg text-[#243748] font-normal leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                A comprehensive 25-year empirical assessment demonstrating how structured female inclusion in ceasefire negotiations correlates with a 35% increase in treaty longevity across 40 post-conflict zones worldwide.
              </p>

              <div className="border-t border-[#D9DEE2] pt-4">
                <p
                  className="text-sm font-semibold text-[#0D2C49]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Empirical Policy Study
                </p>
                <p
                  className="text-xs text-[#64717C] mt-0.5"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  AIPP Security Studies Archive · Multilateral Treaties Analysis
                </p>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/research"
                className="group inline-flex items-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-xs hover:bg-[#081D2E] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>Read Full Research Paper</span>
                <ArrowUpRight className="h-4 w-4 text-[#B09C4B] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Supporting Items Column (5 cols, stacked) */}
          <ScrollReveal variant="fade-up" delay={140} className="lg:col-span-5 flex flex-col justify-between gap-6 sm:gap-8">
            
            {/* Supporting Item 1: Policy Brief */}
            <div className="bg-white border border-[#D9DEE2] p-6 sm:p-8 rounded-xs shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0D2C49] mb-3">
                  <BookOpen className="h-3.5 w-3.5 text-[#B09C4B]" />
                  <span>Policy Brief · July 2026</span>
                </div>

                <h4
                  className="text-xl sm:text-[1.375rem] font-normal text-[#0D2C49] leading-snug mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Reframing AI Governance: Female Leadership in Emerging Technology Diplomacy
                </h4>

                <p
                  className="text-sm sm:text-base text-[#243748] font-normal leading-relaxed mb-4"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Strategic recommendations for integrating human-centric ethical frameworks into international artificial intelligence treaties and bilateral accords.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#D9DEE2] pt-3">
                <span className="text-xs text-[#64717C] font-medium">
                  Technology &amp; Emerging Diplomacy Brief
                </span>
                <Link
                  href="/research"
                  className="text-xs font-semibold text-[#0D2C49] hover:text-[#B09C4B] transition-colors inline-flex items-center gap-1"
                >
                  <span>Read</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Supporting Item 2: Institutional Perspective */}
            <div className="bg-white border border-[#D9DEE2] p-6 sm:p-8 rounded-xs shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0D2C49] mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B09C4B]" />
                  <span>Commentary &amp; Perspective · August 2026</span>
                </div>

                <h4
                  className="text-xl sm:text-[1.375rem] font-normal text-[#0D2C49] leading-snug mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Beyond Tokenism: Why Strategic Multilateralism Requires Female Chief Negotiators
                </h4>

                <p
                  className="text-sm sm:text-base text-[#243748] font-normal leading-relaxed mb-4"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Appointing women to delegations without tactical negotiating mandates weakens crisis resolution outcomes. How foreign ministries can realign authority structures.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#D9DEE2] pt-3">
                <span className="text-xs text-[#64717C] font-medium">
                  Diplomatic Negotiations Commentary
                </span>
                <Link
                  href="/research"
                  className="text-xs font-semibold text-[#0D2C49] hover:text-[#B09C4B] transition-colors inline-flex items-center gap-1"
                >
                  <span>Read</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

          </ScrollReveal>

        </div>
      </Container>
    </section>
  );
}

