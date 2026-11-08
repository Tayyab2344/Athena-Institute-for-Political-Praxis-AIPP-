"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mic, Radio, Volume2 } from "lucide-react";
import Container from "@/components/ui/Container";

export default function CommunicationsHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 bg-[#FAF9F5] border-b border-[var(--color-border)]" aria-label="Communications and Public Advocacy Hero">
      <Container>
        {/* Cinematic Split-Screen Grid: Left Image (6 cols) + Gold Divider + Right Typography (6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Cinematic Woman Speaker Image Stage (~50%) */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[440px] sm:h-[500px] lg:h-[560px] w-full rounded-sm overflow-hidden border border-[var(--color-border)] shadow-xl group">
              <Image
                src="/ideas-advocacy.jpg"
                alt="Distinguished woman diplomat addressing an international public forum from the podium"
                fill
                className="object-cover filter contrast-[1.04] brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />

              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E]/85 via-transparent to-transparent" />

              {/* Speaker Metadata Callout */}
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs">
                <span className="font-mono text-[0.625rem] text-[var(--hero-gold)] uppercase tracking-widest block mb-1">
                  AMBASSADORIAL PLENARY // GENEVA
                </span>
                <p className="font-serif text-base sm:text-lg font-light leading-snug">
                  “Policy without a public voice remains an institutional secret.”
                </p>
              </div>

              {/* Live Audio / Broadcast Badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 border border-slate-200 text-xs font-mono text-[var(--hero-navy)] rounded-sm">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span className="font-bold tracking-wider">LIVE KEYNOTE ADDRESS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Typography with Staggered Entrance (~50%) */}
          <div className="lg:col-span-6 relative flex flex-col justify-center lg:pl-6">
            {/* Subtle Gold Vertical Divider Line on Desktop */}
            <div className="hidden lg:block absolute left-0 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-[var(--hero-gold)] to-transparent" />

            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[var(--hero-gold)]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hero-gold)]">
                03 / COMMUNICATIONS & PUBLIC ADVOCACY
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-normal leading-[1.08] text-[var(--hero-navy)] tracking-tight">
              Give Important Ideas a Public Voice.
            </h1>

            <p className="mt-5 text-sm sm:text-base leading-relaxed text-[var(--hero-muted)] font-sans font-light max-w-lg">
              Research can inform. Strategy can prepare. But communication brings ideas into the public consciousness — creating the visibility, moral authority, and public momentum that make systemic change irreversible.
            </p>

            {/* Media Studio Indicators */}
            <div className="mt-6 pt-6 border-t border-[var(--color-border)] grid grid-cols-3 gap-3 font-mono text-[0.6875rem] text-[var(--hero-navy)]">
              <div>
                <span className="block text-[var(--hero-gold)] font-bold text-xs">GLOBAL PRESS</span>
                <span className="text-slate-500">Op-Ed Syndication</span>
              </div>
              <div>
                <span className="block text-[var(--hero-gold)] font-bold text-xs">BROADCAST</span>
                <span className="text-slate-500">Media Masterclasses</span>
              </div>
              <div>
                <span className="block text-[var(--hero-gold)] font-bold text-xs">ADVOCACY</span>
                <span className="text-slate-500">Coalition Building</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#public-voice"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--hero-navy)] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-all hover:bg-[var(--hero-gold)] hover:shadow-md font-sans"
              >
                <span>Explore Expanding Voice Rings</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="#perspectives-wall"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-[var(--color-border)] text-[var(--hero-navy)] bg-white text-xs font-semibold uppercase tracking-[0.14em] transition-all hover:border-[var(--hero-navy)] font-sans"
              >
                <span>Read Perspectives</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
