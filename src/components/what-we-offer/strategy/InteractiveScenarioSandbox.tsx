"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { GitFork, AlertTriangle, CheckCircle, Scale, Users, Layers, ShieldCheck } from "lucide-react";

interface ScenarioBranch {
  id: string;
  name: string;
  title: string;
  consideration: string;
  consequence: string;
  stakeholderEffect: string;
  tradeOff: string;
  stabilityIndex: string;
}

const SCENARIO_TRACKS = [
  {
    id: "maritime",
    title: "Track 01: Critical Maritime Passage & Resource Access",
    dilemma: "A contested strait encounters conflicting unilateral claims, threatening bilateral commercial passage and sovereignty balance.",
    branches: [
      {
        id: "a",
        name: "Branch A",
        title: "Immediate Multilateral Mediation Quorum",
        consideration: "Preempts physical naval deployment by compelling an interim status-quo protocol under neutral regional auspices.",
        consequence: "Freezes contested extraction rights while institutional arbitration proceedings unfold over a 14-month verification cycle.",
        stakeholderEffect: "Reassures merchant shipping consortia; neutralizes hardline domestic factions in neighboring states.",
        tradeOff: "Requires delaying unilateral economic exploitation schedules in the disputed economic zone.",
        stabilityIndex: "High Long-term Stability (88%)",
      },
      {
        id: "b",
        name: "Branch B",
        title: "Bilateral High-Level Envoy Pact",
        consideration: "Direct closed-door engagement between senior women envoys bypasses public parliamentary posturing.",
        consequence: "Generates an expedited memorandum establishing joint maritime patrols and revenue-sharing mechanisms.",
        stakeholderEffect: "Immediate bilateral tension reduction, though third-party allies may query exclusion from the draft.",
        tradeOff: "Relies heavily on interpersonal diplomatic capital and continuity of the current ministerial cabinet.",
        stabilityIndex: "Moderate Tactical Stability (72%)",
      },
      {
        id: "c",
        name: "Branch C",
        title: "Statutory Sanction & Regulatory Challenge",
        consideration: "Applies immediate legal and regulatory tariffs against maritime entities breaching international transit conventions.",
        consequence: "Signals firm sovereign deterrence but heightens retaliatory friction across adjacent logistics corridors.",
        stakeholderEffect: "Applauded by domestic industrial bases; escalates diplomatic strain in bilateral embassies.",
        tradeOff: "Compresses future room for diplomatic compromise; elevates immediate escalation index.",
        stabilityIndex: "Volatile Dynamic Stability (54%)",
      },
    ],
  },
  {
    id: "tech",
    title: "Track 02: Cross-Border AI Security Infrastructure",
    dilemma: "A sudden security vulnerability in shared infrastructure triggers mutual allegations of clandestine state intrusion.",
    branches: [
      {
        id: "a",
        name: "Branch A",
        title: "Joint Forensic Technical Verification Accord",
        consideration: "Establish a bilateral technical inspection commission led by non-partisan female cyber security researchers.",
        consequence: "Prevents escalatory retaliatory cyber measures through shared code audits and transparent attribution.",
        stakeholderEffect: "Builds systemic trust between ministry technology directors and external security auditors.",
        tradeOff: "Requires disclosing sensitive proprietary server telemetry to the bilateral commission.",
        stabilityIndex: "Very High Institutional Resilience (92%)",
      },
      {
        id: "b",
        name: "Branch B",
        title: "Unilateral Firewall Containment Protocol",
        consideration: "Sever shared communications relays and mandate domestic infrastructure redundancy.",
        consequence: "Protects sovereign networks but fragments regional interoperability and economic coordination.",
        stakeholderEffect: "Protects classified ministries; severely harms multinational financial transactions.",
        tradeOff: "Significant short-term economic friction and breakdown in regional data exchanges.",
        stabilityIndex: "Defensive Containment (65%)",
      },
      {
        id: "c",
        name: "Branch C",
        title: "Multilateral Norms Referral & UN Special Session",
        consideration: "Elevate the intrusion to the UN Open-Ended Working Group on Cyber Security to establish global precedent.",
        consequence: "Catalyzes broader international debate on state cyber accountability and gender-inclusive cyber diplomacy.",
        stakeholderEffect: "Mobilizes widespread international coalition support; provokes diplomatic denial from adversary.",
        tradeOff: "Protracted deliberative cycle with delayed operational remediation.",
        stabilityIndex: "Broad Normative Consensus (78%)",
      },
    ],
  },
];

