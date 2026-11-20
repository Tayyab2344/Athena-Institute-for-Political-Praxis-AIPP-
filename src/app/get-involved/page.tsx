"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  ArrowUpRight,
  CheckCircle2,
  Send,
  Building2,
  BookOpen,
  Users2,
  Mail,
  Compass,
  ArrowDown
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   AIPP Get Involved Page: Editorial, Warm, and Action-Oriented
   - Brand Identity: Predominantly White & Soft Off-White surfaces
   - Typography: Cormorant Garamond display + Manrope body
   - Buttons: Strict rounded-full styling across all actions
   - Institutional Integrity: Tayyaba Atiq as Founder
   - Photography: 100% verified local women-centered photography
   - Form: Integrated, responsive, accessible submission with confirmation
   ───────────────────────────────────────────────────────────── */

export default function GetInvolvedPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const modalPathway = "General Inquiry";

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    pathway: "Collaborate",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formRef = useRef<HTMLDivElement>(null);

  const handleSelectPathway = (pathway: string) => {
    setFormData((prev) => ({ ...prev, pathway }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const [referenceNumber, setReferenceNumber] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          organization: formData.organization.trim() || undefined,
          subject: `Get Involved: ${formData.pathway}`,
          message: formData.message.trim(),
          sourceForm: "GET_INVOLVED_PAGE",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to submit your engagement application. Please try again.");
      }

      setReferenceNumber(data.referenceId || "");
      setIsSubmitted(true);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected network error occurred. Please contact Secretariat at contact@aipp-praxis.org."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenMailto = () => {
    const subject = encodeURIComponent(`[AIPP Engagement: ${formData.pathway}] from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nOrganization: ${formData.organization}\nEngagement Pathway: ${formData.pathway}\n\nStatement of Interest:\n${formData.message}`
    );
    window.location.href = `mailto:contact@aipp-praxis.org?subject=${subject}&body=${body}`;
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      email: "",
      organization: "",
      pathway: "Collaborate",
      message: "",
    });
    setIsSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-white text-[#081D2E] flex flex-col font-sans selection:bg-[#0D2C49] selection:text-white">
      {/* Global Navigation */}
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      {/* ─────────────────────────────────────────────────────────────
          Section 1: Get Involved Hero (Editorial & Light)
          ───────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-white text-[#081D2E] pt-28 sm:pt-32 pb-14 sm:pb-20 border-b border-[#D9DEE2]/70 overflow-hidden"
        aria-label="Get Involved Hero"
      >
        <Container wide>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left Column: Headline, Narrative & Primary Action (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">

              {/* Eyebrow Marker */}
              <div className="hero-animate-eyebrow flex items-center gap-3 mb-4 sm:mb-6">
                <span className="h-px w-6 bg-[#B09C4B]" />
                <span
                  className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49] uppercase"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  AIPP Engagement &amp; Civic Praxis
                </span>
              </div>

              {/* Display Headline */}
              <h1
                className="hero-animate-heading text-[2.625rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.25rem] font-normal leading-[1.06] tracking-tight text-[#0D2C49] text-balance mb-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Your perspective belongs in the room.
              </h1>

              {/* Supporting Lead Description */}
              <p
                className="hero-animate-body text-lg sm:text-[1.1875rem] leading-relaxed text-[#243748] font-normal max-w-2xl mb-8"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                AIPP brings together diplomats, scholars, policy practitioners, and civic partners to ensure women hold decisive mandates in global governance. Explore how you and your institution can collaborate with our work.
              </p>

              {/* Dual Restrained Action CTAs */}
              <div className="hero-animate-cta flex flex-wrap items-center gap-4">
                <a
                  href="#pathways"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-base font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#081D2E] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>Explore Pathways</span>
                  <ArrowDown className="h-4 w-4 text-[#B09C4B] transition-transform duration-200 group-hover:translate-y-0.5" />
                </a>

                <a
                  href="#engagement-form"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#D9DEE2] bg-white px-6 py-3 text-base font-semibold text-[#081D2E] transition-all duration-200 hover:border-[#0D2C49] hover:bg-[#F7F7F7] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>Initiate Inquiry</span>
                  <ArrowUpRight className="h-4 w-4 text-[#64717C] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              {/* Engagement Metrics Ledger */}
              <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-[#D9DEE2]/80 max-w-xl">
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
                <div>
                  <span
                    className="text-2xl sm:text-3xl font-light text-[#0D2C49] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    150+
                  </span>
                  <span
                    className="text-[0.6875rem] sm:text-xs font-semibold text-[#64717C] uppercase tracking-wider block mt-0.5"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Policy Papers
                  </span>
                </div>
                <div>
                  <span
                    className="text-2xl sm:text-3xl font-light text-[#0D2C49] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    3
                  </span>
                  <span
                    className="text-[0.6875rem] sm:text-xs font-semibold text-[#64717C] uppercase tracking-wider block mt-0.5"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Engagement Ways
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
                      src="/ideas-advocacy.jpg"
                      alt="Women leaders in diplomatic consultation addressing international assembly"
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
                          Civic &amp; Diplomatic Voice
                        </p>
                      </div>
                      <p
                        className="text-base sm:text-lg text-white font-medium mt-1 leading-snug"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Elevating women from ceremonial presence to decisive authority in statecraft.
                      </p>
                    </div>
                  </div>

                  {/* Refined Metadata Strip */}
                  <div className="mt-3.5 flex items-center justify-between px-2 py-1 text-xs text-[#64717C]">
                    <span className="font-semibold text-[#0D2C49]">Athena Institute for Political Praxis</span>
                    <span className="text-[#B09C4B] font-medium">Geneva &bull; Vienna &bull; Global</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Section 2: Introduction (Be Part of the Work)
          ───────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-[#F7F7F7] text-[#081D2E] py-14 sm:py-20 border-b border-[#D9DEE2]/80 overflow-hidden"
        aria-label="Be Part of the Work"
      >
        <Container wide>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* Left Column: Institutional Purpose */}
            <ScrollReveal variant="fade-up" className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#B09C4B]" />
                <span
                  className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49] uppercase"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Institutional Mission
                </span>
              </div>

              <h2
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.14] tracking-tight text-[#0D2C49]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                More representation produces more durable decisions.
              </h2>

              <p
                className="text-base sm:text-lg text-[#243748] font-normal leading-relaxed pt-2"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Founded by <strong className="font-semibold text-[#0D2C49]">Tayyaba Atiq</strong>, AIPP operates as a non-partisan platform uniting empirical research, crisis simulations, and strategic public advocacy. We invite scholars, diplomats, and institutions who believe multilateral statecraft is strengthened when women lead delegations.
              </p>
            </ScrollReveal>

            {/* Right Column: Three Core Commitments */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">

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
                    Empirical Rigor
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    We base every policy recommendation on verified historical peace data, bilateral trade reviews, and delegation audits.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-xs font-semibold text-[#0D2C49]">
                  Evidence-Driven
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={90} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
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
                    Actionable Praxis
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    We translate research into high-stakes diplomatic wargames, bilateral negotiation rooms, and statutory protocols.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-xs font-semibold text-[#0D2C49]">
                  Crisis Simulation
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={180} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
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
                    Public Voice
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    We widen the global foreign policy conversation through international summit convening and ministerial testimony.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-xs font-semibold text-[#0D2C49]">
                  Public Advocacy
                </div>
              </ScrollReveal>

            </div>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Section 3: Ways to Get Involved (3 Core Verified Pathways)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="pathways"
        className="relative w-full bg-white text-[#081D2E] py-14 sm:py-20 border-b border-[#D9DEE2] scroll-mt-20 overflow-hidden"
        aria-label="Ways to Get Involved"
      >
        <Container wide>

          {/* Section Header */}
          <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#D9DEE2]">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#B09C4B]" />
                <span
                  className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49] uppercase"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Pathways of Participation
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.14] tracking-tight text-[#0D2C49]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Three ways to engage with AIPP.
              </h2>
              <p
                className="text-sm sm:text-base text-[#243748] font-normal leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Select an institutional pathway below to begin a collaboration, submit scholarly research, or participate in upcoming assemblies.
              </p>
            </div>

            <div className="shrink-0">
              <span
                className="inline-flex items-center gap-2 rounded-full border border-[#D9DEE2] bg-[#FAF9F5] px-4 py-2 text-xs font-semibold text-[#0D2C49]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <Compass className="w-3.5 h-3.5 text-[#B09C4B]" />
                <span>3 Active Engagement Pathways</span>
              </span>
            </div>
          </ScrollReveal>

          {/* Three Refined Editorial Pathway Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Pathway 1: Collaborate */}
            <ScrollReveal variant="fade-up" delay={0} as="article" className="group bg-[#FAF9F5] rounded-3xl border border-[#D9DEE2] p-8 shadow-xs hover:border-[#0D2C49] hover:shadow-md transition-all duration-300 flex flex-col justify-between aipp-card-lift">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-2xl font-light text-[#B09C4B]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    01
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white border border-[#D9DEE2] text-[#0D2C49] text-[0.6875rem] font-semibold uppercase tracking-wider">
                    Institutional
                  </span>
                </div>

                <div className="space-y-1">
                  <h3
                    className="text-2xl sm:text-[1.65rem] font-normal text-[#0D2C49] group-hover:text-[#B09C4B] transition-colors leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Collaborate
                  </h3>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49]/70"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Institutional Partnerships &amp; Delegations
                  </p>
                </div>

                <p
                  className="text-xs sm:text-sm text-[#243748] leading-relaxed pt-1"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Partner with AIPP to commission custom bilateral crisis simulations, execute foreign ministry gender representation audits, or co-host high-level diplomatic assemblies.
                </p>

                {/* Scope Points */}
                <div className="pt-2 space-y-2 border-t border-[#D9DEE2]/60 text-xs text-[#243748]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B09C4B] shrink-0 mt-0.5" />
                    <span>Foreign Ministries &amp; Embassies</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B09C4B] shrink-0 mt-0.5" />
                    <span>Diplomatic Academies &amp; Policy Centers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B09C4B] shrink-0 mt-0.5" />
                    <span>Multilateral Secretariats</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => handleSelectPathway("Collaborate")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-xs font-semibold text-white shadow-xs transition-all duration-200 group-hover:bg-[#081D2E] group-hover:gap-3 cursor-pointer"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>Initiate Partnership</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#B09C4B]" />
                </button>
              </div>
            </ScrollReveal>

            {/* Pathway 2: Contribute Expertise */}
            <ScrollReveal variant="fade-up" delay={90} as="article" className="group bg-[#FAF9F5] rounded-3xl border border-[#D9DEE2] p-8 shadow-xs hover:border-[#0D2C49] hover:shadow-md transition-all duration-300 flex flex-col justify-between aipp-card-lift">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-2xl font-light text-[#B09C4B]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    02
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white border border-[#D9DEE2] text-[#0D2C49] text-[0.6875rem] font-semibold uppercase tracking-wider">
                    Research
                  </span>
                </div>

                <div className="space-y-1">
                  <h3
                    className="text-2xl sm:text-[1.65rem] font-normal text-[#0D2C49] group-hover:text-[#B09C4B] transition-colors leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Contribute Expertise
                  </h3>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49]/70"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Scholarly Research &amp; Policy Briefs
                  </p>
                </div>

                <p
                  className="text-xs sm:text-sm text-[#243748] leading-relaxed pt-1"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Submit empirical studies, policy commentary, and working briefs to the AIPP Digital Research Repository or co-author articles on ceasefire verification and tech diplomacy.
                </p>

                {/* Scope Points */}
                <div className="pt-2 space-y-2 border-t border-[#D9DEE2]/60 text-xs text-[#243748]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B09C4B] shrink-0 mt-0.5" />
                    <span>Peer-Reviewed Journal Submissions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B09C4B] shrink-0 mt-0.5" />
                    <span>Empirical Treaty Longevity Analysis</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B09C4B] shrink-0 mt-0.5" />
                    <span>Opinion Editorial Syndication</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => handleSelectPathway("Contribute Research")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-xs font-semibold text-white shadow-xs transition-all duration-200 group-hover:bg-[#081D2E] group-hover:gap-3 cursor-pointer"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>Submit Research Inquiry</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#B09C4B]" />
                </button>
              </div>
            </ScrollReveal>

            {/* Pathway 3: Participate & Volunteer */}
            <ScrollReveal variant="fade-up" delay={180} as="article" className="group bg-[#FAF9F5] rounded-3xl border border-[#D9DEE2] p-8 shadow-xs hover:border-[#0D2C49] hover:shadow-md transition-all duration-300 flex flex-col justify-between aipp-card-lift">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-2xl font-light text-[#B09C4B]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    03
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white border border-[#D9DEE2] text-[#0D2C49] text-[0.6875rem] font-semibold uppercase tracking-wider">
                    Praxis
                  </span>
                </div>

                <div className="space-y-1">
                  <h3
                    className="text-2xl sm:text-[1.65rem] font-normal text-[#0D2C49] group-hover:text-[#B09C4B] transition-colors leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Participate &amp; Volunteer
                  </h3>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49]/70"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Assemblies, Cohorts &amp; Civic Support
                  </p>
                </div>

                <p
                  className="text-xs sm:text-sm text-[#243748] leading-relaxed pt-1"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Engage as a cohort participant in executive mediation workshops or volunteer your logistical, communications, and editorial skills to support international summit delegations.
                </p>

                {/* Scope Points */}
                <div className="pt-2 space-y-2 border-t border-[#D9DEE2]/60 text-xs text-[#243748]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B09C4B] shrink-0 mt-0.5" />
                    <span>Summit Coordination Support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B09C4B] shrink-0 mt-0.5" />
                    <span>Crisis Simulation Rapporteur Roles</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B09C4B] shrink-0 mt-0.5" />
                    <span>Civic Engagement Fellowships</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => handleSelectPathway("Volunteer")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-xs font-semibold text-white shadow-xs transition-all duration-200 group-hover:bg-[#081D2E] group-hover:gap-3 cursor-pointer"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>Participate in Cohorts</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#B09C4B]" />
                </button>
              </div>
            </ScrollReveal>

          </div>

        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Section 4: Who Can Engage with AIPP?
          ───────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-[#FAF9F5] text-[#081D2E] py-14 sm:py-20 border-b border-[#D9DEE2] overflow-hidden"
        aria-label="Who Can Engage with AIPP"
      >
        <Container wide>

          <ScrollReveal variant="fade-up" className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-6 bg-[#B09C4B]" />
              <span
                className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49] uppercase"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Institutional Communities
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.14] tracking-tight text-[#0D2C49]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Who engages with our institution.
            </h2>
            <p
              className="text-base text-[#243748] font-normal leading-relaxed mt-2"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              AIPP connects practitioners across distinct professional disciplines, fostering collaborative alliances between diplomatic practitioners, scholars, and foreign service officers.
            </p>
          </ScrollReveal>

          {/* 4 Audience Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <ScrollReveal variant="fade-up" delay={0} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs space-y-3 aipp-card-lift">
              <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] flex items-center justify-center text-[#0D2C49]">
                <Compass className="w-5 h-5 text-[#B09C4B]" />
              </div>
              <h3
                className="text-lg font-normal text-[#0D2C49] leading-snug"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Women Diplomats &amp; Envoys
              </h3>
              <p
                className="text-xs text-[#243748] leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Chief negotiators, ambassadorial counselors, and foreign ministry delegates seeking tactical wargaming and mediation peer exchange.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={70} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs space-y-3 aipp-card-lift">
              <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] flex items-center justify-center text-[#0D2C49]">
                <BookOpen className="w-5 h-5 text-[#B09C4B]" />
              </div>
              <h3
                className="text-lg font-normal text-[#0D2C49] leading-snug"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Scholars &amp; Policy Researchers
              </h3>
              <p
                className="text-xs text-[#243748] leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Academics, political scientists, and legal experts producing quantitative data on treaty longevity, trade protocols, and AI statecraft.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={140} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs space-y-3 aipp-card-lift">
              <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] flex items-center justify-center text-[#0D2C49]">
                <Building2 className="w-5 h-5 text-[#B09C4B]" />
              </div>
              <h3
                className="text-lg font-normal text-[#0D2C49] leading-snug"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Foreign Ministries &amp; Academies
              </h3>
              <p
                className="text-xs text-[#243748] leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Sovereign ministries and diplomatic training institutes commissioning bespoke crisis labs and institutional representation audits.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={210} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs space-y-3 aipp-card-lift">
              <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] flex items-center justify-center text-[#0D2C49]">
                <Users2 className="w-5 h-5 text-[#B09C4B]" />
              </div>
              <h3
                className="text-lg font-normal text-[#0D2C49] leading-snug"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Emerging Foreign Policy Leaders
              </h3>
              <p
                className="text-xs text-[#243748] leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Mid-career foreign service officers and graduate scholars participating in fellowships, summit coordination, and civic praxis.
              </p>
            </ScrollReveal>

          </div>

        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Section 5: Direct Interactive Engagement Form
          ───────────────────────────────────────────────────────────── */}
      <section
        id="engagement-form"
        ref={formRef}
        className="relative w-full bg-white text-[#081D2E] py-16 sm:py-24 border-b border-[#D9DEE2] scroll-mt-20 overflow-hidden"
        aria-label="Direct Engagement Form"
      >
        <Container wide>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Column: Form Guidance & Contact Coordinates (5 cols) */}
            <ScrollReveal variant="fade-up" className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-[#B09C4B]" />
                  <span
                    className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49] uppercase"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Direct Inquiry &amp; Submissions
                  </span>
                </div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.14] tracking-tight text-[#0D2C49]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Start a conversation with our team.
                </h2>
                <p
                  className="text-sm sm:text-base text-[#243748] font-normal leading-relaxed"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Whether commissioning a delegation simulation wargame, submitting policy research, or inquiring about participation, please share your statement of purpose.
                </p>
              </div>

              {/* Direct Liaison Card */}
              <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#D9DEE2] space-y-4">
                <span
                  className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Institutional Liaison
                </span>

                <div className="space-y-2 text-xs sm:text-sm text-[#243748]">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#0D2C49] shrink-0" />
                    <span className="font-semibold text-[#0D2C49]">contact@aipp-praxis.org</span>
                  </div>
                  <p className="text-xs text-[#64717C] leading-relaxed pt-1">
                    Direct communications reviewed by the AIPP External Affairs Taskforce across Geneva, Vienna, and Washington, D.C.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column: Interactive Submission Form (7 cols) */}
            <ScrollReveal variant="fade-up" delay={100} className="lg:col-span-7">
              <div className="bg-[#FAF9F5] rounded-3xl border border-[#D9DEE2] p-6 sm:p-10 shadow-xs">

                {isSubmitted ? (
                  /* Success Confirmation State */
                  <div className="py-8 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-white border border-[#D9DEE2] flex items-center justify-center text-[#B09C4B] mx-auto shadow-xs">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <h3
                        className="text-2xl sm:text-3xl font-normal text-[#0D2C49]"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Inquiry Successfully Logged
                      </h3>
                      {referenceNumber && (
                        <p className="inline-block text-xs font-mono font-bold bg-[#E8EEF3] text-[#0D2C49] px-3 py-1 rounded-full border border-[#D9DEE2]">
                          Ref: {referenceNumber}
                        </p>
                      )}
                      <p
                        className="text-sm text-[#243748] leading-relaxed"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        Thank you, <strong className="font-semibold text-[#0D2C49]">{formData.name}</strong>. Your expression of interest regarding <span className="font-semibold text-[#0D2C49]">{formData.pathway}</span> has been received by our external affairs directorate.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleOpenMailto}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#081D2E] cursor-pointer"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        <span>Open Direct Email Client</span>
                        <Send className="w-3.5 h-3.5 text-[#B09C4B]" />
                      </button>

                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9DEE2] bg-white px-6 py-3 text-xs font-semibold text-[#081D2E] transition-all duration-200 hover:bg-[#F7F7F7] cursor-pointer"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        <span>Submit Another Inquiry</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Active Form Fields */
                  <form onSubmit={handleFormSubmit} className="space-y-5">

                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                        {errorMessage}
                      </div>
                    )}

                    {/* Pathway Selection (Pills) */}
                    <div>
                      <label
                        className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49] block mb-2"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        Select Engagement Pathway <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Collaborate", "Contribute Research", "Volunteer", "General Inquiry"].map((p) => {
                          const isSelected = formData.pathway === p;
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setFormData({ ...formData, pathway: p })}
                              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${isSelected
                                  ? "bg-[#0D2C49] text-white shadow-xs"
                                  : "bg-white text-[#243748] border border-[#D9DEE2] hover:border-[#0D2C49]"
                                }`}
                              style={{ fontFamily: "var(--font-sans)" }}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49] block mb-1.5"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ambassador / Dr. / Ms. Name"
                          className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-white border border-[#D9DEE2] text-sm font-sans text-[#081D2E] focus:outline-hidden focus:border-[#0D2C49] transition-all"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="emailAddress"
                          className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49] block mb-1.5"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="emailAddress"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@institution.org"
                          className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-white border border-[#D9DEE2] text-sm font-sans text-[#081D2E] focus:outline-hidden focus:border-[#0D2C49] transition-all"
                        />
                      </div>
                    </div>

                    {/* Organization / Affiliation */}
                    <div>
                      <label
                        htmlFor="organization"
                        className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49] block mb-1.5"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        Organization / Institutional Affiliation
                      </label>
                      <input
                        id="organization"
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="Ministry, Academic Institution, Delegation, or NGO"
                        className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-white border border-[#D9DEE2] text-sm font-sans text-[#081D2E] focus:outline-hidden focus:border-[#0D2C49] transition-all"
                      />
                    </div>

                    {/* Statement of Purpose */}
                    <div>
                      <label
                        htmlFor="message"
                        className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49] block mb-1.5"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        Message / Statement of Interest <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Briefly describe how you or your institution wish to engage with AIPP..."
                        className="w-full p-4 rounded-xl bg-white border border-[#D9DEE2] text-sm font-sans text-[#081D2E] focus:outline-hidden focus:border-[#0D2C49] transition-all resize-y"
                      />
                    </div>

                    {/* Submit Action (strict rounded-full) */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-xs text-[#64717C]">
                        Communications are handled under institutional discretion.
                      </p>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all duration-200 hover:bg-[#081D2E] disabled:opacity-50 cursor-pointer"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        <span>{isSubmitting ? "Logging Inquiry..." : "Submit Inquiry"}</span>
                        <Send className="w-3.5 h-3.5 text-[#B09C4B]" />
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </ScrollReveal>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Section 6: Closing Institutional Collaboration Section
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
              <span>AIPP External Relations</span>
            </div>

            {/* Display Heading */}
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.85rem] font-normal leading-[1.14] tracking-tight text-[#0D2C49] text-balance"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Every enduring treaty begins with an open door.
            </h2>

            {/* Narrative */}
            <p
              className="text-base sm:text-lg leading-relaxed text-[#243748] font-normal max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Reach out directly to the Athena Institute for Political Praxis. Our team reviews all institutional and scholarly inquiries with care and discretion.
            </p>

            {/* Restrained Rounded-Full CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (formRef.current) {
                    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-7 py-3.5 text-base font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#081D2E] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] cursor-pointer"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>Contact Our Team</span>
                <ArrowDown className="h-4 w-4 text-[#B09C4B]" />
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
      <Footer onOpenContact={() => setIsContactOpen(true)} />

      {/* Interactive Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultPathway={modalPathway}
      />
    </main>
  );
}

