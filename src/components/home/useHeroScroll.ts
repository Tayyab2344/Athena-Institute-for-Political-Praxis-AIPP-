"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface HeroScrollValues {
  progress: number;
  image: { scale: number; y: number };
  headline: { y: number; opacity: number };
  eyebrow: { y: number; opacity: number };
  metadata: { y: number; opacity: number };
}

const DEFAULTS: HeroScrollValues = {
  progress: 0,
  image: { scale: 1, y: 0 },
  headline: { y: 0, opacity: 1 },
  eyebrow: { y: 0, opacity: 1 },
  metadata: { y: 0, opacity: 1 },
};

export function useHeroScroll(sectionRef: React.RefObject<HTMLElement | null>) {
  const [values, setValues] = useState<HeroScrollValues>(DEFAULTS);
  const frameRef = useRef(0);

  const update = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const sectionHeight = el.offsetHeight;

    // progress: 0 = hero fully visible, 1 = hero scrolled out
    const rawProgress = Math.max(0, -rect.top / sectionHeight);
    const progress = Math.min(1, rawProgress);

    setValues({
      progress,
      image: {
        scale: 1 + progress * 0.04,
        y: progress * 20,
      },
      headline: {
        y: -progress * 15,
        opacity: 1 - progress * 0.4,
      },
      eyebrow: {
        y: -progress * 25,
        opacity: 1 - progress * 0.5,
      },
      metadata: {
        y: -progress * 10,
        opacity: 1 - progress * 0.6,
      },
    });
  }, [sectionRef]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isReduced || isMobile) return;

    const onScroll = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, [update]);

  return values;
}
