"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ArrowRight, Compass, ShieldAlert, GitBranch, Scale, CheckCircle2, RotateCcw } from "lucide-react";

interface JourneyStage {
  step: string;
  name: string;
  tagline: string;
  description: string;
  visualLabel: string;
  nodesCount: number;
  highlightCoordinates: { x: number; y: number };
  tacticalNote: string;
}

const STAGES: JourneyStage[] = [
  {
    step: "01",
    name: "CONTEXT",
    tagline: "Mapping the Baseline Power Dynamic",
    description:
      "Every crisis emerges from a preexisting landscape of alliances, dependencies, resource flows, and unspoken red lines. We establish the strategic horizon before injecting turbulence.",
    visualLabel: "Equilibrium Baseline (Status Quo)",
    nodesCount: 3,
    highlightCoordinates: { x: 50, y: 150 },
    tacticalNote: "Audit actor dependencies before adversary triggers shift leverage.",
  },
  {
    step: "02",
    name: "CHALLENGE",
    tagline: "The Injected Disruption Trigger",
    description:
      "A sudden geopolitical shift — a border escalation, a cyber infrastructure breach, or a broken treaty clause — destabilizes the status quo and forces a compressed response window.",
    visualLabel: "Crisis Trigger Event Vector",
    nodesCount: 5,
    highlightCoordinates: { x: 150, y: 150 },
    tacticalNote: "First 48 hours dictate whether multilateral escalation remains reversible.",
  },
  {
    step: "03",
    name: "OPTIONS",
    tagline: "Branching Decision Pathways",
    description:
      "Participants construct and stress-test multiple courses of action. Rather than defaulting to binary choices, we force delegations to model 3–5 distinct diplomatic levers.",
    visualLabel: "Divergent Strategic Hypotheses",
    nodesCount: 8,
    highlightCoordinates: { x: 280, y: 110 },
    tacticalNote: "Identify non-obvious third-party levers (Track-II, sovereign guarantors).",
  },
  {
    step: "04",
    name: "TRADE-OFFS",
    tagline: "Quantifying 2nd & 3rd-Order Repercussions",
    description:
      "Every diplomatic victory carries a structural cost. We calculate what is forfeited: domestic public capital, allied trust, sovereign concessions, or future deterrence credibility.",
    visualLabel: "Friction & Cost Equilibrium",
    nodesCount: 10,
    highlightCoordinates: { x: 380, y: 180 },
    tacticalNote: "What seems an immediate tactical win often compromises 10-year accords.",
  },
  {
    step: "05",
    name: "DECISION",
    tagline: "Execution of the Chosen Doctrine",
    description:
      "Under simulated real-time pressure, female chief negotiators draft and execute their binding mandate, presenting resolutions and managing counter-proposals at the bargaining table.",
    visualLabel: "Ratification of Selected Vector",
    nodesCount: 6,
    highlightCoordinates: { x: 450, y: 150 },
    tacticalNote: "Clarity of drafting eliminates dangerous post-ratification ambiguity.",
  },
  {
    step: "06",
    name: "REFLECTION",
    tagline: "Post-Exercise Debrief & Doctrinal Codification",
    description:
      "The simulation concludes with structured analytical debriefs. Participants examine why specific levers succeeded, where cognitive bias emerged, and how to institutionalize lessons.",
    visualLabel: "Institutional Memory Synthesis",
    nodesCount: 4,
    highlightCoordinates: { x: 500, y: 150 },
    tacticalNote: "Praxis transforms simulated experience into reflexive diplomatic mastery.",
  },
];

