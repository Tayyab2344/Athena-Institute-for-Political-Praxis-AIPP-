"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { ArrowRight, Lightbulb, MessageCircle, BookOpen, Users, Radio, Globe2 } from "lucide-react";

interface JourneyStage {
  step: string;
  title: string;
  tagline: string;
  description: string;
  realWorldExample: string;
  marker: string;
  icon: React.ElementType;
}

const JOURNEY_STAGES: JourneyStage[] = [
  {
    step: "01",
    title: "IDEA",
    tagline: "An Uncomfortable Perspective Takes Shape",
    description:
      "A rigorous analytical insight emerges from field research: that existing diplomatic conventions are structurally excluding vital female negotiating agency.",
    realWorldExample: "Empirical study on peace treaty longevity vs female delegations.",
    marker: "GENESIS // EMPIRICAL DISCOVERY",
    icon: Lightbulb,
  },
  {
    step: "02",
    title: "MESSAGE",
    tagline: "Sharpening the Doctrinal Core",
    description:
      "Translating 60 pages of econometric regression into an unshakeable, 3-point ministerial briefing proposition that cuts through diplomatic bureaucracy.",
    realWorldExample: "Executive Policy Brief: 'Praxis Accords for Chief Envoys'.",
    marker: "SYNTHESIS // MINISTERIAL MEMO",
    icon: MessageCircle,
  },
  {
    step: "03",
    title: "STORY",
    tagline: "Humanizing Sovereign Stakes",
    description:
      "Giving abstract security protocols human dimension through the testimonies of female envoys who negotiated ceasefires in contested territories.",
    realWorldExample: "Longform narrative essay published in international foreign affairs journal.",
    marker: "NARRATIVE // LIVED DIPLOMACY",
    icon: BookOpen,
  },
  {
    step: "04",
    title: "DIALOGUE",
    tagline: "Entering the International Arena",
    description:
      "Convening closed-door roundtables and public symposia in Geneva, Brussels, and Vienna where diplomats and civil society directly debate the proposed doctrine.",
    realWorldExample: "Ambassadorial Colloquium with 18 permanent missions.",
    marker: "SUMMIT // TRACK-1.5 ENGAGEMENT",
    icon: Users,
  },
  {
    step: "05",
    title: "PUBLIC ENGAGEMENT",
    tagline: "International Press Syndication",
    description:
      "Syndicating opinion editorials, televised expert panels, and digital campaigns that generate global public interest and parliamentary pressure.",
    realWorldExample: "Op-ed series syndicated across 14 global publications in 6 languages.",
    marker: "BROADCAST // MEDIA MOMENTUM",
    icon: Radio,
  },
  {
    step: "06",
    title: "INFLUENCE",
    tagline: "Institutional & Statutory Ratification",
    description:
      "The ultimate culmination: formal adoption of binding female representation protocols within multilateral security frameworks and bilateral treaties.",
    realWorldExample: "Binding treaty amendment ratified by 32 signatory nations.",
    marker: "PRAXIS // STATUTORY CODIFICATION",
    icon: Globe2,
  },
];

export default function CommunicationJourney() {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const current = JOURNEY_STAGES[activeStepIdx];
  const CurrentIcon = current.icon;

  return (
    <section className="py-20 lg:py-28 bg-[#FBFBFA] border-b border-[var(--color-border)] relative" aria-label="Communication Journey from Idea to Influence">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-3">
            STRATEGIC PROPAGATION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--hero-navy)] font-normal leading-tight">
            The Communication Journey: From Idea to Influence.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--hero-muted)] font-sans font-light">
            A comprehensive visual progression showing how a single policy thesis travels from private inquiry into binding international treaty consensus.
          </p>
        </div>

        {/* Horizontal Editorial Timeline (Desktop) / Vertical (Mobile) */}
        <div className="border border-[var(--color-border)] bg-white shadow-sm rounded-sm mb-8 overflow-x-auto no-scrollbar">
          <div className="flex min-w-[720px]">
            {JOURNEY_STAGES.map((s, idx) => {
              const isActive = activeStepIdx === idx;
              const StepIcon = s.icon;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`flex-1 p-4 lg:p-5 text-left border-r border-[var(--color-border)] last:border-r-0 transition-all relative ${
                    isActive ? "bg-slate-50/80 shadow-inner" : "hover:bg-slate-50/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-serif text-sm font-semibold ${
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
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--hero-gold)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Editorial Dossier Sheet */}
        <div className="paper-layer p-8 sm:p-12 border border-[var(--color-border)] rounded-sm relative overflow-hidden bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 bg-[var(--hero-navy)] text-white font-mono text-xs font-semibold tracking-wider">
                  STAGE {current.step}
                </span>
                <span className="font-mono text-xs text-[var(--hero-gold)] uppercase tracking-wider">
                  {current.marker}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[var(--hero-navy)] font-normal leading-snug">
                {current.tagline}
              </h3>

              <p className="mt-4 text-sm sm:text-base text-slate-600 font-sans font-light leading-relaxed">
                {current.description}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <span className="block font-mono text-[0.625rem] text-slate-400 uppercase mb-1">
                  REAL-WORLD PRAXIS EXPRESSION:
                </span>
                <p className="font-serif text-sm sm:text-base text-[var(--hero-navy)] italic">
                  “{current.realWorldExample}”
                </p>
              </div>
            </div>

            {/* Right Side Visual Stage Display */}
            <div className="lg:col-span-5 bg-[#FAF9F6] border border-slate-200 p-6 rounded-sm font-mono text-xs text-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-bold text-[var(--hero-navy)] tracking-wider">
                  VOICE PIPELINE // STAGE {current.step}
                </span>
                <CurrentIcon className="h-5 w-5 text-[var(--hero-gold)]" />
              </div>

              <div className="space-y-2 text-[0.6875rem]">
                <div className="flex justify-between">
                  <span className="text-slate-400">AMPLIFICATION:</span>
                  <span className="text-emerald-700 font-bold">OPTIMAL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AUDIENCE QUORUM:</span>
                  <span>GLOBAL PUBLIC & INSTITUTIONS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">TRANSLATION:</span>
                  <span>MULTILINGUAL BROADCAST</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {JOURNEY_STAGES.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-5 rounded-full transition-colors ${
                        i === activeStepIdx ? "bg-[var(--hero-gold)]" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    setActiveStepIdx((prev) => (prev + 1) % JOURNEY_STAGES.length)
                  }
                  className="inline-flex items-center gap-1 text-[0.6875rem] font-bold text-[var(--hero-navy)] hover:text-[var(--hero-gold)] transition-colors"
                >
                  <span>Advance Stage</span>
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
