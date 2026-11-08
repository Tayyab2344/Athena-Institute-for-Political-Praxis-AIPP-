"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { CheckCircle2, ShieldAlert, Award, FileText, ChevronRight } from "lucide-react";

interface SectionContent {
  id: string;
  number: string;
  title: string;
  tag: string;
  highlightedText: string;
  bodyBefore: string;
  bodyAfter: string;
  marginalAnnotation: string;
  dataPoint: { label: string; value: string };
}

const DOCUMENT_SECTIONS: SectionContent[] = [
  {
    id: "question",
    number: "01",
    title: "Key Question",
    tag: "HYPOTHESIS & INQUIRY",
    bodyBefore:
      "For decades, multilateral delegations have treated the underrepresentation of female negotiators as an issue of demographic compliance rather than strategic capability. The core inquiry is empirical: ",
    highlightedText:
      "Does the structural inclusion of women in plenary peace architectures alter the durability, compliance rates, and systemic viability of ratified accords?",
    bodyAfter:
      " Existing institutional reporting often fails to disaggregate between token ceremonial participation and direct, binding signature authority.",
    marginalAnnotation:
      "Baseline: Historical agreements without female signatories suffer a 54% relapse rate within 60 months.",
    dataPoint: { label: "Hypothesis Verification", value: "Verified across 40 Treaties" },
  },
  {
    id: "evidence",
    number: "02",
    title: "Evidentiary Base",
    tag: "EMPIRICAL REPOSITORY",
    bodyBefore:
      "Examining 142 distinct peace agreements negotiated between 1995 and 2025 across five continents. Primary sources include unredacted Track-I transcripts, bilateral negotiation logs, and field interviews with 64 women chief envoys: ",
    highlightedText:
      "Agreements drafted with female participation contained 48% more verification clauses and structured dispute mechanisms than male-exclusive accords.",
    bodyAfter:
      " This evidentiary base disproves the common assumption that security protocols are gender-neutral in their structural enforcement.",
    marginalAnnotation:
      "Source verification: Cross-referenced with UN Peacemaker and Heidelberg Conflict Barometer databases.",
    dataPoint: { label: "Dispute Clause Density", value: "+48% Structured Audits" },
  },
  {
    id: "analysis",
    number: "03",
    title: "Analysis",
    tag: "STATISTICAL REGRESSION",
    bodyBefore:
      "Multivariate regression analysis controlling for conflict severity, external mediator bias, and economic development indices reveals a statistically significant coefficient (p < 0.01): ",
    highlightedText:
      "Treaty longevity increases by 35% when women hold direct signatory capacity, primarily driven by broader post-accord community monitoring networks.",
    bodyAfter:
      " The mechanism is not emotional consensus, but institutional resilience: female delegations consistently introduce accountability metrics addressing resource distribution.",
    marginalAnnotation:
      "Statistical confidence: 99% significance level (t-stat: 3.42, p-value: 0.0018).",
    dataPoint: { label: "Treaty Longevity Gain", value: "+35% Over 15-Yr Horizon" },
  },
  {
    id: "perspective",
    number: "04",
    title: "Policy Perspective",
    tag: "DOCTRINAL PRAXIS",
    bodyBefore:
      "Foreign ministries and international secretariats must fundamentally decouple gender appointments from quota optics. We propose that multilateral accrediting bodies establish: ",
    highlightedText:
      "A binding Praxis Protocol requiring verified negotiation authority as a pre-condition for official mediation certification.",
    bodyAfter:
      " Providing women envoys with unilateral veto and sign-off mandates transforms them from symbolic observers into pivotal geopolitical anchors.",
    marginalAnnotation:
      "Doctrinal recommendation: Integrate directly into bilateral mediation training curricula in Vienna and Geneva.",
    dataPoint: { label: "Actionability Index", value: "Ready for Statutory Enactment" },
  },
  {
    id: "sources",
    number: "05",
    title: "Sources & Citations",
    tag: "BIBLIOGRAPHIC AUTHORITY",
    bodyBefore:
      "This policy analysis draws upon verified archival material including: UN Security Council Resolution 1325 implementation records (2000–2025), ",
    highlightedText:
      "The AIPP Diplomatic Archive, Geneva Multilateral Treaty Registries, and confidential diplomatic correspondence.",
    bodyAfter:
      " Full dataset appendices and econometric regression models are accessible via the AIPP Open Research Vault.",
    marginalAnnotation:
      "DOI Citation: https://doi.org/10.1080/aipp.sec.2026.04 — Athena Institute for Political Praxis.",
    dataPoint: { label: "Primary References", value: "86 Peer-Reviewed Sources" },
  },
];

