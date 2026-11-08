"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";
import { useHeroScroll } from "./useHeroScroll";

export default function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const scroll = useHeroScroll(sectionRef);

  useEffect(() => {
    // Choreographed entrance sequence
    const timer = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-center overflow-x-clip bg-[#F8F7F4] min-h-[100svh] pt-20 lg:pt-24 pb-12 lg:pb-16"
    >
      <Container wide className="relative flex-1 flex flex-col justify-center my-auto">
        {/* Main grid: content | visual */}
        <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 xl:gap-14">
          {/* Left: typography + CTA */}
          <HeroContent entered={entered} scroll={scroll} />

          {/* Right: editorial image */}
          <HeroVisual entered={entered} scroll={scroll} />
        </div>
      </Container>
    </section>
  );
}