export default function InteractiveScenarioSandbox() {
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("a");

  const currentTrack = SCENARIO_TRACKS[activeTrackIndex];
  const activeBranch =
    currentTrack.branches.find((b) => b.id === selectedBranchId) || currentTrack.branches[0];

  return (
    <section
      id="interactive-scenario"
      className="py-12 sm:py-16 lg:py-20 bg-white text-slate-900 border-b border-[var(--color-border)] relative"
      aria-label="Interactive Strategy Scenario"
    >
      <Container>
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-2">
            SIMULATION SANDBOX
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--hero-navy)] font-normal leading-tight">
            The Interactive Scenario: Decision & Consequence.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-sans font-light">
            A conceptual demonstration of how AIPP simulations immerse diplomatic leaders in high-stakes trade-offs before physical commitments are made.
          </p>
        </div>

        {/* Track Switcher */}
        <div className="flex flex-wrap gap-3 mb-8">
          {SCENARIO_TRACKS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTrackIndex(idx);
                setSelectedBranchId("a");
              }}
              className={`px-5 py-2.5 font-mono text-xs uppercase tracking-wider rounded-full transition-all ${
                activeTrackIndex === idx
                  ? "bg-[var(--hero-navy)] text-white font-bold shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Central Dilemma Box */}
        <div className="p-6 sm:p-8 bg-[#FAF9F5] border border-slate-200/90 border-l-4 border-l-[var(--hero-gold)] rounded-r-sm mb-8 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--hero-gold)] font-bold uppercase tracking-wider mb-2">
            <GitFork className="h-4 w-4" />
            <span>CENTRAL STRATEGIC DILEMMA:</span>
          </div>
          <p className="font-serif text-xl sm:text-2xl text-[var(--hero-navy)] leading-relaxed">
            &ldquo;{currentTrack.dilemma}&rdquo;
          </p>
        </div>

        {/* Three Branch Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {currentTrack.branches.map((b) => {
            const isSelected = b.id === selectedBranchId;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBranchId(b.id)}
                className={`p-5 text-left border rounded-lg transition-all duration-300 relative ${
                  isSelected
                    ? "bg-white border-2 border-[var(--hero-navy)] shadow-md text-[var(--hero-navy)]"
                    : "bg-[#FCFBF8] border-slate-200 hover:border-slate-400 hover:bg-white text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-xs font-bold uppercase tracking-wider ${
                      isSelected ? "text-[var(--hero-gold)]" : "text-slate-500"
                    }`}
                  >
                    {b.name}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? "bg-[var(--hero-gold)]" : "bg-slate-300"
                    }`}
                  />
                </div>
                <h4 className="font-serif text-lg font-medium text-[var(--hero-navy)] leading-snug">
                  {b.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Consequence Matrix Breakdown */}
        <div className="p-6 sm:p-10 bg-[#F8F9FA] border border-slate-200 rounded-sm shadow-xs relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-4">
            <div>
              <span className="font-mono text-xs text-[var(--hero-gold)] uppercase tracking-widest block font-semibold">
                CONSEQUENCE EVALUATION // {activeBranch.name}
              </span>
              <h3 className="font-serif text-2xl text-[var(--hero-navy)] font-normal mt-1">
                {activeBranch.title}
              </h3>
            </div>
            <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-xs font-semibold rounded-full shrink-0">
              {activeBranch.stabilityIndex}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-sans font-light">
            {/* Consideration */}
            <div className="p-5 bg-white rounded-sm border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--hero-gold)] font-bold uppercase tracking-wider mb-2">
                <CheckCircle className="h-4 w-4" />
                <span>Strategic Consideration</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{activeBranch.consideration}</p>
            </div>

            {/* Possible Consequence */}
            <div className="p-5 bg-white rounded-sm border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-800 font-bold uppercase tracking-wider mb-2">
                <Layers className="h-4 w-4" />
                <span>Projected Consequence</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{activeBranch.consequence}</p>
            </div>

            {/* Stakeholder Effect */}
            <div className="p-5 bg-white rounded-sm border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-800 font-bold uppercase tracking-wider mb-2">
                <Users className="h-4 w-4" />
                <span>Stakeholder & Coalition Impact</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{activeBranch.stakeholderEffect}</p>
            </div>

            {/* Trade-off */}
            <div className="p-5 bg-white rounded-sm border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono text-rose-800 font-bold uppercase tracking-wider mb-2">
                <Scale className="h-4 w-4" />
                <span>Critical Trade-Off & Risk</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{activeBranch.tradeOff}</p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[0.6875rem] font-mono text-slate-500">
            <span>METHODOLOGY: MULTI-AGENT STOCHASTIC SIMULATION</span>
            <span className="text-[var(--hero-navy)] font-semibold">AIPP STRATEGY ROOM ENGINE</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
