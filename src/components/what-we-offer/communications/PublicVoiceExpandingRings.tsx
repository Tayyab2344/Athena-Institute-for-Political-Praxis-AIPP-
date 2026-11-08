"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { Radio, Sparkles, MessageSquare, Volume2, Globe, Megaphone } from "lucide-react";

interface VoiceTier {
  id: string;
  name: string;
  ringRadius: number;
  tagline: string;
  description: string;
  icon: React.ElementType;
  praxisMechanism: string;
}

const VOICE_TIERS: VoiceTier[] = [
  {
    id: "message",
    name: "MESSAGE",
    ringRadius: 55,
    tagline: "The Core Analytical Thesis",
    description:
      "Stripping away jargon to formulate an unyielding, memorable central proposition that anchors foreign policy intent.",
    icon: Sparkles,
    praxisMechanism: "Doctrinal framing & policy soundbites",
  },
  {
    id: "story",
    name: "STORY",
    ringRadius: 95,
    tagline: "Humanizing Sovereign Complexities",
    description:
      "Translating abstract treaty provisions into visceral human narratives that resonate beyond institutional conference rooms.",
    icon: MessageSquare,
    praxisMechanism: "Narrative architecture & lived diplomacy",
  },
  {
    id: "dialogue",
    name: "DIALOGUE",
    ringRadius: 135,
    tagline: "Facilitating Bilateral Exchange",
    description:
      "Creating neutral, structured spaces for adversarial parties to speak, listen, and discover unexpected consensus.",
    icon: Volume2,
    praxisMechanism: "Track-1.5 summits & ambassadorial roundtables",
  },
  {
    id: "media",
    name: "MEDIA",
    ringRadius: 175,
    tagline: "International Press Amplification",
    description:
      "Equipping female leaders with broadcast command, op-ed placement in top global periodicals, and digital syndication.",
    icon: Radio,
    praxisMechanism: "Tier-1 news syndication & broadcast preparation",
  },
  {
    id: "advocacy",
    name: "ADVOCACY",
    ringRadius: 215,
    tagline: "Sustained Coalition Momentum",
    description:
      "Mobilizing civil society, parliamentary alliances, and international bodies into coordinated multi-year reform campaigns.",
    icon: Megaphone,
    praxisMechanism: "Legislative lobbying & signatory mobilization",
  },
  {
    id: "influence",
    name: "INFLUENCE",
    ringRadius: 255,
    tagline: "Statutory & Normative Transformation",
    description:
      "The ultimate objective: ratified peace treaties, amended statutory laws, and irreversible institutional governance benchmarks.",
    icon: Globe,
    praxisMechanism: "Ratified protocols & permanent policy doctrine",
  },
];

