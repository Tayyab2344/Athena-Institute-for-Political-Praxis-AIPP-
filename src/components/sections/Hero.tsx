"use client";

import { HERO_DATA } from "@/data/mockData";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 bg-[#FAF8F5] flex flex-col justify-between overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-96 bg-[#4A121A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-1/4 h-80 bg-[#A8656C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          
          <div className="lg:col-span-7 flex flex-col items-start space-y-8">
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-[#4A121A]/20 bg-[#4A121A]/5">
              <span className="w-2 h-2 rounded-full bg-[#4A121A] animate-pulse" />
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#4A121A]">
                {HERO_DATA.eyebrow}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.08] text-[#1A1817] tracking-tight">
              Women shaping the <span className="italic font-serif text-[#4A121A]">conversations</span> that shape our world.
            </h1>

            <p className="text-lg md:text-xl font-sans text-[#5C5755] font-light max-w-2xl leading-relaxed">
              {HERO_DATA.description}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href={HERO_DATA.primaryCta.href}
                className="group px-7 py-4 rounded-full bg-[#4A121A] text-[#FAF8F5] text-sm font-sans font-semibold tracking-wider hover:bg-[#6A1B27] transition-all duration-300 flex items-center gap-3 shadow-lg shadow-[#4A121A]/15"
              >
                <span>{HERO_DATA.primaryCta.text}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={HERO_DATA.secondaryCta.href}
                className="group px-7 py-4 rounded-full border border-[#1A1817]/20 text-[#1A1817] hover:border-[#4A121A] hover:text-[#4A121A] text-sm font-sans font-medium tracking-wider transition-all duration-300"
              >
                <span>{HERO_DATA.secondaryCta.text}</span>
              </a>
            </div>

            <div className="pt-8 border-t border-[#4A121A]/10 w-full grid grid-cols-3 gap-6">
              <div>
                <span className="block font-serif text-2xl md:text-3xl text-[#4A121A]">01</span>
                <span className="text-xs font-sans uppercase tracking-wider text-[#5C5755] font-medium">Research</span>
              </div>
              <div>
                <span className="block font-serif text-2xl md:text-3xl text-[#4A121A]">02</span>
                <span className="text-xs font-sans uppercase tracking-wider text-[#5C5755] font-medium">Strategy</span>
              </div>
              <div>
                <span className="block font-serif text-2xl md:text-3xl text-[#4A121A]">03</span>
                <span className="text-xs font-sans uppercase tracking-wider text-[#5C5755] font-medium">Advocacy</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#4A121A]/10 aspect-[4/5] group">
              <img
                src={HERO_DATA.mainImage}
                alt="Women diplomats in session at international summit"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1817]/70 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#FAF8F5]/90 backdrop-blur-md border border-[#FAF8F5]/30">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#4A121A] block mb-1">
                  Institutional Focus
                </span>
                <p className="font-serif text-sm text-[#1A1817] italic">
                  "Multilateral peace building is strongest when women hold decision-making seats."
                </p>
              </div>
            </div>

            <div className="hidden sm:block absolute -bottom-8 -left-10 w-44 h-56 rounded-xl overflow-hidden shadow-xl border-2 border-[#FAF8F5]">
              <img
                src={HERO_DATA.secondaryImage}
                alt="Diplomat addressing assembly"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pt-12 flex items-center justify-between text-xs text-[#5C5755]">
        <div className="flex items-center gap-2 font-sans tracking-wider uppercase text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4A121A]" />
          <span>Athena Institute for Political Praxis</span>
        </div>

        <a
          href="#about"
          className="flex items-center gap-2 text-[#4A121A] hover:text-[#6A1B27] transition-colors group"
        >
          <span className="font-sans text-[11px] font-medium tracking-wider uppercase">Scroll to Explore</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}
