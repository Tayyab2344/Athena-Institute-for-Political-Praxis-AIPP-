"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import FooterNewsletterForm from "@/components/newsletter/FooterNewsletterForm";

/* ─────────────────────────────────────────────────────────────
   Section 7: Footer
   - Refined institutional footer
   - Official AIPP logo and concise institutional description
   - Essential navigation links with comfortable 15-16px text
   - Verified contact information & locations
   - Copyright and policy credentials
   ───────────────────────────────────────────────────────────── */

interface FooterProps {
  onOpenContact?: (pathway?: string) => void;
}

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "What We Offer", href: "/what-we-offer" },
  { label: "Research Archive", href: "/research" },
  { label: "Policy Journals", href: "/journals" },
  { label: "Strategic Programs", href: "/programs" },
  { label: "Perspectives", href: "/#perspectives" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer({ onOpenContact }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="footer"
      className="relative w-full bg-[#06101E] text-white pt-16 sm:pt-20 pb-12 border-t border-white/10"
      aria-label="AIPP Institutional Footer"
    >
      <Container wide>
        <div className="pb-12 mb-12 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            <div className="lg:col-span-6 space-y-2">
              <span
                className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Institutional Dispatches
              </span>
              <h3
                className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Subscribe to AIPP Policy &amp; Research Briefings
              </h3>
              <p
                className="text-xs sm:text-sm text-white/70 font-normal leading-relaxed max-w-lg"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Receive quarterly strategic analyses, diplomatic simulation invitations, and peer-reviewed research releases directly in your inbox.
              </p>
            </div>
            <div className="lg:col-span-6">
              <FooterNewsletterForm />
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-white/10">
          
          {/* Column 1: Institutional Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] rounded-sm"
              aria-label="AIPP Home"
            >
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white transition-transform duration-300 group-hover:scale-105 shadow-xs">
                <Image
                  src="/logo.png"
                  alt="AIPP Official Logo"
                  fill
                  sizes="44px"
                  className="object-contain"
                />
              </div>
              <span className="flex flex-col">
                <span
                  className="font-serif text-2xl font-bold tracking-tight text-white leading-none"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  AIPP
                </span>
                <span
                  className="text-[0.6875rem] font-medium tracking-wider text-[#B09C4B] pt-0.5"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Athena Institute for Political Praxis
                </span>
              </span>
            </Link>

            <p
              className="text-sm sm:text-base text-white/70 font-normal leading-relaxed max-w-md pt-2"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              A non-partisan international policy institute elevating women in diplomacy, geopolitical research, strategic crisis simulation, and public statecraft worldwide.
            </p>
          </div>

          {/* Column 2: Essential Navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span
              className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Institutional Navigation
            </span>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4">
              {NAV_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm sm:text-[0.9375rem] text-white/75 hover:text-white transition-colors duration-150 font-normal py-0.5 inline-block"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Locations (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <span
              className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Contact &amp; Liaisons
            </span>
            <div className="space-y-3 text-sm text-white/75 font-normal" style={{ fontFamily: "var(--font-sans)" }}>
              <div>
                <span className="block text-xs uppercase tracking-wider text-white/50">Inquiries</span>
                <a
                  href="mailto:contact@aipp-praxis.org"
                  className="text-white hover:text-[#B09C4B] transition-colors underline-offset-4 hover:underline"
                >
                  contact@aipp-praxis.org
                </a>
              </div>

              <div>
                <span className="block text-xs uppercase tracking-wider text-white/50">Liaison Offices</span>
                <span className="text-white/80">Geneva &amp; Washington, D.C.</span>
              </div>

              <div className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B09C4B] hover:text-white transition-colors"
                >
                  <span>Open Inquiry Form</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/50 font-normal">
          <p>
            &copy; {new Date().getFullYear()} Athena Institute for Political Praxis (AIPP). All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-white/40">Non-Partisan Policy Institute</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5 text-[#B09C4B]" />
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
