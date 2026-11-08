"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { ArrowUpRight, FileCheck, Layers, Sparkles, BookOpen, Compass, Shield } from "lucide-react";

interface CapabilityItem {
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  outputs: string[];
  focusArea: string;
  icon: React.ElementType;
}

const CAPABILITIES: CapabilityItem[] = [
  {
    number: "01",
    title: "Policy Research",
    shortDesc: "Rigorous empirical inquiry into systemic diplomatic barriers.",
    fullDesc:
      "Examining complex policy questions with absolute methodological independence, producing empirical work that establishes high-water marks for multilateral decision-makers.",
    outputs: ["Commissioned Audits", "Geopolitical Risk Index", "Bilateral Conflict Studies"],
    focusArea: "Multilateral Treaties & Security Protocols",
    icon: Shield,
  },
  {
    number: "02",
    title: "Issue Analysis",
    shortDesc: "Deep investigations into emerging diplomatic pressure points.",
    fullDesc:
      "Investigating specific, time-critical issues in foreign affairs, maritime boundaries, cyber norms, and bilateral negotiation deadlocks to deliver rapid evidentiary clarity.",
    outputs: ["Rapid-Response Briefs", "Treaty Clause Audits", "Stakeholder Profiles"],
    focusArea: "Geopolitical Crises & Resource Conflicts",
    icon: Compass,
  },
  {
    number: "03",
    title: "Policy Briefs",
    shortDesc: "Translating granular research into executive foreign ministry dossiers.",
    fullDesc:
      "Condensing extensive data models and archival investigations into high-density, 4-to-12-page executive dossiers designed for ministers, envoys, and senior delegations.",
    outputs: ["Executive Summaries", "Statutory Recommendations", "Model Resolution Clauses"],
    focusArea: "Foreign Ministries & Parliamentary Committees",
    icon: FileCheck,
  },
  {
    number: "04",
    title: "Research Papers",
    shortDesc: "Peer-reviewed academic contributions with sovereign policy implications.",
    fullDesc:
      "Original scholarship published in international security journals, advancing doctrinal frameworks on how women in leadership systematically reshape conflict resolution outcomes.",
    outputs: ["Academic Monograph Chapters", "Econometric Regression Papers", "Archival Histories"],
    focusArea: "International Law & Peacebuilding Scholars",
    icon: BookOpen,
  },
  {
    number: "05",
    title: "Evidence-Based Recommendations",
    shortDesc: "Pragmatic, statutory frameworks tested against institutional realities.",
    fullDesc:
      "Developing actionable statutory recommendations grounded in field reality, legal doctrine, and diplomatic practice, ensuring proposals withstand adversarial scrutiny.",
    outputs: ["Treaty Protocols", "Code of Diplomatic Conduct", "Implementation Toolkits"],
    focusArea: "International Secretariats & Delegations",
    icon: Layers,
  },
  {
    number: "06",
    title: "Knowledge Development",
    shortDesc: "Building an enduring repository of women's diplomatic praxis.",
    fullDesc:
      "Curating an evolving institutional library of female statecraft, case studies, oral histories, and negotiation playbooks for current and upcoming generations.",
    outputs: ["Oral History Archives", "Diplomatic Casebooks", "Praxis Curricula"],
    focusArea: "Emerging Female Envoys & Think Tanks",
    icon: Sparkles,
  },
];

export default function ResearchCapabilitiesIndex() {
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);
  const active = CAPABILITIES[hoveredIdx];
  const ActiveIcon = active.icon;

  return (
    <section className="py-20 lg:py-28 bg-[#FBFBFA] border-b border-[var(--color-border)] relative" aria-label="Research Capabilities">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-3">
            CAPABILITY PORTFOLIO
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--hero-navy)] font-normal leading-tight">
            Research Capabilities Index.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--hero-muted)] font-sans font-light">
            We do not produce generic think tank commentary. Every line of inquiry is calibrated toward creating sovereign authority and actionable policy leverage.
          </p>
        </div>

        {/* Desktop Split: Large Editorial List (Left 7) + Dynamic Preview Stage (Right 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Large Numbered Editorial List */}
          <div className="lg:col-span-7 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {CAPABILITIES.map((cap, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <div
                  key={cap.number}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className={`group relative py-6 px-4 cursor-pointer transition-all duration-300 ${
                    isHovered ? "bg-white shadow-sm" : "hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6">
                      {/* Number shifts on hover */}
                      <span
                        className={`font-serif text-2xl sm:text-3xl transition-all duration-300 ${
                          isHovered
                            ? "text-[var(--hero-gold)] font-medium translate-x-1"
                            : "text-slate-300"
                        }`}
                      >
                        {cap.number}
                      </span>

                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl text-[var(--hero-navy)] font-medium leading-tight group-hover:text-[var(--hero-gold)] transition-colors">
                          {cap.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1.5 font-light leading-relaxed max-w-lg">
                          {cap.shortDesc}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                        isHovered
                          ? "text-[var(--hero-gold)] translate-x-1 -translate-y-1"
                          : "text-slate-300 group-hover:text-slate-500"
                      }`}
                    />
                  </div>

                  {/* Expanding gold line on hover */}
                  <div
                    className={`h-[2px] bg-[var(--hero-gold)] transition-all duration-500 mt-4 ${
                      isHovered ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Dynamic Editorial Preview Panel (Right 5) */}
          <div className="lg:col-span-5 sticky top-36">
            <div className="paper-layer p-8 bg-white border border-[var(--color-border)] rounded-sm shadow-lg relative overflow-hidden transition-all duration-500">
              {/* Watermark coordinate */}
              <div className="absolute top-4 right-4 font-mono text-[0.625rem] text-slate-300 uppercase tracking-widest">
                FOCUS // {active.number}
              </div>

              <div className="w-12 h-12 rounded-sm bg-[var(--hero-navy)] text-[var(--hero-gold)] flex items-center justify-center mb-6">
                <ActiveIcon className="h-6 w-6" />
              </div>

              <span className="font-mono text-[0.6875rem] text-[var(--hero-gold)] uppercase tracking-wider block mb-1">
                {active.focusArea}
              </span>

              <h4 className="font-serif text-2xl text-[var(--hero-navy)] font-normal leading-snug">
                {active.title}
              </h4>

              <p className="mt-3 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                {active.fullDesc}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <span className="font-mono text-[0.625rem] font-bold uppercase text-[var(--hero-navy)] tracking-wider block mb-3">
                  PRIMARY DELIVERABLES:
                </span>
                <div className="flex flex-wrap gap-2">
                  {active.outputs.map((out) => (
                    <span
                      key={out}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-mono rounded-sm border border-slate-200"
                    >
                      {out}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>PRAXIS STANDARD: VERIFIED</span>
                <span className="text-[var(--hero-gold)] font-bold">AIPP RESEARCH LAB</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
