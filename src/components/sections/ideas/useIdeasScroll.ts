"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface CardMotionState {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotate: number;
  isActive: boolean;
  isIncoming: boolean;
  isExiting: boolean;
}

export interface IdeasScrollState {
  progress: number;
  activeIndex: number;
  inView: boolean;
  cards: CardMotionState[];
  imageParallax: { y: number; scale: number };
  guideLineProgress: number;
  isReducedMotion: boolean;
}

const DEFAULT_CARD: CardMotionState = {
  x: 0,
  y: 0,
  scale: 1,
  opacity: 1,
  rotate: 0,
  isActive: true,
  isIncoming: false,
  isExiting: false,
};

const DEFAULT_STATE: IdeasScrollState = {
  progress: 0,
  activeIndex: 0,
  inView: false,
  cards: [
    { ...DEFAULT_CARD, isActive: true },
    { ...DEFAULT_CARD, isActive: false, opacity: 0 },
    { ...DEFAULT_CARD, isActive: false, opacity: 0 },
  ],
  imageParallax: { y: -15, scale: 1.04 },
  guideLineProgress: 0,
  isReducedMotion: false,
};

// Target sweet spots for each card along the 0.0 -> 1.0 progress timeline
const CARD_CENTERS = [0.18, 0.50, 0.82];

export function useIdeasScroll(sectionRef: React.RefObject<HTMLElement | null>) {
  const [state, setState] = useState<IdeasScrollState>(DEFAULT_STATE);
  const frameRef = useRef(0);

  const calculate = useCallback(() => {
    const el = sectionRef.current;
    if (!el || typeof window === "undefined") return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 1024;

    if (isReduced || isMobile) {
      setState((prev) => ({
        ...prev,
        isReducedMotion: true,
        cards: [
          { ...DEFAULT_CARD, isActive: true, opacity: 1 },
          { ...DEFAULT_CARD, isActive: true, opacity: 1 },
          { ...DEFAULT_CARD, isActive: true, opacity: 1 },
        ],
      }));
      return;
    }

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalDistance = el.offsetHeight - windowH;

    if (totalDistance <= 0) return;

    const inView = rect.top < windowH && rect.bottom > 0;
    const rawProgress = -rect.top / totalDistance;
    const progress = Math.max(0, Math.min(1, rawProgress));

    // Determine active index
    let activeIndex = 0;
    if (progress >= 0.66) {
      activeIndex = 2;
    } else if (progress >= 0.33) {
      activeIndex = 1;
    }

    // 45-degree diagonal trajectory calculations:
    // Incoming: (+120px X, -90px Y)
    // Active:   (0px X, 0px Y)
    // Exiting:  (-120px X, +90px Y)
    const cards: CardMotionState[] = [
      // Card 01 (Research)
      (() => {
        let x = 0;
        let y = 0;
        let scale = 1;
        let opacity = 1;
        let rotate = 0;

        if (progress <= 0.26) {
          x = 0;
          y = 0;
          scale = 1;
          opacity = 1;
          rotate = 0;
        } else if (progress < 0.54) {
          const t = Math.min(1, (progress - 0.26) / 0.24);
          x = -t * 125;
          y = t * 90;
          scale = 1 - t * 0.08;
          opacity = Math.max(0, 1 - t * 1.4);
          rotate = t * 2.5;
        } else {
          opacity = 0;
          x = -130;
          y = 95;
        }

        return {
          x: Math.round(x * 10) / 10,
          y: Math.round(y * 10) / 10,
          scale: Math.round(scale * 1000) / 1000,
          opacity: Math.max(0, Math.min(1, Math.round(opacity * 100) / 100)),
          rotate: Math.round(rotate * 10) / 10,
          isActive: activeIndex === 0,
          isIncoming: false,
          isExiting: progress > 0.26,
        };
      })(),

      // Card 02 (Strategy)
      (() => {
        let x = 0;
        let y = 0;
        let scale = 1;
        let opacity = 0;
        let rotate = 0;

        if (progress < 0.22) {
          opacity = 0;
          x = 135;
          y = -95;
          scale = 0.90;
        } else if (progress < 0.46) {
          const t = Math.min(1, (0.46 - progress) / 0.24);
          x = t * 125;
          y = -t * 90;
          scale = 1 - t * 0.10;
          opacity = Math.max(0, 1 - t * 1.3);
          rotate = -t * 2.5;
        } else if (progress <= 0.60) {
          x = 0;
          y = 0;
          scale = 1;
          opacity = 1;
          rotate = 0;
        } else if (progress < 0.86) {
          const t = Math.min(1, (progress - 0.60) / 0.24);
          x = -t * 125;
          y = t * 90;
          scale = 1 - t * 0.08;
          opacity = Math.max(0, 1 - t * 1.4);
          rotate = t * 2.5;
        } else {
          opacity = 0;
          x = -130;
          y = 95;
        }

        return {
          x: Math.round(x * 10) / 10,
          y: Math.round(y * 10) / 10,
          scale: Math.round(scale * 1000) / 1000,
          opacity: Math.max(0, Math.min(1, Math.round(opacity * 100) / 100)),
          rotate: Math.round(rotate * 10) / 10,
          isActive: activeIndex === 1,
          isIncoming: progress < 0.46,
          isExiting: progress > 0.60,
        };
      })(),

      // Card 03 (Advocacy)
      (() => {
        let x = 0;
        let y = 0;
        let scale = 1;
        let opacity = 0;
        let rotate = 0;

        if (progress < 0.58) {
          opacity = 0;
          x = 135;
          y = -95;
          scale = 0.90;
        } else if (progress < 0.80) {
          const t = Math.min(1, (0.80 - progress) / 0.22);
          x = t * 125;
          y = -t * 90;
          scale = 1 - t * 0.10;
          opacity = Math.max(0, 1 - t * 1.3);
          rotate = -t * 2.5;
        } else {
          x = 0;
          y = 0;
          scale = 1;
          opacity = 1;
          rotate = 0;
        }

        return {
          x: Math.round(x * 10) / 10,
          y: Math.round(y * 10) / 10,
          scale: Math.round(scale * 1000) / 1000,
          opacity: Math.max(0, Math.min(1, Math.round(opacity * 100) / 100)),
          rotate: Math.round(rotate * 10) / 10,
          isActive: activeIndex === 2,
          isIncoming: progress < 0.80,
          isExiting: false,
        };
      })(),
    ];

    // Subtle image parallax
    const imageParallax = {
      y: Math.round((-15 + progress * 30) * 10) / 10,
      scale: Math.round((1.04 - progress * 0.04) * 1000) / 1000,
    };

    setState({
      progress,
      activeIndex,
      inView,
      cards,
      imageParallax,
      guideLineProgress: progress,
      isReducedMotion: false,
    });
  }, [sectionRef]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(calculate);
    };

    calculate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [calculate]);

  return state;
}