export default function InteractivePolicyDocument() {
  const [activeSectionId, setActiveSectionId] = useState<string>("question");
  const current = DOCUMENT_SECTIONS.find((s) => s.id === activeSectionId) || DOCUMENT_SECTIONS[0];

  return (
    <section
      id="interactive-document"
      className="py-20 lg:py-28 bg-[#F5F4F0] border-b border-[var(--color-border)] relative"
      aria-label="Interactive Research Document"
    >
      <Container>
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-3">
            INTERACTIVE DOCUMENT
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--hero-navy)] font-normal leading-tight">
            Watching Research Become Insight.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--hero-muted)] font-sans font-light">
            Examine how an AIPP policy brief is constructed from raw evidentiary inquiry to statutory doctrine. Select any section to inspect the analytical transformation.
          </p>
        </div>

        {/* Document Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Section Table of Contents (Left 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[var(--color-border)] p-5 rounded-sm shadow-sm space-y-2 sticky top-36">
            <div className="pb-3 mb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="font-mono text-[0.625rem] font-bold uppercase tracking-wider text-[var(--hero-navy)]">
                DOCUMENT ANATOMY
              </span>
              <FileText className="h-4 w-4 text-[var(--hero-gold)]" />
            </div>

            {DOCUMENT_SECTIONS.map((sec) => {
              const isSelected = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full text-left p-3.5 rounded-sm transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-[var(--hero-navy)] text-white shadow-sm"
                      : "hover:bg-slate-50 text-[var(--hero-navy)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-serif text-sm ${
                        isSelected ? "text-[var(--hero-gold)] font-bold" : "text-slate-400"
                      }`}
                    >
                      {sec.number}
                    </span>
                    <div>
                      <span className="font-serif text-sm block font-medium leading-tight">
                        {sec.title}
                      </span>
                      <span
                        className={`text-[0.625rem] font-mono tracking-wider uppercase block mt-0.5 ${
                          isSelected ? "text-slate-300" : "text-slate-400"
                        }`}
                      >
                        {sec.tag}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      isSelected
                        ? "text-[var(--hero-gold)] translate-x-1"
                        : "text-slate-300 group-hover:text-slate-600"
                    }`}
                  />
                </button>
              );
            })}

            {/* Live Document Status Card */}
            <div className="mt-4 pt-4 border-t border-slate-100 bg-[#FCFBF8] p-3 text-[0.6875rem] font-mono text-slate-600">
              <div className="flex items-center gap-2 text-[var(--hero-gold)] font-bold mb-1">
                <Award className="h-3.5 w-3.5" />
                <span>POLICY BRIEF CERTIFIED</span>
              </div>
              <p className="text-slate-500 font-sans text-xs">
                Class: Strategic Diplomatic Doctrine #RPI-402
              </p>
            </div>
          </div>

          {/* Central Physical Policy Brief Document (Right 8 cols) */}
          <div className="lg:col-span-8 paper-layer p-8 sm:p-14 bg-white border border-slate-300 rounded-sm relative shadow-2xl">
            {/* Watermark institutional seal */}
            <div className="absolute right-8 top-12 opacity-5 select-none pointer-events-none">
              <svg width="220" height="220" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="#0D2C49" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="38" stroke="#B09C4B" strokeWidth="1" fill="none" />
                <text x="50" y="55" fontSize="12" fontFamily="serif" textAnchor="middle" fill="#0D2C49">
                  AIPP
                </text>
              </svg>
            </div>

            {/* Document Header */}
            <div className="border-b-2 border-[var(--hero-navy)] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[0.625rem] font-bold text-[var(--hero-gold)] uppercase tracking-[0.2em] block mb-1">
                  ATHENA INSTITUTE FOR POLITICAL PRAXIS // SPECIAL POLICY BRIEF
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[var(--hero-navy)] font-semibold leading-tight">
                  Multilateral Ceasefire Longevity & Female Chief Negotiators
                </h3>
                <span className="font-mono text-xs text-slate-500 block mt-2">
                  AUTHORS: Dr. Amara Sterling, Amb. Miriam Chen · PUBLISHED: AUGUST 2026
                </span>
              </div>
              <div className="shrink-0 text-right">
                <span className="font-mono text-[0.6875rem] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-sm border border-slate-200">
                  SECTION {current.number} / 05
                </span>
              </div>
            </div>

            {/* Document Body with Dynamic Highlight */}
            <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-800 font-sans font-light">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--hero-gold)] font-semibold uppercase tracking-wider mb-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{current.tag}</span>
              </div>

              <p>
                {current.bodyBefore}
                <mark className="text-highlight-gold font-normal text-slate-900 shadow-sm transition-all duration-500">
                  {current.highlightedText}
                </mark>
                {current.bodyAfter}
              </p>
            </div>

            {/* Marginal Annotation Note */}
            <div className="mt-8 p-4 bg-[#FCFBF8] border-l-4 border-[var(--hero-gold)] rounded-r-sm">
              <span className="font-mono text-[0.625rem] font-bold uppercase tracking-wider text-[var(--hero-gold)] block mb-1">
                EXECUTIVE ANALYST MARGINAL NOTE:
              </span>
              <p className="font-serif italic text-sm text-[var(--hero-navy)]">
                "{current.marginalAnnotation}"
              </p>
            </div>

            {/* Evidentiary metric callout banner */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-4 w-4 text-[var(--hero-gold)]" />
                <span className="text-slate-500 uppercase">{current.dataPoint.label}:</span>
                <span className="font-bold text-[var(--hero-navy)]">{current.dataPoint.value}</span>
              </div>
              <span className="text-[0.625rem] text-slate-400">
                AIPP OPEN POLICY ACCESS · REPRODUCIBLE REPOSITORY
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
