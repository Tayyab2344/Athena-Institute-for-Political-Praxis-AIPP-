"use client";

import { Mail, Globe2, ShieldCheck, Clock, Building, Compass } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   AIPP Verified Contact Coordinates & Institutional Channels
   - Pure institutional verified coordinates
   - Editorial structure with clear hierarchy
   - No invented phone numbers or artificial addresses
   ───────────────────────────────────────────────────────────── */

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      {/* Primary Channel Card */}
      <div className="bg-[#FAF9F5] border border-[#D9DEE2] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <span
            className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Direct Secretariat Inquiries
          </span>
          <h2
            className="text-2xl sm:text-3xl font-normal text-[#0D2C49] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Institutional Communications
          </h2>
          <p
            className="text-sm text-[#243748] leading-relaxed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            All direct communications and expressions of interest are coordinated centrally by the AIPP External Affairs Directorate.
          </p>
        </div>

        {/* Verified Email Link */}
        <div className="pt-2 border-t border-[#D9DEE2]/60">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-full bg-white border border-[#D9DEE2] flex items-center justify-center text-[#0D2C49] shrink-0 shadow-2xs">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="block text-xs uppercase tracking-wider text-[#64717C] font-medium">
                Official Inquiries Desk
              </span>
              <a
                href="mailto:contact@aipp-praxis.org"
                className="text-base sm:text-lg font-semibold text-[#0D2C49] hover:text-[#B09C4B] transition-colors underline-offset-4 hover:underline break-all"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                contact@aipp-praxis.org
              </a>
              <p className="text-xs text-[#64717C] pt-0.5">
                For research submissions, simulation briefings, partnerships, and executive delegations.
              </p>
            </div>
          </div>
        </div>

        {/* Liaison Hubs */}
        <div className="pt-4 border-t border-[#D9DEE2]/60">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-full bg-white border border-[#D9DEE2] flex items-center justify-center text-[#0D2C49] shrink-0 shadow-2xs">
              <Globe2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="block text-xs uppercase tracking-wider text-[#64717C] font-medium">
                Liaison Focal Points
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#0D2C49] block">
                Geneva &bull; Vienna &bull; Washington, D.C.
              </span>
              <p className="text-xs text-[#64717C] pt-0.5">
                Convening international simulation cohorts, multilateral consultations, and academic symposiums across major diplomatic centres.
              </p>
            </div>
          </div>
        </div>

        {/* Response Charter */}
        <div className="pt-4 border-t border-[#D9DEE2]/60">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-full bg-white border border-[#D9DEE2] flex items-center justify-center text-[#B09C4B] shrink-0 shadow-2xs">
              <Clock className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="block text-xs uppercase tracking-wider text-[#64717C] font-medium">
                Review &amp; Turnaround Time
              </span>
              <span className="text-sm font-semibold text-[#0D2C49] block">
                2 to 3 Business Days
              </span>
              <p className="text-xs text-[#64717C] pt-0.5">
                Every inquiry is triaged to the responsible desk (Simulation Directorate, Policy Publications, or Fellowships).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pathway Guide */}
      <div className="bg-white border border-[#D9DEE2] rounded-3xl p-6 sm:p-8 space-y-4">
        <span
          className="text-xs font-semibold uppercase tracking-wider text-[#0D2C49] block"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Inquiry Pathways
        </span>

        <div className="space-y-3.5 text-xs sm:text-sm text-[#243748]">
          <div className="flex items-start gap-3">
            <span className="h-5 w-5 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] flex items-center justify-center text-[10px] font-bold text-[#0D2C49] shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="font-semibold text-[#0D2C49]">Diplomatic Delegations &amp; Simulations:</strong>
              <span className="text-[#64717C] block text-xs mt-0.5">
                Commissioning bilateral or multilateral Track-I crisis negotiation wargames.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="h-5 w-5 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] flex items-center justify-center text-[10px] font-bold text-[#0D2C49] shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="font-semibold text-[#0D2C49]">Research &amp; Policy Papers:</strong>
              <span className="text-[#64717C] block text-xs mt-0.5">
                Submissions to AIPP Policy Briefs, peer-reviewed journals, and empirical studies.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="h-5 w-5 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] flex items-center justify-center text-[10px] font-bold text-[#0D2C49] shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="font-semibold text-[#0D2C49]">Programs &amp; Strategic Fellowships:</strong>
              <span className="text-[#64717C] block text-xs mt-0.5">
                Cohort applications, executive masterclasses, and female leadership initiatives.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Assurance */}
      <div className="rounded-2xl border border-[#D9DEE2]/60 bg-[#FAF9F5]/70 p-5 text-xs text-[#64717C] space-y-1.5">
        <div className="flex items-center gap-2 text-[#0D2C49] font-semibold">
          <ShieldCheck className="h-4 w-4 text-[#B09C4B]" />
          <span>Institutional Confidentiality</span>
        </div>
        <p className="leading-relaxed">
          Founded under the sole leadership of Tayyaba Atiq, AIPP conducts all institutional consultations under strict non-partisan governance and diplomatic discretion.
        </p>
      </div>
    </div>
  );
}

