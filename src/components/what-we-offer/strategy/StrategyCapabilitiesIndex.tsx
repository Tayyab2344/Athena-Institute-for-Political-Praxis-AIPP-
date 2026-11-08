"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { ArrowUpRight, GitCommit, ShieldAlert, Target, Award, Users2, Zap } from "lucide-react";

interface StrategyCapability {
  number: string;
  title: string;
  tagline: string;
  description: string;
  targetRole: string;
  simulationFormat: string;
  branchVectorIndex: number;
}

const CAPABILITIES: StrategyCapability[] = [
  {
    number: "01",
    title: "Scenario Planning",
    tagline: "Horizon Scanning & Multi-Year Futures",
    description:
      "Constructing plausible future trajectories for volatile diplomatic regions, enabling ministries to draft adaptive contingencies long before crises crystallize.",
    targetRole: "Policy Planning Staff & Directors of Strategy",
    simulationFormat: "Multi-Day Strategic Foresight Labs",
    branchVectorIndex: 0,
  },
  {
    number: "02",
    title: "Strategic Simulations",
    tagline: "Immersive Wargames & Treaty Bargaining",
    description:
      "High-fidelity multilateral negotiation environments where participants assume realistic sovereign roles, negotiate treaty clauses, and experience the systemic friction of statecraft.",
    targetRole: "Delegates, Envoys & Negotiation Teams",
    simulationFormat: "Bilateral & Plenary War-Room Exercises",
    branchVectorIndex: 1,
  },
  {
    number: "03",
    title: "Decision-Making Exercises",
    tagline: "Evaluating Complex Trade-Offs Under Stress",
    description:
      "Structured tactical bargaining sessions that build psychological resilience, force prioritization between competing national interests, and sharpen consensus-building agility.",
    targetRole: "Chief Negotiators & Embassy Counselors",
    simulationFormat: "Timed Decision-Matrix Rounds",
    branchVectorIndex: 2,
  },
  {
    number: "04",
    title: "Crisis & Policy Scenarios",
    tagline: "Rapid-Onset Emergency Response",
    description:
      "Testing de-escalation protocols under compressed 24-to-72-hour operational timelines with incomplete information, adversarial press leaks, and conflicting intelligence briefs.",
    targetRole: "Crisis Command Groups & National Security Advisors",
    simulationFormat: "Real-Time Flashpoint Scenarios",
    branchVectorIndex: 3,
  },
  {
    number: "05",
    title: "Strategic Workshops",
    tagline: "Cross-Sector Collaborative Problem Solving",
    description:
      "Convening multidisciplinary leaders across diplomacy, defense, law, and civil society to dismantle stubborn policy deadlocks and synthesize actionable common ground.",
    targetRole: "Inter-Agency Delegations & Coalition Partners",
    simulationFormat: "Facilitated Executive Consensus Roundtables",
    branchVectorIndex: 4,
  },
  {
    number: "06",
    title: "Leadership Exercises",
    tagline: "Executive Statecraft & High-Stakes Oratory",
    description:
      "Targeted individual and team exercises designed to instill poise at the podium, strategic leverage in bilateral corridors, and moral command in international assemblies.",
    targetRole: "Current & Rising Female Ambassadors",
    simulationFormat: "Masterclass Simulation Cohorts",
    branchVectorIndex: 5,
  },
];

export default function StrategyCapabilitiesIndex() {
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);
  const active = CAPABILITIES[hoveredIdx];

  return (
    <section id="capabilities-index" className="py-20 lg:py-28 bg-[#081D2E] text-white border-b border-slate-800" aria-label="Strategy Capabilities Index">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-3">
            STRATEGY SUITE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
            Strategic Capabilities Index.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 font-sans font-light">
            An integrated taxonomy of simulation formats. Hovering any capability activates its corresponding vector on the operational strategy map.
          </p>
        </div>

        {/* Grid: Left List (7 cols) + Right Dynamic Map Node (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List of 6 Capabilities */}
          <div className="lg:col-span-7 divide-y divide-slate-800 border-y border-slate-800">
            {CAPABILITIES.map((cap, idx) => {
              const isSelected = hoveredIdx === idx;
              return (
                <div
                  key={cap.number}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className={`py-5 px-4 cursor-pointer transition-all duration-300 rounded-sm ${
                    isSelected ? "bg-[#0D2C49] shadow-lg" : "hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-5">
                      <span
                        className={`font-serif text-2xl transition-all duration-300 ${
                          isSelected ? "text-[var(--hero-gold)] font-bold translate-x-1" : "text-slate-500"
                        }`}
                      >
                        {cap.number}
                      </span>
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl text-white font-medium leading-snug">
                          {cap.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                          {cap.tagline}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isSelected ? "text-[var(--hero-gold)] translate-x-1 -translate-y-1" : "text-slate-600"
                      }`}
                    />
                  </div>

                  {/* Active Indicator Bar */}
                  <div
                    className={`h-[2px] bg-[var(--hero-gold)] transition-all duration-300 mt-4 ${
                      isSelected ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Live Strategy Map Branch Node */}
          <div className="lg:col-span-5 sticky top-36">
            <div className="bg-[#051320] border border-slate-700 p-8 rounded-sm shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
                <span className="font-mono text-xs text-[var(--hero-gold)] uppercase tracking-wider">
                  ACTIVE BRANCH // VECTOR {active.number}
                </span>
                <span className="font-mono text-[0.625rem] text-slate-500">
                  WAR-ROOM ENGINE v4.2
                </span>
              </div>

              {/* Miniature Node Network Indicator */}
              <div className="h-28 w-full bg-[#081D2E] border border-slate-800 rounded-sm mb-6 p-2 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 200 80" fill="none">
                  {/* Central Node */}
                  <circle cx="30" cy="40" r="4" fill="#B09C4B" />
                  <line x1="30" y1="40" x2="80" y2="40" stroke="#334E68" strokeWidth="1" />
                  
                  {/* 6 radiating branches corresponding to index */}
                  {[15, 25, 35, 45, 55, 65].map((y, i) => (
                    <g key={i}>
                      <line
                        x1="80"
                        y1="40"
                        x2="160"
                        y2={y}
                        stroke={hoveredIdx === i ? "#B09C4B" : "#1E3A56"}
                        strokeWidth={hoveredIdx === i ? "2" : "1"}
                        className="transition-all duration-300"
                      />
                      <circle
                        cx="160"
                        cy={y}
                        r={hoveredIdx === i ? "4" : "2"}
                        fill={hoveredIdx === i ? "#B09C4B" : "#334E68"}
                        className="transition-all duration-300"
                      />
                    </g>
                  ))}
                </svg>
              </div>

              <h4 className="font-serif text-2xl text-white font-normal leading-snug">
                {active.title}
              </h4>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {active.description}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3 font-mono text-xs">
                <div>
                  <span className="block text-[0.625rem] text-slate-500 uppercase">
                    TARGET LEADERSHIP TIER:
                  </span>
                  <span className="text-[var(--hero-gold)] font-sans">{active.targetRole}</span>
                </div>
                <div>
                  <span className="block text-[0.625rem] text-slate-500 uppercase">
                    DEPLOYMENT FORMAT:
                  </span>
                  <span className="text-white font-sans">{active.simulationFormat}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
