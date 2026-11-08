"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";

export default function StrategyRoomShowcase() {
  return (
    <section className="py-20 lg:py-28 bg-[#051320] text-white border-b border-slate-800 relative overflow-hidden" aria-label="The Strategy Room Environment">
      <Container>
        {/* Section Lead */}
        <div className="max-w-2xl mb-10">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-3">
            IMMERSIVE PRAXIS ENVIRONMENT
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
            The Strategy Room in Practice.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 font-sans font-light">
            Where senior women diplomats, negotiators, and policy strategists gather to stress-test geopolitical scenarios, negotiate multilateral accords, and build shared tactical command.
          </p>
        </div>

        {/* Large Editorial Stage with Women-Only Strategy Imagery */}
        <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] rounded-sm overflow-hidden border border-slate-800 shadow-2xl">
          <Image
            src="/ideas-strategy.jpg"
            alt="Women diplomats and policy strategists actively deliberating during a high-stakes multilateral simulation"
            fill
            className="object-cover filter contrast-[1.05] brightness-[0.92]"
          />

          {/* Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#051320] via-transparent to-[#051320]/40" />

          {/* Minimalist Coordinate Overlays & Strategic Vectors */}
          <div className="absolute top-6 left-6 font-mono text-[0.625rem] text-[var(--hero-gold)] tracking-widest bg-slate-950/70 backdrop-blur-md px-3 py-1.5 border border-slate-800 rounded-sm">
            SESSION: MULTILATERAL CRISIS LAB // GENEVA
          </div>

          <div className="absolute top-6 right-6 font-mono text-[0.625rem] text-slate-300 tracking-widest bg-slate-950/70 backdrop-blur-md px-3 py-1.5 border border-slate-800 rounded-sm hidden sm:block">
            COORD: WAR-ROOM-DELTA-4 · LIVE SIMULATION
          </div>

          {/* Corner Strategic Crosshairs */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-md bg-slate-950/80 backdrop-blur-md p-5 border border-slate-800/80 rounded-sm">
              <span className="font-mono text-[0.625rem] text-[var(--hero-gold)] uppercase tracking-wider block mb-1">
                TACTICAL FOCUS
              </span>
              <p className="font-serif text-base sm:text-lg text-white font-light">
                “When women diplomats command the negotiation table, the entire geometry of statecraft expands.”
              </p>
            </div>

            <div className="font-mono text-[0.6875rem] text-slate-400 bg-slate-950/80 backdrop-blur-md px-4 py-2 border border-slate-800 rounded-sm shrink-0">
              <span>STATUS: TRACK-I CHAIR BRIEFING</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