export default function PublicVoiceExpandingRings() {
  const [hoveredTierId, setHoveredTierId] = useState<string>("influence");
  const activeTier = VOICE_TIERS.find((t) => t.id === hoveredTierId) || VOICE_TIERS[5];
  const IconComponent = activeTier.icon;

  return (
    <section
      id="public-voice"
      className="py-20 lg:py-28 bg-white border-b border-[var(--color-border)] relative overflow-hidden"
      aria-label="Public Voice Expanding Rings"
    >
      <Container>
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-3">
            THE ANATOMY OF INFLUENCE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--hero-navy)] font-normal leading-tight">
            The Public Voice: Expanding Concentric Rings.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--hero-muted)] font-sans font-light">
            Public influence does not happen in a vacuum. It radiates outwards from a single articulate proposition, propagating across stories, bilateral dialogue, global media, and statutory reform.
          </p>
        </div>

        {/* Interactive Radial Stage (Left 7 cols) + Live Tier Explanation Card (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Radial Expanding Concentric Rings SVG Canvas */}
          <div className="lg:col-span-7 relative h-[440px] sm:h-[500px] w-full bg-[#FAF9F6] border border-[var(--color-border)] rounded-sm p-4 flex items-center justify-center overflow-hidden shadow-inner voice-radial-glow">
            <svg className="w-full h-full" viewBox="0 0 600 600" fill="none">
              {/* Concentric Rings */}
              {VOICE_TIERS.map((tier, idx) => {
                const isHovered = hoveredTierId === tier.id;
                return (
                  <g
                    key={tier.id}
                    onMouseEnter={() => setHoveredTierId(tier.id)}
                    className="cursor-pointer group"
                  >
                    {/* Ring Circle */}
                    <circle
                      cx="300"
                      cy="300"
                      r={tier.ringRadius}
                      stroke={isHovered ? "var(--hero-gold)" : "#CBD5E1"}
                      strokeWidth={isHovered ? "2.5" : "1"}
                      strokeDasharray={isHovered ? "none" : "6 4"}
                      fill={isHovered ? "rgba(176, 156, 75, 0.08)" : "none"}
                      className="transition-all duration-300 ease-out"
                    />

                    {/* Ring Orbit Label Marker */}
                    <rect
                      x="300"
                      y={300 - tier.ringRadius - 10}
                      width="80"
                      height="20"
                      rx="2"
                      fill={isHovered ? "var(--hero-navy)" : "#FFFFFF"}
                      stroke={isHovered ? "var(--hero-gold)" : "#D9DEE2"}
                      strokeWidth="1"
                      className="transition-colors duration-300"
                    />
                    <text
                      x="340"
                      y={300 - tier.ringRadius + 3}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill={isHovered ? "#B09C4B" : "#475569"}
                    >
                      {tier.name}
                    </text>
                  </g>
                );
              })}

              {/* Central Core: The Word "VOICE" */}
              <circle cx="300" cy="300" r="28" fill="var(--hero-navy)" />
              <circle cx="300" cy="300" r="24" stroke="var(--hero-gold)" strokeWidth="1.5" fill="none" />
              <text
                x="300"
                y="304"
                fontSize="10"
                fontFamily="serif"
                fontWeight="bold"
                letterSpacing="1"
                textAnchor="middle"
                fill="#FFFFFF"
              >
                VOICE
              </text>
            </svg>

            {/* Hint overlay */}
            <div className="absolute bottom-3 left-4 right-4 flex justify-between font-mono text-[0.625rem] text-slate-400 border-t border-slate-200/80 pt-2">
              <span>INTERACTIVE RADIAL MODEL</span>
              <span className="text-[var(--hero-gold)]">HOVER ANY RING TO EXPAND</span>
            </div>
          </div>

          {/* Right Live Explanation Card */}
          <div className="lg:col-span-5 bg-white border border-[var(--color-border)] p-8 rounded-sm shadow-xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-sm bg-[var(--hero-navy)] text-[var(--hero-gold)] flex items-center justify-center">
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--hero-gold)] block">
                  ORBITAL TIER: {activeTier.name}
                </span>
                <span className="font-serif text-lg text-[var(--hero-navy)] font-medium leading-tight">
                  {activeTier.tagline}
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm sm:text-base text-slate-600 font-sans font-light leading-relaxed">
              {activeTier.description}
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <span className="font-mono text-[0.625rem] font-bold uppercase text-[var(--hero-navy)] tracking-wider block mb-2">
                AIPP PRAXIS MECHANISM:
              </span>
              <p className="font-sans text-xs font-semibold text-[var(--hero-gold)] bg-[#FCFBF8] p-3 rounded-sm border border-slate-200">
                {activeTier.praxisMechanism}
              </p>
            </div>

            {/* Quick selector pills for mobile / direct touch */}
            <div className="mt-8 pt-4 border-t border-slate-100">
              <span className="font-mono text-[0.625rem] text-slate-400 uppercase tracking-wider block mb-2">
                SELECT TIER DIRECTLY:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {VOICE_TIERS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setHoveredTierId(t.id)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-sm transition-all ${
                      hoveredTierId === t.id
                        ? "bg-[var(--hero-navy)] text-[var(--hero-gold)] font-bold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
