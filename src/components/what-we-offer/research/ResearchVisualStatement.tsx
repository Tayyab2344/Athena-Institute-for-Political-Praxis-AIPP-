"use client";

import Container from "@/components/ui/Container";

export default function ResearchVisualStatement() {
  return (
    <section className="py-24 sm:py-32 bg-[#081D2E] text-white relative overflow-hidden research-dark-grid" aria-label="Research Philosophy Statement">
      {/* Floating animated research fragments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-40">
        {/* Subtle coordinate lines */}
        <div className="absolute top-12 left-10 text-[0.625rem] font-mono text-[var(--hero-gold)] tracking-widest">
          COORD: 46.2044° N / 6.1432° E [PALAU DES NATIONS ARCHIVE]
        </div>
        <div className="absolute bottom-12 right-12 text-[0.625rem] font-mono text-slate-400 tracking-widest">
          § 14.2 // EMPIRICAL DERIVATION REGRESSION N=142
        </div>

        {/* Delicate golden geometric vectors */}
        <svg className="absolute w-full h-full" viewBox="0 0 1200 400" fill="none">
          <line x1="100" y1="80" x2="1100" y2="80" stroke="rgba(176, 156, 75, 0.15)" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="200" y1="320" x2="1000" y2="320" stroke="rgba(176, 156, 75, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Abstract citation markers */}
          <circle cx="280" cy="80" r="3" fill="#B09C4B" opacity="0.6" />
          <text x="288" y="76" fontSize="9" fontFamily="serif" fontStyle="italic" fill="#B09C4B" opacity="0.7">
            [Ref. Alpha-4]
          </text>

          <circle cx="850" cy="320" r="3" fill="#B09C4B" opacity="0.6" />
          <text x="858" y="316" fontSize="9" fontFamily="serif" fontStyle="italic" fill="#B09C4B" opacity="0.7">
            [Ref. Delta-9]
          </text>
        </svg>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[var(--hero-gold)] block mb-6">
            AIPP EPISTEMIC STANDARD
          </span>
          <blockquote className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] tracking-tight text-white">
            “Better questions lead to better decisions.”
          </blockquote>
          <p className="mt-8 text-sm sm:text-base text-slate-300 font-sans font-light max-w-2xl mx-auto leading-relaxed">
            When diplomacy is founded upon unverified assumptions, accords crumble under stress. Our mission is to anchor female statecraft in unshakeable empirical certainty.
          </p>

          <div className="mt-10 flex items-center justify-center gap-6 font-mono text-[0.6875rem] text-[var(--hero-gold)] tracking-wider">
            <span>PEER-REVIEWED</span>
            <span>·</span>
            <span>NON-PARTISAN</span>
            <span>·</span>
            <span>ACTIONABLE</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