export default function StrategyScrollJourney() {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const current = STAGES[activeStageIdx];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF9F5] text-slate-900 border-b border-[var(--color-border)] relative overflow-hidden" aria-label="One Decision Many Possibilities Journey">
      <Container>
        {/* Header */}
        <ScrollReveal variant="fade-up" className="max-w-2xl mb-10">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-2">
            SIGNATURE SIMULATION ARCHITECTURE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--hero-navy)] font-normal leading-tight">
            One Decision. Many Possibilities.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-sans font-light">
            Journey through the six chronological phases of an AIPP strategic simulation. Step through each phase to observe how chaotic uncertainty is disciplined into decisive statecraft.
          </p>
        </ScrollReveal>

        {/* Stage Timeline Controller */}
        <ScrollReveal variant="fade-up" delay={80} className="border border-slate-200 bg-white p-1.5 rounded-full mb-8 overflow-x-auto no-scrollbar shadow-xs">
          <div className="flex min-w-[650px] justify-between">
            {STAGES.map((s, idx) => {
              const isActive = activeStageIdx === idx;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStageIdx(idx)}
                  className={`flex-1 py-2.5 px-3 text-center transition-all rounded-full relative ${
                    isActive
                      ? "bg-[var(--hero-navy)] text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:text-[var(--hero-navy)] hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`font-mono text-[0.625rem] block ${
                      isActive ? "text-[var(--hero-gold)]" : "text-slate-400"
                    }`}
                  >
                    PHASE {s.step}
                  </span>
                  <span className="font-serif text-xs sm:text-sm tracking-wider uppercase block mt-0.5">
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Dual Layout: Interactive Map Canvas (Left 7) + Detailed Doctrinal Phase Card (Right 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Dynamic SVG Scenario Map */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-sm p-6 relative overflow-hidden h-[340px] sm:h-[380px] flex items-center justify-center shadow-xs">
            {/* Background strategic grid lines */}
            <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:20px_20px]" />

            <svg className="w-full h-full" viewBox="0 0 560 300" fill="none">
              {/* Converging / Diverging Decision Paths */}
              <line x1="40" y1="150" x2="160" y2="150" stroke={activeStageIdx >= 1 ? "#B09C4B" : "#CBD5E1"} strokeWidth="2" />
              
              {/* Divergence at Stage 3 */}
              <path
                d="M 160 150 C 210 150, 240 80, 320 80"
                stroke={activeStageIdx >= 2 ? "#B09C4B" : "#CBD5E1"}
                strokeWidth={activeStageIdx === 2 ? "2.5" : "1.2"}
                strokeDasharray={activeStageIdx === 2 ? "none" : "3 3"}
              />
              <path
                d="M 160 150 L 320 150"
                stroke={activeStageIdx >= 2 ? "#B09C4B" : "#CBD5E1"}
                strokeWidth={activeStageIdx >= 2 ? "2" : "1"}
              />
              <path
                d="M 160 150 C 210 150, 240 220, 320 220"
                stroke={activeStageIdx >= 2 ? "#B09C4B" : "#CBD5E1"}
                strokeWidth={activeStageIdx === 2 ? "2.5" : "1.2"}
                strokeDasharray={activeStageIdx === 2 ? "none" : "3 3"}
              />

              {/* Trade-offs convergence back at Stage 4 & 5 */}
              <path
                d="M 320 80 C 380 80, 410 150, 460 150"
                stroke={activeStageIdx >= 3 ? "#B09C4B" : "#CBD5E1"}
                strokeWidth={activeStageIdx >= 3 ? "2" : "1"}
                strokeDasharray="4 4"
              />
              <path
                d="M 320 220 C 380 220, 410 150, 460 150"
                stroke={activeStageIdx >= 3 ? "#B09C4B" : "#CBD5E1"}
                strokeWidth={activeStageIdx >= 3 ? "2" : "1"}
                strokeDasharray="4 4"
              />

              {/* Final Synthesis Vector at Stage 6 */}
              <line x1="460" y1="150" x2="530" y2="150" stroke={activeStageIdx >= 4 ? "#B09C4B" : "#CBD5E1"} strokeWidth="2.5" />
              <circle cx="530" cy="150" r="6" fill="#B09C4B" />

              {/* Active Animated Spotlight Node on Current Stage */}
              <circle
                cx={current.highlightCoordinates.x}
                cy={current.highlightCoordinates.y}
                r="16"
                fill="none"
                stroke="#B09C4B"
                strokeWidth="1.5"
                className="animate-ping opacity-60"
              />
              <circle
                cx={current.highlightCoordinates.x}
                cy={current.highlightCoordinates.y}
                r="7"
                fill="#B09C4B"
                stroke="#FFFFFF"
                strokeWidth="2"
              />

              {/* Text label floating next to active node */}
              <rect
                x={Math.min(current.highlightCoordinates.x + 12, 410)}
                y={current.highlightCoordinates.y - 20}
                width="130"
                height="24"
                rx="2"
                fill="#0D2C49"
                stroke="#B09C4B"
                strokeWidth="1"
              />
              <text
                x={Math.min(current.highlightCoordinates.x + 18, 416)}
                y={current.highlightCoordinates.y - 5}
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#FFFFFF"
              >
                {current.name}: PHASE {current.step}
              </text>
            </svg>

            {/* Bottom visual caption */}
            <div className="absolute bottom-3 left-4 right-4 flex justify-between font-mono text-[0.625rem] text-slate-500 border-t border-slate-100 pt-2">
              <span>CANVAS: GEOPOLITICAL STATE ENGINE</span>
              <span className="text-[var(--hero-navy)] font-semibold">{current.visualLabel}</span>
            </div>
          </div>

          {/* Right Phase Dossier Card */}
          <div className="lg:col-span-5 bg-white border border-slate-200 p-7 sm:p-8 rounded-sm shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-0.5 bg-[var(--hero-gold)] text-[var(--hero-navy)] font-mono text-xs font-bold rounded-full">
                STAGE {current.step}
              </span>
              <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
                {current.name}
              </span>
            </div>

            <h3 className="font-serif text-2xl text-[var(--hero-navy)] font-normal leading-snug">
              {current.tagline}
            </h3>

            <p className="mt-4 text-sm sm:text-base text-slate-600 font-sans font-light leading-relaxed">
              {current.description}
            </p>

            <div className="mt-6 p-4 bg-[#FCFBF8] border-l-2 border-l-[var(--hero-gold)] border border-slate-200/80 rounded-r-sm">
              <span className="font-mono text-[0.625rem] text-[var(--hero-gold)] uppercase tracking-wider block mb-1 font-bold">
                FACILITATOR FIELD DIRECTIVE:
              </span>
              <p className="font-serif italic text-xs sm:text-sm text-slate-800">
                &ldquo;{current.tacticalNote}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setActiveStageIdx((prev) => (prev + 1) % STAGES.length)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-xs font-semibold uppercase tracking-wider text-[var(--hero-navy)] hover:border-[var(--hero-navy)] hover:bg-slate-50 transition-colors shadow-xs"
              >
                <span>Advance to Phase {((activeStageIdx + 1) % STAGES.length) + 1}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
