"use client";

import { ArrowRight, Compass } from "lucide-react";
import Container from "@/components/ui/Container";

interface StrategyConvergenceClosingProps {
  onOpenContact?: () => void;
}

export default function StrategyConvergenceClosing({
  onOpenContact,
}: StrategyConvergenceClosingProps) {
  return (
    <section className="py-24 sm:py-32 bg-[#040E18] text-white relative overflow-hidden border-t border-slate-900" aria-label="Strategy Convergence Conclusion">
      {/* Converging SVG lines into one forward vector */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <svg className="w-full max-w-5xl h-full" viewBox="0 0 1000 300" fill="none">
          <path d="M 50 40 C 350 40, 500 150, 750 150" stroke="#B09C4B" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M 50 100 C 350 100, 500 150, 750 150" stroke="#B09C4B" strokeWidth="1.2" />
          <path d="M 50 150 L 750 150" stroke="#B09C4B" strokeWidth="2.5" />
          <path d="M 50 200 C 350 200, 500 150, 750 150" stroke="#B09C4B" strokeWidth="1.2" />
          <path d="M 50 260 C 350 260, 500 150, 750 150" stroke="#B09C4B" strokeWidth="1.5" strokeDasharray="4 4" />
          
          {/* Unified Forward Vector Arrow */}
          <line x1="750" y1="150" x2="950" y2="150" stroke="#B09C4B" strokeWidth="3" />
          <circle cx="950" cy="150" r="6" fill="#B09C4B" />
        </svg>
      </div>

      <Container>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--hero-gold)]/20 border border-[var(--hero-gold)]/40 flex items-center justify-center text-[var(--hero-gold)] mb-6">
            <Compass className="h-5 w-5" />
          </div>

          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[var(--hero-gold)] block mb-4">
            PATHWAY TO CONVERGENCE
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-white">
            Think ahead. Test possibilities. Act with greater clarity.
          </h2>

          <p className="mt-6 text-sm sm:text-base text-slate-300 font-sans font-light max-w-xl mx-auto leading-relaxed">
            Prepare your delegation, ministry, or cohort with high-stakes scenario planning and simulation exercises designed for decisive leadership under uncertainty.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--hero-gold)] text-[var(--hero-navy)] text-xs font-semibold uppercase tracking-[0.16em] transition-all hover:bg-white hover:shadow-xl font-sans"
            >
              <span>Discuss a Strategic Initiative</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <a
              href="#interactive-scenario"
              className="inline-flex items-center gap-2 px-8 py-4 border border-slate-700 text-slate-200 hover:bg-slate-800/60 text-xs font-semibold uppercase tracking-[0.16em] transition-all font-sans"
            >
              <span>Re-run Simulation Sandboxes</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
