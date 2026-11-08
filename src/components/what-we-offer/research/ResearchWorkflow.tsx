"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { HelpCircle, Search, LineChart, Compass, Lightbulb, FileCheck2, ArrowRight } from "lucide-react";

interface WorkflowStep {
  id: string;
  step: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  deliverable: string;
  evidenceType: string;
  marginalNote: string;
}

const STAGES: WorkflowStep[] = [
  {
    id: "question",
    step: "01",
    title: "QUESTION",
    tagline: "Framing Institutional Blind Spots",
    description:
      "Why does this issue matter, and why has existing diplomacy failed to resolve it? We isolate unspoken assumptions and identify unaddressed structural barriers.",
    icon: HelpCircle,
    deliverable: "Problem Statement Dossier",
    evidenceType: "Diplomatic Inquiries & Field Audits",
    marginalNote: "Identify who is missing from the table before formulating queries.",
  },
  {
    id: "investigate",
    step: "02",
    title: "INVESTIGATE",
    tagline: "Gathering Field Evidence & Treaties",
    description:
      "Empirical field investigations, multi-language treaty archives, diplomatic cables, and primary stakeholder testimony from female negotiators.",
    icon: Search,
    deliverable: "Primary Source Registry",
    evidenceType: "Archive Records & Track-II Interviews",
    marginalNote: "Primary data verified against multilateral repositories.",
  },
  {
    id: "analyze",
    step: "03",
    title: "ANALYZE",
    tagline: "Quantitative Patterns & Correlations",
    description:
      "Rigorous econometric and geopolitical modeling to test hypotheses: correlating gender diversity metrics with treaty durability, compliance, and conflict cessation.",
    icon: LineChart,
    deliverable: "Statistical Regression Matrix",
    evidenceType: "Cross-Conflict Data Models (1995–2026)",
    marginalNote: "N=142 post-conflict protocols analyzed across 5 continents.",
  },
  {
    id: "interpret",
    step: "04",
    title: "INTERPRET",
    tagline: "Synthesizing Findings into Statecraft",
    description:
      "Converting statistical insight into strategic context. What do these findings mean for a foreign minister entering bilateral deadlock next week?",
    icon: Compass,
    deliverable: "Geopolitical Implications Assessment",
    evidenceType: "Tactical Foreign Ministry Briefings",
    marginalNote: "Theory must translate directly into foreign policy leverage.",
  },
  {
    id: "perspective",
    step: "05",
    title: "PERSPECTIVE",
    tagline: "Formulating Actionable Doctrine",
    description:
      "Developing unyielding, principled policy stances that challenge institutional inertia and establish new benchmarks for inclusive statecraft.",
    icon: Lightbulb,
    deliverable: "Strategic Doctrine Memo",
    evidenceType: "Peer-Reviewed Consensus Statements",
    marginalNote: "Tested against competing geopolitical counter-arguments.",
  },
  {
    id: "policy",
    step: "06",
    title: "POLICY",
    tagline: "Statutory Text & Treaty Amendments",
    description:
      "Concrete, clause-by-clause statutory recommendations, resolution drafts, and executive bilateral treaty protocols ready for parliamentary adoption.",
    icon: FileCheck2,
    deliverable: "Actionable Treaty Protocol Draft",
    evidenceType: "Draft Parliamentary Resolution",
    marginalNote: "Delivered directly into bilateral diplomatic delegations.",
  },
];

