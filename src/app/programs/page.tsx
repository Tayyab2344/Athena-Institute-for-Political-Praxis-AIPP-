"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PROGRAMS_DATA } from "@/data/mockData";
import { Program } from "@/types";
import {
  ArrowUpRight,
  MapPin,
  Calendar,
  Users,
  Compass,
  CheckCircle2,
  ShieldAlert,
  Award,
  Layers,
  ChevronRight
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   AIPP Strategic Programs Hub: Editorial & Light Redesign
   - Brand Identity: Predominantly White & Soft Off-White surfaces
   - Typography: Cormorant Garamond display + Manrope body
   - Buttons: Strict rounded-full styling across all actions
   - Institutional Integrity: Tayyaba Atiq as Founder
   - Photography: 100% verified local women-centered photography
   - Sections: Hero, Mandate, Program Listings, Lifecycle, Closing
   ───────────────────────────────────────────────────────────── */

export default function ProgramsPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactPathway, setContactPathway] = useState("Fellowships & Programs");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const openContactWithProgram = (programName?: string) => {
    if (programName) {
      setContactPathway(`Program Inquiry: ${programName}`);
    } else {
      setContactPathway("Fellowships & Programs");
    }
    setIsContactOpen(true);
  };

  const categories = [
    { label: "All Programs", value: "ALL" },
    { label: "Simulations", value: "Simulation" },
    { label: "Workshops", value: "Workshop" },
    { label: "Strategic Summits", value: "Strategic Summit" },
    { label: "Fellowships", value: "Fellowship" }
  ];

  const filteredPrograms =
    selectedCategory === "ALL"
      ? PROGRAMS_DATA
      : PROGRAMS_DATA.filter((p) => p.category === selectedCategory);

  // The featured flagship program (Global Diplomatic Simulation Summit)
  const featuredProgram = PROGRAMS_DATA.find((p) => p.featured) || PROGRAMS_DATA[0];
  const standardPrograms = filteredPrograms.filter((p) =>
    selectedCategory === "ALL" ? p.id !== featuredProgram.id : true
  );

  return (
    <main className="min-h-screen bg-white text-[#081D2E] flex flex-col font-sans selection:bg-[#0D2C49] selection:text-white">
      {/* Global Navigation */}
      <Navbar onOpenContact={() => openContactWithProgram()} />

      {/* ─────────────────────────────────────────────────────────────
          Section 1: Programs Hero (Editorial & Light)
          ───────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-white text-[#081D2E] pt-28 sm:pt-32 pb-14 sm:pb-20 border-b border-[#D9DEE2]/70 overflow-hidden"
        aria-label="Programs Hero"
      >
        <Container wide>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Typography & Intentional Action (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Eyebrow Marker */}
              <div className="hero-animate-eyebrow flex items-center gap-3 mb-4 sm:mb-6">
                <span className="h-px w-6 bg-[#B09C4B]" />
                <span
                  className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49] uppercase"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  AIPP Institutional Programs &amp; Cohorts
                </span>
              </div>

              {/* Display Headline */}
              <h1
                className="hero-animate-heading text-[2.625rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.25rem] font-normal leading-[1.06] tracking-tight text-[#0D2C49] text-balance mb-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Equipping women leaders for high-stakes statecraft.
              </h1>

              {/* Supporting Lead Description */}
              <p
                className="hero-animate-body text-lg sm:text-[1.1875rem] leading-relaxed text-[#243748] font-normal max-w-2xl mb-8"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                From immersive crisis simulations and bilateral bargaining labs to executive assemblies and fellowships, AIPP prepares women leaders to navigate complex geopolitical tensions with empirical authority.
              </p>

              {/* Dual Restrained Action CTAs */}
              <div className="hero-animate-cta flex flex-wrap items-center gap-4">
                <a
                  href="#program-listings"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-base font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#081D2E] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>Explore Initiatives</span>
                  <ArrowUpRight className="h-4 w-4 text-[#B09C4B] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <button
                  type="button"
                  onClick={() => openContactWithProgram()}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9DEE2] bg-white px-6 py-3 text-base font-semibold text-[#081D2E] transition-all duration-200 hover:border-[#0D2C49] hover:bg-[#F7F7F7] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] cursor-pointer"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>Inquire for Cohorts</span>
                </button>
              </div>

              {/* Key Program Cohort Stats */}
              <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-[#D9DEE2]/80 max-w-xl">
                <div>
                  <span
                    className="text-2xl sm:text-3xl font-light text-[#0D2C49] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    4
                  </span>
                  <span
                    className="text-[0.6875rem] sm:text-xs font-semibold text-[#64717C] uppercase tracking-wider block mt-0.5"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Program Formats
                  </span>
                </div>
                <div>
                  <span
                    className="text-2xl sm:text-3xl font-light text-[#0D2C49] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    220+
                  </span>
                  <span
                    className="text-[0.6875rem] sm:text-xs font-semibold text-[#64717C] uppercase tracking-wider block mt-0.5"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Diplomats Trained
                  </span>
                </div>
                <div>
                  <span
                    className="text-2xl sm:text-3xl font-light text-[#0D2C49] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    38
                  </span>
                  <span
                    className="text-[0.6875rem] sm:text-xs font-semibold text-[#64717C] uppercase tracking-wider block mt-0.5"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Nations Connected
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Editorial Visual Composition (5 cols) */}
            <div className="hero-animate-image lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                
                {/* Framed Editorial Visual Showcase */}
                <div className="relative overflow-hidden rounded-2xl border border-[#D9DEE2] bg-[#FAF9F5] p-3 sm:p-4 shadow-sm">
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#0D2C49]">
                    <Image
                      src="/offer-women-summit.jpg"
                      alt="Women diplomatic leaders convened at international multilateral assembly"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
                      className="object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
                    />
                    
                    {/* Editorial Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081D2E]/95 via-[#081D2E]/50 to-transparent p-5 sm:p-6 pt-16">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B09C4B]" />
                        <p
                          className="text-xs uppercase tracking-widest text-[#B09C4B] font-semibold"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          Simulation Architecture
                        </p>
                      </div>
                      <p
                        className="text-base sm:text-lg text-white font-medium mt-1 leading-snug"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Multilateral Crisis Assembly · Geneva Policy Forum
                      </p>
                    </div>
                  </div>

                  {/* Refined Metadata Strip */}
                  <div className="mt-3.5 flex items-center justify-between px-2 py-1 text-xs text-[#64717C]">
                    <span className="font-semibold text-[#0D2C49]">AIPP Executive Division</span>
                    <span className="text-[#B09C4B] font-medium">Geneva &bull; Vienna &bull; Brussels</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Section 2: Programs Introduction & Institutional Pedagogy
          ───────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-[#F7F7F7] text-[#081D2E] py-14 sm:py-20 border-b border-[#D9DEE2]/80 overflow-hidden"
        aria-label="Programs Introduction"
      >
        <Container wide>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Institutional Framework */}
            <ScrollReveal variant="fade-up" className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#B09C4B]" />
                <span
                  className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49] uppercase"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Operational Pedagogy
                </span>
              </div>

              <h2
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.14] tracking-tight text-[#0D2C49]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Where empirical inquiry meets frontline diplomatic practice.
              </h2>

              <p
                className="text-base sm:text-lg text-[#243748] font-normal leading-relaxed pt-2"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Founded by <strong className="font-semibold text-[#0D2C49]">Tayyaba Atiq</strong>, the Athena Institute for Political Praxis bridges academic research with high-stress diplomatic practice. Our programs move beyond theoretical lectures into immersive Track-I wargaming, bilateral trade crisis labs, and institutional consensus-building.
              </p>
            </ScrollReveal>

            {/* Right Column: Four Program Disciplines */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              
              <ScrollReveal variant="fade-up" delay={0} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
                <div>
                  <span
                    className="text-xl font-light text-[#B09C4B] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    01
                  </span>
                  <h3
                    className="text-lg font-normal text-[#0D2C49] mt-2 mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Crisis Simulation Labs
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    High-intensity Track-I crisis wargaming testing de-escalation protocols under compressed 24-to-72-hour operational timelines.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-xs font-semibold text-[#0D2C49]">
                  Multilateral Wargaming
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={80} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
                <div>
                  <span
                    className="text-xl font-light text-[#B09C4B] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    02
                  </span>
                  <h3
                    className="text-lg font-normal text-[#0D2C49] mt-2 mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Mediation Masterclasses
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Advanced bilateral negotiation workshops focusing on leverage building, deadlock breaking, and treaty redline enforcement.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-xs font-semibold text-[#0D2C49]">
                  Tactical Mediation
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={160} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
                <div>
                  <span
                    className="text-xl font-light text-[#B09C4B] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    03
                  </span>
                  <h3
                    className="text-lg font-normal text-[#0D2C49] mt-2 mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Strategic Assemblies
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Annual ministerial summits connecting mid-career women envoys directly with ministers of foreign affairs and chief negotiators.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-xs font-semibold text-[#0D2C49]">
                  Leadership Forums
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={240} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
                <div>
                  <span
                    className="text-xl font-light text-[#B09C4B] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    04
                  </span>
                  <h3
                    className="text-lg font-normal text-[#0D2C49] mt-2 mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Executive Fellowships
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Sustained cohort mentorship, Track-I treaty drafting, and bilateral statecraft placement for emerging senior ambassadors.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-xs font-semibold text-[#0D2C49]">
                  Praxis Cohorts
                </div>
              </ScrollReveal>

            </div>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Section 3: Program Listings (Main Section)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="program-listings"
        className="relative w-full bg-white text-[#081D2E] py-14 sm:py-20 flex-grow scroll-mt-20 overflow-hidden"
        aria-label="Active Programs & Cohorts"
      >
        <Container wide>
          
          {/* Section Header */}
          <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#D9DEE2]">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#B09C4B]" />
                <span
                  className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49] uppercase"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Active Initiatives &amp; Assemblies
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.14] tracking-tight text-[#0D2C49]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Explore Strategic Programs &amp; Cohorts
              </h2>
              <p
                className="text-sm sm:text-base text-[#243748] font-normal leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Browse upcoming diplomatic simulations, mediation masterclasses, executive assemblies, and fellowships. Inquire to secure delegation placement.
              </p>
            </div>

            {/* Quick Cohort Badge */}
            <div className="shrink-0">
              <span
                className="inline-flex items-center gap-2 rounded-full border border-[#D9DEE2] bg-[#FAF9F5] px-4 py-2 text-xs font-semibold text-[#0D2C49]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <Compass className="w-3.5 h-3.5 text-[#B09C4B]" />
                <span>{filteredPrograms.length} Verified Initiatives</span>
              </span>
            </div>
          </ScrollReveal>

          {/* Category Filter Pills (Strict rounded-full styling) */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-6 mb-8">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap min-h-[40px] cursor-pointer ${
                    isActive
                      ? "bg-[#0D2C49] text-white shadow-xs"
                      : "bg-[#F7F7F7] text-[#243748] border border-[#D9DEE2] hover:border-[#0D2C49] hover:bg-white"
                  }`}
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* ─────────────────────────────────────────────────────────
              Featured Flagship Program Showcase (When Viewing "ALL")
              ───────────────────────────────────────────────────────── */}
          {selectedCategory === "ALL" && featuredProgram && (
            <ScrollReveal variant="fade-up" className="mb-12 relative overflow-hidden rounded-3xl border border-[#D9DEE2] bg-[#FAF9F5] p-6 sm:p-8 lg:p-10 shadow-xs hover:border-[#0D2C49]/40 transition-all duration-300 aipp-card-lift">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Column: Visual Showcase (5 cols) */}
                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0D2C49] border border-[#D9DEE2] shadow-xs">
                    <Image
                      src={featuredProgram.image}
                      alt={featuredProgram.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 500px"
                      className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E]/80 via-transparent to-transparent opacity-60" />
                    
                    {/* Floating pill badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0D2C49] text-white text-[0.6875rem] font-semibold uppercase tracking-wider shadow-xs">
                        Flagship Initiative
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Metadata & Narrative (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Badges and Logistics Row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-[#D9DEE2] text-[#0D2C49] text-[0.6875rem] font-semibold uppercase tracking-wider">
                      {featuredProgram.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#64717C] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#B09C4B]" />
                      <span>{featuredProgram.dates}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#64717C] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#B09C4B]" />
                      <span>{featuredProgram.location}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-2xl sm:text-3xl lg:text-[2.25rem] font-normal leading-tight text-[#0D2C49]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {featuredProgram.title}
                  </h3>

                  <p
                    className="text-xs uppercase tracking-widest text-[#B09C4B] font-semibold"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {featuredProgram.subtitle}
                  </p>

                  {/* Description */}
                  <p
                    className="text-sm sm:text-base text-[#243748] leading-relaxed font-normal pt-1"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {featuredProgram.description}
                  </p>

                  {/* Cohort Spec & Curriculum Modules */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#0D2C49] px-3 py-1.5 rounded-full bg-white border border-[#D9DEE2]">
                      Cohort: {featuredProgram.participants}
                    </span>
                    <span className="text-xs text-[#64717C] px-3 py-1.5 rounded-full bg-white border border-[#D9DEE2]">
                      Maritime Escalation Simulation
                    </span>
                    <span className="text-xs text-[#64717C] px-3 py-1.5 rounded-full bg-white border border-[#D9DEE2]">
                      Track-I Consensus Protocol
                    </span>
                  </div>

                  {/* Action Link (rounded-full) */}
                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => openContactWithProgram(featuredProgram.title)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#081D2E] hover:gap-3 cursor-pointer"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      <span>Inquire for Delegation Seat</span>
                      <ArrowUpRight className="h-4 w-4 text-[#B09C4B]" />
                    </button>

                    <Link
                      href="/what-we-offer/strategic-action-simulation"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9DEE2] bg-white px-5 py-3 text-sm font-semibold text-[#081D2E] transition-all duration-200 hover:border-[#0D2C49] hover:bg-[#F7F7F7]"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      <span>Simulation Methodology</span>
                    </Link>
                  </div>

                </div>

              </div>
            </ScrollReveal>
          )}

          {/* ─────────────────────────────────────────────────────────
              Standard Programs Grid (Refined Editorial Cards)
              ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {standardPrograms.map((program, idx) => (
              <ScrollReveal
                key={program.id}
                variant="fade-up"
                delay={idx * 60}
                as="article"
                className="group bg-white rounded-2xl border border-[#D9DEE2] overflow-hidden shadow-xs hover:border-[#0D2C49] hover:shadow-md transition-all duration-300 flex flex-col justify-between aipp-card-lift"
              >
                <div>
                  
                  {/* Program Image Header */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0D2C49]">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E]/80 via-transparent to-transparent opacity-50" />
                    
                    {/* Category pill */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 text-[#0D2C49] text-[0.6875rem] font-semibold uppercase tracking-wider backdrop-blur-xs">
                        {program.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6 sm:p-7 space-y-3">
                    
                    {/* Date & Location Logistics */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64717C]">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#B09C4B]" />
                        <span>{program.dates}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#B09C4B]" />
                        <span>{program.location}</span>
                      </span>
                    </div>

                    {/* Program Title */}
                    <h3
                      className="text-xl sm:text-[1.375rem] font-normal leading-snug text-[#0D2C49] group-hover:text-[#B09C4B] transition-colors"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {program.title}
                    </h3>

                    {/* Subtitle */}
                    <p
                      className="text-xs font-semibold text-[#0D2C49]/80 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {program.subtitle}
                    </p>

                    {/* Description */}
                    <p
                      className="text-xs sm:text-sm text-[#243748] font-normal leading-relaxed line-clamp-3 pt-1"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {program.description}
                    </p>

                  </div>

                </div>

                {/* Card Footer */}
                <div className="p-6 sm:p-7 pt-0">
                  <div className="pt-4 border-t border-[#D9DEE2] flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#64717C] font-medium">
                      <Users className="w-3.5 h-3.5 text-[#B09C4B]" />
                      <span>{program.participants}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => openContactWithProgram(program.title)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0D2C49] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-200 group-hover:bg-[#081D2E] group-hover:gap-2.5 cursor-pointer"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      <span>Inquire</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#B09C4B]" />
                    </button>
                  </div>
                </div>

              </ScrollReveal>
            ))}
          </div>

        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Section 4: Simulation Methodology & Pedagogical Lifecycle
          ───────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-[#FAF9F5] text-[#081D2E] py-14 sm:py-20 border-t border-[#D9DEE2] overflow-hidden"
        aria-label="Simulation Methodology"
      >
        <Container wide>
          
          <ScrollReveal variant="fade-up" className="max-w-3xl mb-10 pb-6 border-b border-[#D9DEE2]">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-6 bg-[#B09C4B]" />
              <span
                className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49] uppercase"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Pedagogical Architecture
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.14] tracking-tight text-[#0D2C49]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              The anatomy of an AIPP program experience.
            </h2>
            <p
              className="text-base text-[#243748] font-normal leading-relaxed mt-2"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Every simulation cohort moves through a disciplined four-stage cycle, connecting empirical treaty analytics to high-pressure multilateral bargaining.
            </p>
          </ScrollReveal>

          {/* 4-Stage Progression Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <ScrollReveal variant="fade-up" delay={0} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
              <div className="space-y-3">
                <span
                  className="text-2xl font-light text-[#B09C4B] block"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Phase 01
                </span>
                <h3
                  className="text-lg font-normal text-[#0D2C49] leading-snug"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Evidentiary Briefing
                </h3>
                <p
                  className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Participants receive unredacted crisis dossiers, classified telemetry, and historical precedent analysis grounded in AIPP research papers.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#64717C]">
                Empirical Baseline
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={70} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
              <div className="space-y-3">
                <span
                  className="text-2xl font-light text-[#B09C4B] block"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Phase 02
                </span>
                <h3
                  className="text-lg font-normal text-[#0D2C49] leading-snug"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Bilateral Leverage Mapping
                </h3>
                <p
                  className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Closed-door consultations where envoys test non-negotiable redlines, identify hidden coalitions, and build strategic bargaining leverage.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#64717C]">
                Tactical Alignment
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={140} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
              <div className="space-y-3">
                <span
                  className="text-2xl font-light text-[#B09C4B] block"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Phase 03
                </span>
                <h3
                  className="text-lg font-normal text-[#0D2C49] leading-snug"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Plenary Crisis Bargaining
                </h3>
                <p
                  className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  High-pressure plenary floor debate under live injected crisis variables designed to test psychological resilience and consensus durability.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#64717C]">
                Live Crisis Wargame
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={210} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
              <div className="space-y-3">
                <span
                  className="text-2xl font-light text-[#B09C4B] block"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Phase 04
                </span>
                <h3
                  className="text-lg font-normal text-[#0D2C49] leading-snug"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Empirical Debrief &amp; Transfer
                </h3>
                <p
                  className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Structured tactical debrief examining why specific levers succeeded and translating lessons directly into sovereign foreign ministry practice.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#64717C]">
                Institutional Impact
              </div>
            </ScrollReveal>

          </div>

        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Section 5: Closing Institutional Collaboration Section
          ───────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-[#F7F7F7] text-[#081D2E] py-16 sm:py-20 border-t border-[#D9DEE2] overflow-hidden"
        aria-label="Institutional Collaboration"
      >
        <Container wide>
          <ScrollReveal variant="fade-up" className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D9DEE2] bg-white text-xs uppercase tracking-widest text-[#0D2C49] font-semibold shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B09C4B]" />
              <span>Delegation &amp; Institutional Cohorts</span>
            </div>

            {/* Display Heading */}
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.85rem] font-normal leading-[1.14] tracking-tight text-[#0D2C49] text-balance"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Commission a bespoke program for your ministry or institution.
            </h2>

            {/* Narrative */}
            <p
              className="text-base sm:text-lg leading-relaxed text-[#243748] font-normal max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              AIPP partners with foreign ministries, diplomatic academies, regional security alliances, and international secretariats to design confidential, high-fidelity bilateral simulations and mediation workshops.
            </p>

            {/* Restrained Rounded-Full CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => openContactWithProgram("Custom Institutional Program")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-7 py-3.5 text-base font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#081D2E] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] cursor-pointer"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>Initiate Program Partnership</span>
                <ArrowUpRight className="h-4 w-4 text-[#B09C4B]" />
              </button>

              <Link
                href="/what-we-offer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9DEE2] bg-white px-7 py-3.5 text-base font-semibold text-[#081D2E] transition-all duration-200 hover:border-[#0D2C49] hover:bg-[#F7F7F7] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>Explore What We Offer</span>
              </Link>
            </div>

          </ScrollReveal>
        </Container>
      </section>

      {/* Global Institutional Footer */}
      <Footer onOpenContact={() => openContactWithProgram()} />

      {/* Interactive Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultPathway={contactPathway}
      />
    </main>
  );
}

