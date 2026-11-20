"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function StrategyRoomShowcase() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF9F5] text-slate-900 border-b border-[var(--color-border)] relative overflow-hidden" aria-label="The Strategy Room Environment">
      <Container>
        {/* Section Lead */}
        <ScrollReveal variant="fade-up" className="max-w-2xl mb-10">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-2">
            IMMERSIVE PRAXIS ENVIRONMENT
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--hero-navy)] font-normal leading-tight">
            The Strategy Room in Practice.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-sans font-light">
            Where senior women diplomats, negotiators, and policy strategists gather to stress-test geopolitical scenarios, negotiate multilateral accords, and build shared tactical command.
          </p>
        </ScrollReveal>

        {/* Large Editorial Stage with Women-Only Strategy Imagery */}
        <ScrollReveal variant="image" delay={100} className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-sm overflow-hidden border border-slate-200 shadow-xl">
          <Image
            src="/ideas-strategy.jpg"
            alt="Women diplomats and policy strategists actively deliberating during a high-stakes multilateral simulation"
            fill
            className="object-cover filter contrast-[1.02] brightness-[1.0]"
          />

          {/* Gentle Subtle Bottom Vignette for Quote Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E]/80 via-transparent to-transparent" />

          {/* Minimalist Coordinate Overlays & Strategic Vectors */}
          <div className="absolute top-6 left-6 font-mono text-xs text-[var(--hero-navy)] tracking-wider bg-white/90 backdrop-blur-md px-4 py-1.5 border border-slate-200 rounded-full shadow-xs">
            SESSION: MULTILATERAL CRISIS LAB // IMMERSIVE SIMULATION
          </div>

          <div className="absolute top-6 right-6 font-mono text-xs text-slate-700 tracking-wider bg-white/90 backdrop-blur-md px-4 py-1.5 border border-slate-200 rounded-full hidden sm:block shadow-xs">
            COORD: WAR-ROOM-DELTA-4 · LIVE SIMULATION
          </div>

          {/* Corner Strategic Crosshairs */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-md bg-white/95 backdrop-blur-md p-5 sm:p-6 border border-slate-200 rounded-sm shadow-lg">
              <span className="font-mono text-[0.625rem] text-[var(--hero-gold)] uppercase tracking-wider block mb-1 font-bold">
                TACTICAL FOCUS
              </span>
              <p className="font-serif text-base sm:text-lg text-[var(--hero-navy)] font-normal leading-snug">
                “When women diplomats command the negotiation table, the entire geometry of statecraft expands.”
              </p>
            </div>

            <div className="font-mono text-[0.6875rem] text-[var(--hero-navy)] font-semibold bg-white/95 backdrop-blur-md px-4 py-2 border border-slate-200 rounded-full shrink-0 shadow-xs">
              <span>STATUS: TRACK-I CHAIR BRIEFING</span>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