export default function ResearchWorkflow() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const current = STAGES[activeStage];
  const IconComponent = current.icon;

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-[var(--color-border)] relative overflow-hidden" aria-label="Research Workflow">
      {/* Background watermarked label */}
      <div className="absolute right-6 top-10 font-serif text-[7rem] sm:text-[10rem] font-bold text-slate-50 select-none pointer-events-none -z-0">
        METHOD
      </div>

      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-3">
            METHODOLOGICAL RIGOUR
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--hero-navy)] font-normal leading-tight">
            From Question to Insight.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--hero-muted)] font-sans font-light">
            Research at AIPP is not an academic abstraction. It is an intentional 6-stage physical and analytical workflow that transforms unanswered dilemmas into foreign policy doctrine.
          </p>
        </div>

        {/* Horizontal Editorial Stage Stepper */}
        <div className="border border-[var(--color-border)] bg-[#FDFDFD] shadow-sm mb-8 overflow-x-auto no-scrollbar">
          <div className="flex min-w-[700px]">
            {STAGES.map((s, idx) => {
              const isActive = activeStage === idx;
              const StepIcon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStage(idx)}
                  className={`flex-1 p-4 lg:p-5 text-left border-r border-[var(--color-border)] last:border-r-0 transition-all relative ${
                    isActive
                      ? "bg-white shadow-inner"
                      : "hover:bg-slate-50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-serif text-sm font-semibold transition-colors ${
                        isActive ? "text-[var(--hero-gold)]" : "text-slate-400"
                      }`}
                    >
                      {s.step}
                    </span>
                    <StepIcon
                      className={`h-4 w-4 ${
                        isActive ? "text-[var(--hero-navy)]" : "text-slate-300"
                      }`}
                    />
                  </div>
                  <div
                    className={`font-serif text-sm font-medium tracking-wide ${
                      isActive ? "text-[var(--hero-navy)] font-semibold" : "text-slate-600"
                    }`}
                  >
                    {s.title}
                  </div>

                  {/* Active Indicator Line */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--hero-gold)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Physical / Editorial Layer Display for Active Stage */}
        <div className="paper-layer p-8 sm:p-12 border border-[var(--color-border)] rounded-sm relative overflow-hidden transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Stage Overview */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 bg-[var(--hero-navy)] text-white font-mono text-xs font-semibold tracking-wider">
                  STAGE {current.step}
                </span>
                <span className="font-mono text-xs text-[var(--hero-gold)] uppercase tracking-wider">
                  {current.evidenceType}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[var(--hero-navy)] font-normal leading-snug">
                {current.tagline}
              </h3>

              <p className="mt-4 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                {current.description}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs">
                <div>
                  <span className="block text-slate-400 font-mono text-[0.625rem] uppercase">
                    PRIMARY DELIVERABLE
                  </span>
                  <span className="font-semibold text-[var(--hero-navy)] font-sans">
                    {current.deliverable}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 font-mono text-[0.625rem] uppercase">
                    STANDARDS AUDIT
                  </span>
                  <span className="font-semibold text-[var(--hero-gold)] font-sans">
                    ISO / Peer Review Grade
                  </span>
                </div>
              </div>
            </div>

            {/* Right Editorial Dossier Sheet Preview */}
            <div className="lg:col-span-5 bg-[#FAF9F6] border border-slate-200 p-6 rounded-sm shadow-sm relative font-mono text-xs text-slate-700">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                <span className="text-[0.6875rem] font-bold text-[var(--hero-navy)] tracking-wider">
                  PRAXIS DOSSIER // {current.title}
                </span>
                <IconComponent className="h-4 w-4 text-[var(--hero-gold)]" />
              </div>

              <div className="space-y-2 text-[0.6875rem]">
                <div className="flex justify-between">
                  <span className="text-slate-400">STATUS:</span>
                  <span className="text-emerald-700 font-bold">VERIFIED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PROTOCOL:</span>
                  <span>AIPP-RPI-REV4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DISPATCH:</span>
                  <span>GENEVA HQ</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                <span className="block font-mono text-[0.625rem] text-[var(--hero-gold)] uppercase mb-1">
                  RESEARCHER FIELD NOTE:
                </span>
                <p className="font-serif italic text-sm text-slate-800 leading-relaxed">
                  "{current.marginalNote}"
                </p>
              </div>

              {/* Progress step dots */}
              <div className="mt-6 flex items-center justify-between pt-2">
                <div className="flex gap-1.5">
                  {STAGES.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-5 rounded-full transition-colors ${
                        i === activeStage ? "bg-[var(--hero-gold)]" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveStage((prev) => (prev + 1) % STAGES.length)}
                  className="inline-flex items-center gap-1 text-[0.6875rem] font-bold text-[var(--hero-navy)] hover:text-[var(--hero-gold)] transition-colors"
                >
                  <span>Next Stage</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
