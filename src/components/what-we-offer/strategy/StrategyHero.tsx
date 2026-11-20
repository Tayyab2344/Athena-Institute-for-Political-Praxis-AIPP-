"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, GitBranch, Shield, Zap, AlertCircle } from "lucide-react";
import Container from "@/components/ui/Container";

interface DecisionBranch {
  id: string;
  name: string;
  label: string;
  risk: string;
  opportunity: string;
  tradeoff: string;
  stakeholder: string;
  outcome: string;
  vectorY: number;
}

const BRANCHES: DecisionBranch[] = [
  {
    id: "branch-a",
    name: "Option A",
    label: "Multilateral Arbitration Protocol",
    risk: "Low-Medium Escalation",
    opportunity: "Broad Coalition Consensus & Legitimate Precedent",
    tradeoff: "Extended timeline (12–18 months required for quorum)",
    stakeholder: "UN Observers & Regional Coalition Allies",
    outcome: "Institutional Treaty Stability & Permanent Monitoring",
    vectorY: 70,
  },
  {
    id: "branch-b",
    name: "Option B",
    label: "Bilateral Resource Demarcation Accord",
    risk: "Medium-High Ambiguity",
    opportunity: "Immediate de-escalation of maritime corridor",
    tradeoff: "Concessions on transit tariffs and sovereign optics",
    stakeholder: "Coastal States & Commerce Ministries",
    outcome: "Tactical Truce with Periodic Joint Oversight",
    vectorY: 150,
  },
  {
    id: "branch-c",
    name: "Option C",
    label: "Asymmetric De-escalation Lever",
    risk: "High Tactical Volatility",
    opportunity: "Breaks negotiation deadlock within 72 hours",
    tradeoff: "Higher exposure to adversarial counters",
    stakeholder: "Defense Attaches & Border Taskforces",
    outcome: "Forced Concession Window followed by Treaty Ratification",
    vectorY: 230,
  },
];

