"use client";

import Container from "@/components/ui/Container";

/* ─────────────────────────────────────────────────────────────
   Pillar 1: Research - Section 2: Core Areas of Inquiry
   - Asymmetric editorial presentation of research domains
   - Clear headings, concise content, no repetitive card soup
   ───────────────────────────────────────────────────────────── */

const FOCUS_AREAS = [
  {
    number: "01",
    title: "Bilateral Conflict Mapping",
    description:
      "Tracking historical negotiating deadlocks, delegation composition, and ceasefire longevity metrics across 40 post-conflict zones to inform modern peace talks.",
  },
  {
    number: "02",
    title: "Gender Mainstreaming in Treaties",
    description:
      "Drafting substantive gender equity mandates and verification protocols that integrate women negotiators into the core text of formal security agreements.",
  },
  {
    number: "03",
    title: "Institutional Representation Audits",
    description:
      "Conducting rigorous, data-driven audits of diplomatic assignment pipelines, ambassadorial appointments, and structural retention factors across foreign ministries.",
  },
  {
    number: "04",
    title: "Strategic Policy Briefs & Monographs",
    description:
      "Translating empirical datasets into concise, actionable executive briefs and security monographs for chief negotiators and international ministers.",
  },
];

export default function ResearchFocusAreas() {
  return (
    <section
      id="methodology"
      className="relative w-full bg-[#F7F7F7] text-[#081D2E] py-12 sm:py-16 lg:py-20 border-b border-[#D9DEE2]/80 scroll-mt-20 overflow-hidden"
      aria-label="Areas of Research Inquiry"
    >
      <Container wide>
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <span className="h-px w-6 bg-[#B09C4B]" />
            <span
              className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Areas of Investigation
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[3rem] font-normal leading-[1.12] tracking-tight text-[#0D2C49]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Bridging academic rigor and diplomatic statecraft.
          </h2>

          <p
            className="mt-3 text-base sm:text-lg text-[#243748] font-normal leading-relaxed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Our investigative framework focuses on domains where empirical evidence directly dismantles structural barriers and strengthens international peace accords.
          </p>
        </div>

        {/* 2x2 Editorial Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 border-t border-[#D9DEE2] pt-8 sm:pt-10">
          {FOCUS_AREAS.map((area) => (
            <div
              key={area.number}
              className="bg-white border border-[#D9DEE2] p-6 sm:p-8 rounded-xs shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xl font-light text-[#B09C4B]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {area.number}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#B09C4B]" />
              </div>

              <h3
                className="text-xl sm:text-2xl font-normal text-[#0D2C49]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {area.title}
              </h3>

              <p
                className="text-sm sm:text-base text-[#243748] font-normal leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

