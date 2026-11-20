"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, Compass, Users } from "lucide-react";
import Container from "@/components/ui/Container";

/* ─────────────────────────────────────────────────────────────
   AIPP Contact Closing Section
   - Minimal, quiet institutional closing
   - Does not repeat the contact form
   - Offers dignified pathway links across the institute
   ───────────────────────────────────────────────────────────── */

export default function ContactClosing() {
  return (
    <section className="py-20 sm:py-24 bg-[#FAF9F5] border-t border-[#D9DEE2]/80">
      <Container wide>
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Institutional Reassurance */}
          <div className="text-center space-y-3">
            <span
              className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Institutional Integrity &amp; Protocol
            </span>
            <h3
              className="text-2xl sm:text-3xl font-normal text-[#0D2C49] tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Every inquiry is handled with the confidentiality and rigor expected of an international policy institute.
            </h3>
            <p
              className="text-sm sm:text-base text-[#64717C] max-w-2xl mx-auto leading-relaxed pt-1"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Whether you are preparing a delegation for high-stakes bilateral simulations, presenting research on women&rsquo;s statecraft, or seeking strategic dialogue, our taskforce looks forward to engaging.
            </p>
          </div>

          {/* Quick Pathway Pills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <Link
              href="/research"
              className="group p-6 rounded-2xl bg-white border border-[#D9DEE2] hover:border-[#0D2C49]/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-9 w-9 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] flex items-center justify-center text-[#0D2C49] group-hover:bg-[#0D2C49] group-hover:text-white transition-colors">
                  <BookOpen className="h-4 w-4" />
                </div>
                <h4
                  className="text-base font-semibold text-[#0D2C49] pt-2"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Research Archive
                </h4>
                <p className="text-xs text-[#64717C] leading-relaxed">
                  Browse peer-reviewed papers, policy briefs, and empirical indices on female statecraft.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-[#B09C4B] group-hover:text-[#0D2C49] transition-colors">
                <span>View Publications</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link
              href="/what-we-offer/strategic-action-simulation"
              className="group p-6 rounded-2xl bg-white border border-[#D9DEE2] hover:border-[#0D2C49]/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-9 w-9 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] flex items-center justify-center text-[#0D2C49] group-hover:bg-[#0D2C49] group-hover:text-white transition-colors">
                  <Compass className="h-4 w-4" />
                </div>
                <h4
                  className="text-base font-semibold text-[#0D2C49] pt-2"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Crisis Simulations
                </h4>
                <p className="text-xs text-[#64717C] leading-relaxed">
                  Explore bespoke Track-I wargaming and strategic negotiation environments.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-[#B09C4B] group-hover:text-[#0D2C49] transition-colors">
                <span>Explore Simulations</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link
              href="/get-involved"
              className="group p-6 rounded-2xl bg-white border border-[#D9DEE2] hover:border-[#0D2C49]/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-9 w-9 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] flex items-center justify-center text-[#0D2C49] group-hover:bg-[#0D2C49] group-hover:text-white transition-colors">
                  <Users className="h-4 w-4" />
                </div>
                <h4
                  className="text-base font-semibold text-[#0D2C49] pt-2"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Participation Pathways
                </h4>
                <p className="text-xs text-[#64717C] leading-relaxed">
                  Fellowships, academic contributing, institutional volunteering, and partnerships.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-[#B09C4B] group-hover:text-[#0D2C49] transition-colors">
                <span>Get Involved</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

