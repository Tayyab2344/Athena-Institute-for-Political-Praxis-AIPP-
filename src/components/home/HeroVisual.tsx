"use client";

import Image from "next/image";
import type { HeroScrollValues } from "./useHeroScroll";

interface HeroVisualProps {
  entered: boolean;
  scroll: HeroScrollValues;
}

export default function HeroVisual({ entered, scroll }: HeroVisualProps) {
  const isScrolled = scroll.progress > 0;

  return (
    <div className="relative mt-4 lg:mt-0 w-full max-w-[560px] mx-auto lg:max-w-none">
      {/* Main editorial image container */}
      <div
        className="hero-entrance-image relative overflow-hidden rounded-sm shadow-xl"
        data-entered={entered}
        style={{ animationDelay: "320ms" }}
      >
        <div
          className="group relative w-full h-[36vh] sm:h-[45vh] lg:h-[48vh] min-h-[260px] sm:min-h-[310px] max-h-[460px] xl:max-h-[500px] overflow-hidden border border-hero-border bg-hero-offwhite"
          style={
            isScrolled
              ? {
                  transform: `scale(${scroll.image.scale}) translateY(${scroll.image.y}px)`,
                  transition: "transform 0.1s linear",
                }
              : undefined
          }
        >
          <Image
            src="/hero-diplomat.jpg"
            alt="Senior woman diplomat addressing an international policy forum from a podium"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
            className="object-cover object-[center_20%] hero-image-ambient transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />

          {/* Image caption overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hero-navy-dark/85 via-hero-navy-dark/45 to-transparent px-5 pb-4.5 pt-12">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-hero-gold" />
              <p
                className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/70"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                Institutional Praxis
              </p>
            </div>
            <p
              className="mt-1 text-xs sm:text-[0.8125rem] italic text-white/95 leading-snug line-clamp-2"
              style={{ fontFamily: "var(--font-hero-serif)" }}
            >
              Multilateral peacebuilding is strongest when women hold
              decision-making seats.
            </p>
          </div>
        </div>

        {/* Gold accent line — bottom-left corner */}
        <div className="pointer-events-none absolute -bottom-px -left-px h-16 w-px bg-hero-gold" />
        <div className="pointer-events-none absolute -bottom-px -left-px h-px w-14 bg-hero-gold" />
      </div>

      {/* Small secondary image badge — desktop only with gentle float animation */}
      <div
        className="hero-entrance-fade hero-float-badge absolute -bottom-3 -left-5 z-20 hidden w-36 overflow-hidden rounded-xs border-2 border-white bg-white shadow-xl lg:block xl:w-42"
        data-entered={entered}
        style={{ animationDelay: "850ms" }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600"
            alt="Woman policy researcher reviewing strategic documents"
            fill
            sizes="180px"
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
        </div>
        <div className="px-2.5 py-1.5 bg-white">
          <span
            className="block text-[8px] font-bold uppercase tracking-[0.14em] text-hero-navy"
            style={{ fontFamily: "var(--font-hero-sans)" }}
          >
            Policy Intelligence
          </span>
        </div>
      </div>
    </div>
  );
}
