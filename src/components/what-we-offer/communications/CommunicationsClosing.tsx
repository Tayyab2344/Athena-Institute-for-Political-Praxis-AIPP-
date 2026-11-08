"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Volume2 } from "lucide-react";
import Container from "@/components/ui/Container";

interface CommunicationsClosingProps {
  onOpenContact?: () => void;
}

export default function CommunicationsClosing({
  onOpenContact,
}: CommunicationsClosingProps) {
  return (
    <section className="relative py-28 sm:py-36 bg-[#081D2E] text-white overflow-hidden" aria-label="Communications Conclusion">
      {/* Background full-width image of woman speaker / public forum */}
      <div className="absolute inset-0">
        <Image
          src="/ideas-advocacy.jpg"
          alt="Distinguished woman speaker addressing an international delegation"
          fill
          className="object-cover opacity-25 filter grayscale contrast-125"
        />
        {/* Dark navy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E] via-[#081D2E]/85 to-[#081D2E]/90" />
      </div>

      <Container>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--hero-gold)]/20 border border-[var(--hero-gold)]/40 flex items-center justify-center text-[var(--hero-gold)] mb-6">
            <Volume2 className="h-5 w-5" />
          </div>

          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[var(--hero-gold)] block mb-4">
            PUBLIC DIPLOMACY INVITATION
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.12] text-white">
            Start a conversation that matters.
          </h2>

          <p className="mt-6 text-sm sm:text-base text-slate-300 font-sans font-light max-w-xl mx-auto leading-relaxed">
            Whether preparing an ambassadorial address, formulating a global public diplomacy campaign, or placing op-eds in the international press, AIPP brings important ideas to the center of public discourse.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--hero-gold)] text-[var(--hero-navy)] text-xs font-semibold uppercase tracking-[0.16em] transition-all hover:bg-white hover:shadow-xl font-sans"
            >
              <span>Connect With AIPP</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/#insights"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-[0.16em] transition-all font-sans"
            >
              <span>Explore Perspectives Archive</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
