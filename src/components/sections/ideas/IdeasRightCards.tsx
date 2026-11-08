import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IDEAS_STAGES } from "./ideasData";
import type { IdeasScrollState } from "./useIdeasScroll";

interface IdeasRightCardsProps {
  scrollState: IdeasScrollState;
}

export default function IdeasRightCards({ scrollState }: IdeasRightCardsProps) {
  const { cards, guideLineProgress, isReducedMotion } = scrollState;

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-0 lg:min-h-[500px] xl:min-h-[540px] overflow-visible">
      {/* 45-Degree Subtle Gold Guide Line across the right canvas (Behind cards) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block overflow-hidden z-0">
        <svg
          className="w-full h-full opacity-25"
          viewBox="0 0 500 500"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Diagonal 45-degree guideline */}
          <line
            x1="50"
            y1="40"
            x2="450"
            y2="460"
            stroke="#B09C4B"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          {/* Animated Gold Progress Node traveling along the 45-degree path */}
          <circle
            cx={50 + guideLineProgress * 400}
            cy={40 + guideLineProgress * 420}
            r="4.5"
            fill="#B09C4B"
          />
          <circle
            cx={50 + guideLineProgress * 400}
            cy={40 + guideLineProgress * 420}
            r="10"
            stroke="#B09C4B"
            strokeWidth="1"
            className="opacity-60"
          />
        </svg>
      </div>

      {/* Desktop Animated Diagonal Stage Container */}
      <div className="relative w-full max-w-lg xl:max-w-xl hidden lg:block h-[470px] xl:h-[500px] z-10">
        {IDEAS_STAGES.map((stage, idx) => {
          const motion = cards[idx] || {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            rotate: 0,
            isActive: idx === 0,
          };

          return (
            <article
              key={stage.number}
              className={`absolute inset-0 rounded-xs border bg-white p-6 xl:p-7 flex flex-col justify-between transition-shadow duration-300 ${
                motion.isActive
                  ? "border-hero-border shadow-2xl z-20"
                  : "border-hero-border/60 shadow-sm z-10"
              }`}
              style={
                !isReducedMotion
                  ? {
                      transform: `translate3d(${motion.x}px, ${motion.y}px, 0) scale(${motion.scale}) rotate(${motion.rotate}deg)`,
                      opacity: motion.opacity,
                      willChange: "transform, opacity",
                      pointerEvents: motion.opacity > 0.4 ? "auto" : "none",
                    }
                  : undefined
              }
            >
              {/* Header: Stage Number & Accent Indicator */}
              <div className="flex items-center justify-between border-b border-hero-border/80 pb-3">
                <div className="flex items-baseline gap-2.5">
                  <span
                    className={`font-serif text-3xl font-semibold leading-none ${
                      motion.isActive ? "text-hero-gold" : "text-hero-navy/40"
                    }`}
                  >
                    {stage.number}
                  </span>
                  <span
                    className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-hero-navy"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    / 03 • {stage.stageName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.14em] text-hero-muted"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    {stage.pillText}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                      motion.isActive ? "bg-hero-gold" : "bg-hero-border"
                    }`}
                  />
                </div>
              </div>

              {/* Wide Photographic Area: Women-Focused Imagery */}
              <div className="relative aspect-[16/8] sm:aspect-[16/7.5] w-full overflow-hidden rounded-xs border border-hero-border/70 my-2.5 bg-hero-offwhite shadow-xs">
                <Image
                  src={stage.image}
                  alt={stage.imageAlt}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1280px) 480px, 560px"
                  className="object-cover object-[center_26%] transition-transform duration-700 ease-out hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hero-navy-dark/70 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white">
                  <span
                    className="text-[8.5px] font-semibold uppercase tracking-[0.12em] text-white/90"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    AIPP Leadership Praxis
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-hero-gold" />
                </div>
              </div>

              {/* Center: Title & Statements */}
              <div className="space-y-1.5 py-0.5">
                <h3
                  className="font-serif text-xl sm:text-2xl leading-snug font-normal text-hero-navy"
                  style={{ fontFamily: "var(--font-hero-serif)" }}
                >
                  {stage.title}
                </h3>

                <p
                  className="text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.1em] text-hero-gold"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  {stage.shortStatement}
                </p>

                <p
                  className="text-xs sm:text-[0.8125rem] leading-relaxed text-[#64717C] font-normal line-clamp-2"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  {stage.description}
                </p>
              </div>

              {/* Footer: CTA Button & Metadata */}
              <div className="pt-2.5 border-t border-hero-border/70 flex items-center justify-between mt-auto">
                <Link
                  href={stage.ctaHref}
                  className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-hero-navy transition-colors hover:text-hero-gold"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  <span>{stage.ctaText}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 text-hero-gold" />
                </Link>

                <span
                  className="text-[9px] uppercase tracking-[0.16em] text-hero-muted font-semibold"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  AIPP Journal
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Mobile / Tablet Sequential Stacking with dedicated editorial photo banners */}
      <div className="w-full flex flex-col gap-6 lg:hidden pt-2 pb-6">
        {IDEAS_STAGES.map((stage) => (
          <article
            key={stage.number}
            className="w-full rounded-xs border border-hero-border bg-white overflow-hidden shadow-xs flex flex-col justify-between"
          >
            {/* Woman-focused editorial photo banner on each mobile card */}
            <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-hero-border">
              <Image
                src={stage.image}
                alt={stage.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover object-[center_28%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-hero-navy-dark/75 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                <span
                  className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/90"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  Phase {stage.number} • {stage.pillText}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-hero-gold" />
              </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
              <div className="flex items-center justify-between border-b border-hero-border/70 pb-3">
                <span className="font-serif text-2xl text-hero-gold font-semibold">
                  {stage.number}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.16em] text-hero-navy"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  / 03 • {stage.stageName}
                </span>
              </div>

              <div className="py-4 space-y-2.5">
                <h3
                  className="font-serif text-xl sm:text-2xl font-normal text-hero-navy leading-snug"
                  style={{ fontFamily: "var(--font-hero-serif)" }}
                >
                  {stage.title}
                </h3>
                <p
                  className="text-xs font-bold uppercase tracking-[0.08em] text-hero-gold"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  {stage.shortStatement}
                </p>
                <p
                  className="text-sm leading-relaxed text-hero-slate font-normal"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  {stage.description}
                </p>
              </div>

              <div className="pt-3 border-t border-hero-border/60 flex items-center justify-between">
                <Link
                  href={stage.ctaHref}
                  className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-hero-navy transition-colors hover:text-hero-gold"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  <span>{stage.ctaText}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-hero-gold" />
                </Link>
                <span
                  className="text-[9px] uppercase tracking-[0.16em] text-hero-muted font-medium"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  AIPP Praxis
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
