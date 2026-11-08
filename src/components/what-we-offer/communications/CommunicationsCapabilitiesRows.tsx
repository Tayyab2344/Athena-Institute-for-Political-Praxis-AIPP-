"use client";

import { useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { ArrowUpRight, Radio, Megaphone, Users, BookOpen, Tv, Flag } from "lucide-react";

interface CapabilityRow {
  number: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  deliverables: string[];
}

const CAPABILITIES: CapabilityRow[] = [
  {
    number: "01",
    title: "Strategic Communication",
    tagline: "Architecting Authoritative Diplomatic Narratives",
    description:
      "Developing unyielding, compelling core narratives that help complex foreign policy propositions reach and persuade prime ministers, delegates, and international editors.",
    image: "/ideas-advocacy.jpg",
    deliverables: ["Institutional Narrative Playbooks", "Message Architecture Memos", "High-Level Talking Points"],
  },
  {
    number: "02",
    title: "Public Advocacy",
    tagline: "Sustained Coalition Campaigns for Systemic Reform",
    description:
      "Mobilizing international support around non-partisan gender inclusion, treaty monitoring, and sovereign governance across multilateral institutions.",
    image: "/offer-women-summit.jpg",
    deliverables: ["Multilateral Signatory Coalitions", "Policy Reform Briefings", "Parliamentary Testimony Briefs"],
  },
  {
    number: "03",
    title: "Public Dialogue",
    tagline: "Convening Cross-Sector Symposia & Track-1.5 Tables",
    description:
      "Facilitating structured exchanges that bring polarized diplomatic factions into neutral, high-trust spaces where constructive breakthroughs are forged.",
    image: "/ideas-strategy.jpg",
    deliverables: ["Track-1.5 Colloquia", "Chatham House Rule Dialogues", "Bilateral Roundtables"],
  },
  {
    number: "04",
    title: "Storytelling",
    tagline: "Humanizing Technical Treaty Provisions",
    description:
      "Deploying rigorous narrative craft to articulate how abstract international accords directly affect human security, sovereign borders, and future generations.",
    image: "/ideas-research.jpg",
    deliverables: ["Longform Policy Essays", "Documentary Video Case Studies", "Diplomatic Oral Histories"],
  },
  {
    number: "05",
    title: "Media Engagement",
    tagline: "Global Broadcast & Op-Ed Syndication",
    description:
      "Preparing female ambassadors and research fellows for high-pressure television broadcast interviews, press conferences, and international op-ed syndication.",
    image: "/hero-diplomat.jpg",
    deliverables: ["Tier-1 Op-Ed Syndication", "Live Television Broadcast Prep", "International Press Conferences"],
  },
  {
    number: "06",
    title: "Campaign Communication",
    tagline: "Multi-Channel Momentum for Strategic Initiatives",
    description:
      "Designing and executing coordinated multi-stakeholder advocacy initiatives that build public momentum and open windows for statutory legislative adoption.",
    image: "/offer-women-summit.jpg",
    deliverables: ["Global Digital Campaigns", "Stakeholder Mobilization Toolkits", "Multilateral Summit Activations"],
  },
];

export default function CommunicationsCapabilitiesRows() {
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);
  const active = CAPABILITIES[hoveredIdx];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-[var(--color-border)]" aria-label="Communications Capabilities Rows">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-3">
            COMMUNICATION SUITE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--hero-navy)] font-normal leading-tight">
            Communications Capabilities Rows.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--hero-muted)] font-sans font-light">
            Every capability is designed to bridge private institutional research into public global momentum.
          </p>
        </div>

        {/* Editorial Magazine Split: Large Rows (Left 7) + Live Image Preview (Right 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Large Rows */}
          <div className="lg:col-span-7 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {CAPABILITIES.map((cap, idx) => {
              const isSelected = hoveredIdx === idx;
              return (
                <div
                  key={cap.number}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className={`py-6 px-4 cursor-pointer transition-all duration-300 ${
                    isSelected ? "bg-slate-50/90 shadow-sm" : "hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6">
                      <span
                        className={`font-serif text-2xl sm:text-3xl transition-all duration-300 ${
                          isSelected
                            ? "text-[var(--hero-gold)] font-medium translate-x-1"
                            : "text-slate-300"
                        }`}
                      >
                        {cap.number}
                      </span>
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl text-[var(--hero-navy)] font-medium leading-snug">
                          {cap.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1 leading-relaxed">
                          {cap.tagline}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isSelected
                          ? "text-[var(--hero-gold)] translate-x-1 -translate-y-1"
                          : "text-slate-300"
                      }`}
                    />
                  </div>

                  {/* Description reveals on hover */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isSelected ? "max-h-24 opacity-100 mt-3 pt-3 border-t border-slate-200/60" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-xs text-slate-600 font-sans font-light leading-relaxed">
                      {cap.description}
                    </p>
                  </div>

                  {/* Gold line expands */}
                  <div
                    className={`h-[2px] bg-[var(--hero-gold)] transition-all duration-300 mt-4 ${
                      isSelected ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Live Image & Deliverable Preview Panel */}
          <div className="lg:col-span-5 sticky top-36">
            <div className="border border-[var(--color-border)] rounded-sm overflow-hidden bg-white shadow-xl">
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white font-mono text-xs">
                  <span className="text-[var(--hero-gold)] block uppercase text-[0.625rem]">
                    PRACTICE FIELD // {active.number}
                  </span>
                  <span className="font-serif text-sm">{active.title}</span>
                </div>
              </div>

              <div className="p-6">
                <span className="font-mono text-[0.625rem] font-bold uppercase text-[var(--hero-navy)] tracking-wider block mb-2">
                  KEY DELIVERABLES:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {active.deliverables.map((del) => (
                    <span
                      key={del}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-xs rounded-sm border border-slate-200"
                    >
                      {del}
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>DISPATCH: GLOBAL MEDIA HUB</span>
                  <span className="text-[var(--hero-gold)] font-bold">AIPP STUDIO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
