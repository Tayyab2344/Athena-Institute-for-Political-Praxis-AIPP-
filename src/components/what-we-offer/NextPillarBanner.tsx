"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";

interface NextPillarProps {
  currentPillar: "research" | "strategy" | "communications";
}

const PILLARS_MAP = {
  research: {
    next: {
      number: "02",
      title: "Strategic Action & Simulation",
      discipline: "Crisis Preparedness",
      description: "Test tactical leverage, deadlock-breaking, and strategic bargaining under real-time simulated pressure.",
      route: "/what-we-offer/strategic-action-simulation",
    },
    prev: {
      number: "03",
      title: "Communications & Public Advocacy",
      route: "/what-we-offer/communications-public-advocacy",
    },
  },
  strategy: {
    next: {
      number: "03",
      title: "Communications & Public Advocacy",
      discipline: "Public Influence",
      description: "Amplify women's authority across global summits, ambassadorial dialogues, and international media discourse.",
      route: "/what-we-offer/communications-public-advocacy",
    },
    prev: {
      number: "01",
      title: "Research & Policy Innovation",
      route: "/what-we-offer/research-policy-innovation",
    },
  },
  communications: {
    next: {
      number: "01",
      title: "Research & Policy Innovation",
      discipline: "Empirical Investigation",
      description: "Independent investigation, institutional audits, and data-driven analysis informing international governance.",
      route: "/what-we-offer/research-policy-innovation",
    },
    prev: {
      number: "02",
      title: "Strategic Action & Simulation",
      route: "/what-we-offer/strategic-action-simulation",
    },
  },
};

export default function NextPillarBanner({ currentPillar }: NextPillarProps) {
  const { next, prev } = PILLARS_MAP[currentPillar];

  return (
    <section
      className="relative w-full bg-[#F7F7F7] border-y border-[#D9DEE2]/80 py-10 sm:py-14"
      aria-label="Next Pillar Exploration"
    >
      <Container wide>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#D9DEE2] pb-6 mb-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#B09C4B]" />
            <span
              className="text-xs font-semibold tracking-wider text-[#0D2C49] uppercase"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              The Praxis Ecosystem · Next Pillar
            </span>
          </div>

          <Link
            href="/what-we-offer"
            className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49] hover:text-[#B09C4B] transition-colors inline-flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <span>View All Three Pillars</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#B09C4B]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-3">
              <span
                className="text-xl sm:text-2xl font-light text-[#B09C4B]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Pillar {next.number}
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49] bg-white px-3 py-0.5 rounded-full border border-[#D9DEE2]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {next.discipline}
              </span>
            </div>

            <h3
              className="text-2xl sm:text-3xl font-normal text-[#0D2C49] leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {next.title}
            </h3>

            <p
              className="text-sm sm:text-base text-[#243748] font-normal leading-relaxed max-w-xl"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {next.description}
            </p>
          </div>

          <div className="md:col-span-4 flex justify-start md:justify-end gap-3">
            <Link
              href={next.route}
              className="inline-flex items-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-xs hover:bg-[#081D2E] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <span>Explore Pillar {next.number}</span>
              <ArrowUpRight className="h-4 w-4 text-[#B09C4B]" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

