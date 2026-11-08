"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";

export default function PublicSpeakingStage() {
  const editorialTags = [
    { label: "PUBLIC DIALOGUE", coordinate: "top-8 left-8", align: "text-left" },
    { label: "LEADERSHIP", coordinate: "top-8 right-8", align: "text-right" },
    { label: "ADVOCACY", coordinate: "bottom-8 left-8", align: "text-left" },
    { label: "VOICE", coordinate: "bottom-8 right-8", align: "text-right" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FAF9F6] border-b border-[var(--color-border)]" aria-label="Public Speaking Immersive Stage">
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-3">
            THE ROSTRUM OF STATECRAFT
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--hero-navy)] font-normal leading-tight">
            The Public Speaking Visual.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--hero-muted)] font-sans font-light">
            When women leaders step forward to address international assemblies, they do not simply speak — they reshape normative consensus.
          </p>
        </div>

        {/* Large Immersive Editorial Image Stage */}
        <div className="relative w-full h-[480px] sm:h-[580px] lg:h-[680px] rounded-sm overflow-hidden border border-[var(--color-border)] shadow-2xl">
          <Image
            src="/offer-women-summit.jpg"
            alt="Woman diplomat speaking before a distinguished international assembly"
            fill
            className="object-cover filter contrast-[1.04] brightness-[0.94]"
          />

          {/* Editorial Vignette Layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E]/90 via-transparent to-[#081D2E]/30" />

          {/* Integrated Editorial Typography Labels */}
          {editorialTags.map((tag) => (
            <div
              key={tag.label}
              className={`absolute ${tag.coordinate} ${tag.align} z-10`}
            >
              <div className="bg-slate-950/70 backdrop-blur-md px-3.5 py-1.5 border border-white/20 rounded-sm font-mono text-[0.6875rem] font-bold tracking-[0.25em] text-[var(--hero-gold)] uppercase shadow-lg">
                {tag.label}
              </div>
            </div>
          ))}

          {/* Center Subtle Frame Lines */}
          <div className="absolute inset-12 border border-white/10 pointer-events-none hidden sm:block" />

          {/* Bottom Center Quote Overlay */}
          <div className="absolute bottom-10 left-6 right-6 max-w-xl mx-auto text-center z-10">
            <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl text-white font-light leading-snug">
              “Power in the international arena belongs to those who define the terms of public conversation.”
            </blockquote>
            <span className="font-mono text-xs text-[var(--hero-gold)] block mt-3 uppercase tracking-widest">
              Ambassadorial Plenary · Geneva Assembly
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