export default function StrategyHero() {
  const [selectedBranchId, setSelectedBranchId] = useState<string>("branch-a");
  const activeBranch = BRANCHES.find((b) => b.id === selectedBranchId) || BRANCHES[0];

  return (
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 bg-[#FAF9F5] text-slate-900 border-b border-[var(--color-border)]" aria-label="Strategy and Simulation Hero">
      {/* Background delicate grid */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Coordinate Bar */}
      <div className="absolute top-6 left-10 hidden xl:flex items-center gap-6 font-mono text-[0.625rem] text-slate-500 tracking-widest pointer-events-none">
        <span>SIMULATION PROTOCOL: AIPP-WARGAME</span>
        <span>STATUS: ACTIVE DECISION MATRIX</span>
        <span>DISCIPLINE: DIPLOMATIC STATECRAFT</span>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Typography (~40%) */}
          <div className="lg:col-span-5 flex flex-col justify-center z-10">
            <div className="hero-animate-eyebrow inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--hero-gold)]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hero-gold)]">
                PILLAR 02 / STRATEGIC ACTION & SIMULATION
              </span>
            </div>

            <h1 className="hero-animate-heading font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-normal leading-[1.08] text-[var(--hero-navy)] tracking-tight">
              Prepare for Complexity Before It Arrives.
            </h1>

            <p className="hero-animate-body mt-4 text-base sm:text-lg leading-relaxed text-slate-600 font-sans font-light max-w-lg">
              Complex multilateral environments demand more than static whitepapers. They require leaders to explore branching scenarios, test assumptions under pressure, and master statecraft decision-making under uncertainty.
            </p>

            {/* Strategic Attributes */}
            <div className="hero-animate-body mt-6 pt-6 border-t border-slate-200 grid grid-cols-3 gap-3 font-mono text-[0.6875rem]">
              <div>
                <span className="block text-[var(--hero-navy)] font-bold text-xs">WARGAMING</span>
                <span className="text-slate-500">Crisis Labs</span>
              </div>
              <div>
                <span className="block text-[var(--hero-navy)] font-bold text-xs">DECISION</span>
                <span className="text-slate-500">Branch Trees</span>
              </div>
              <div>
                <span className="block text-[var(--hero-navy)] font-bold text-xs">STATECRAFT</span>
                <span className="text-slate-500">Diplomatic Stress</span>
              </div>
            </div>

            <div className="hero-animate-cta mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#interactive-scenario"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--hero-navy)] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-all hover:bg-[var(--hero-gold)] hover:text-[var(--hero-navy)] hover:shadow-md font-sans"
              >
                <span>Launch Interactive Scenario</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#capabilities-index"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-slate-300 text-[var(--hero-navy)] bg-white text-xs font-semibold uppercase tracking-[0.14em] transition-all hover:border-[var(--hero-navy)] hover:bg-slate-50 font-sans shadow-xs"
              >
                <span>Explore Simulations</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Decision Map (~60%) */}
          <div className="hero-animate-image lg:col-span-7 bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--hero-navy)]">
                <GitBranch className="h-4 w-4 text-[var(--hero-gold)]" />
                <span className="font-bold tracking-wider uppercase">INTERACTIVE DECISION MAP</span>
              </div>
              <span className="font-mono text-[0.625rem] text-slate-500">
                ACTIVE SCENARIO // MARITIME ACCESS CRISIS
              </span>
            </div>

            {/* SVG Decision Map Visualization */}
            <div className="relative w-full h-[280px] sm:h-[300px] bg-[#F8F9FA] rounded-sm border border-slate-200 p-2 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 540 300" fill="none">
                {/* Central Origin Node: Strategic Challenge */}
                <rect x="20" y="125" width="130" height="50" rx="2" fill="#0D2C49" stroke="#B09C4B" strokeWidth="1.5" />
                <text x="85" y="145" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle" fill="#B09C4B">
                  STRATEGIC CHALLENGE
                </text>
                <text x="85" y="160" fontSize="7" fontFamily="sans-serif" textAnchor="middle" fill="#FFFFFF">
                  Corridor Deadlock
                </text>

                {/* Branch Lines */}
                {BRANCHES.map((b) => {
                  const isSelected = b.id === selectedBranchId;
                  return (
                    <g key={b.id} onClick={() => setSelectedBranchId(b.id)} className="cursor-pointer group">
                      <path
                        d={`M 150 150 C 210 150, 230 ${b.vectorY}, 300 ${b.vectorY}`}
                        stroke={isSelected ? "#B09C4B" : "#CBD5E1"}
                        strokeWidth={isSelected ? "2.5" : "1.2"}
                        strokeDasharray={isSelected ? "none" : "4 4"}
                        className="transition-all duration-300"
                      />
                      
                      {/* Intermediate Node */}
                      <circle
                        cx="300"
                        cy={b.vectorY}
                        r={isSelected ? "7" : "5"}
                        fill={isSelected ? "#B09C4B" : "#E2E8F0"}
                        stroke={isSelected ? "#0D2C49" : "#94A3B8"}
                        strokeWidth="1.5"
                        className="transition-all duration-300"
                      />

                      {/* Branch Label Node */}
                      <rect
                        x="320"
                        y={b.vectorY - 16}
                        width="190"
                        height="32"
                        rx="2"
                        fill={isSelected ? "#FFFFFF" : "#F8FAFC"}
                        stroke={isSelected ? "#B09C4B" : "#E2E8F0"}
                        strokeWidth={isSelected ? "1.5" : "1"}
                        className="transition-all duration-300 shadow-xs"
                      />
                      <text
                        x="332"
                        y={b.vectorY - 4}
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fill={isSelected ? "#0D2C49" : "#64748B"}
                      >
                        {b.name}: {b.risk}
                      </text>
                      <text
                        x="332"
                        y={b.vectorY + 8}
                        fontSize="7"
                        fontFamily="sans-serif"
                        fill={isSelected ? "#334155" : "#94A3B8"}
                      >
                        {b.label.slice(0, 32)}...
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Tactical Live Breakdown of Active Branch */}
            <div className="mt-5 p-4 bg-[#FCFBF8] border border-slate-200 rounded-sm font-sans text-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <span className="font-mono text-[0.6875rem] font-bold text-[var(--hero-navy)] uppercase tracking-wider">
                  ACTIVE PATH: {activeBranch.name} {"//"} {activeBranch.label}
                </span>
                <span className="font-mono text-[0.625rem] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  STATUS: VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="font-mono text-[0.625rem] text-slate-500 block uppercase">
                    STRATEGIC OPPORTUNITY:
                  </span>
                  <p className="mt-0.5 text-xs text-slate-900 font-medium">{activeBranch.opportunity}</p>
                </div>
                <div>
                  <span className="font-mono text-[0.625rem] text-slate-500 block uppercase">
                    KEY TRADE-OFF:
                  </span>
                  <p className="mt-0.5 text-xs text-amber-800">{activeBranch.tradeoff}</p>
                </div>
                <div>
                  <span className="font-mono text-[0.625rem] text-slate-500 block uppercase">
                    PRIMARY STAKEHOLDER:
                  </span>
                  <p className="mt-0.5 text-xs text-slate-700">{activeBranch.stakeholder}</p>
                </div>
                <div>
                  <span className="font-mono text-[0.625rem] text-slate-500 block uppercase">
                    PROJECTED OUTCOME:
                  </span>
                  <p className="mt-0.5 text-xs text-emerald-800 font-medium">{activeBranch.outcome}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
