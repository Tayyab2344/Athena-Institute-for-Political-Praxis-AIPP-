"use client";

import Container from "@/components/ui/Container";

/* ─────────────────────────────────────────────────────────────
   AIPP Contact Hero
   - Dignified, bright editorial opening
   - Clear institutional framing without heavy dark backgrounds
   - Generous whitespace and authoritative typography
   ───────────────────────────────────────────────────────────── */

export default function ContactHero() {
  return (
    <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 bg-white border-b border-[#D9DEE2]/70 overflow-hidden">
      {/* Subtle architectural background grid / tint */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(#0D2C49 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
        aria-hidden="true"
      />

      <Container wide className="relative z-10">
        <div className="max-w-3xl space-y-5">
          {/* Institutional Eyebrow */}
          <div className="hero-animate-eyebrow inline-flex items-center gap-2.5 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] px-3.5 py-1 text-xs text-[#0D2C49]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B09C4B]" />
            <span
              className="font-semibold uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              ATHENA INSTITUTE FOR POLITICAL PRAXIS &bull; EXTERNAL AFFAIRS &amp; SECRETARIAT
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="hero-animate-heading text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#0D2C49] leading-[1.12]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Let&rsquo;s Start a Conversation
          </h1>

          {/* Supporting Message */}
          <p
            className="hero-animate-body text-lg sm:text-xl text-[#243748] font-normal leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Have a question, an idea, or an interest in connecting with AIPP? We&rsquo;d be glad to hear from you. Our external affairs directorate engages with diplomats, policy fellows, academic researchers, and institutional partners worldwide.
          </p>

          {/* Institutional quick links / badge */}
          <div className="hero-animate-cta pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#64717C]">
            <span className="inline-flex items-center gap-2 text-[#0D2C49] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0D2C49]" />
              Non-Partisan Engagement
            </span>
            <span className="text-[#D9DEE2]">&bull;</span>
            <span className="inline-flex items-center gap-2 text-[#0D2C49] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0D2C49]" />
              Diplomatic Discretion
            </span>
            <span className="text-[#D9DEE2]">&bull;</span>
            <span className="inline-flex items-center gap-2 text-[#0D2C49] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B09C4B]" />
              Response within 2&ndash;3 business days
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

