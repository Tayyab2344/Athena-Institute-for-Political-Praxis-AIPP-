"use client";

import { useRef } from "react";
import Container from "@/components/ui/Container";
import IdeasLeftSticky from "./ideas/IdeasLeftSticky";
import IdeasRightCards from "./ideas/IdeasRightCards";
import { useIdeasScroll } from "./ideas/useIdeasScroll";

export default function IdeasToInfluenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollState = useIdeasScroll(sectionRef);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#081D2E] text-white scroll-mt-20 lg:h-[210vh]"
    >
      {/* Atmospheric Background Layers */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Subtle Navy & Slate Lighting Mesh */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 10% 20%, rgba(13, 44, 73, 0.85) 0%, transparent 70%), radial-gradient(ellipse 60% 45% at 90% 75%, rgba(36, 55, 72, 0.6) 0%, transparent 65%), radial-gradient(circle at 65% 30%, rgba(176, 156, 75, 0.035) 0%, transparent 50%), #081D2E",
          }}
        />

        {/* Faint Editorial Geometric Linework & 45-Degree Vectors */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="editorial-grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#C3CDD5"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#editorial-grid)" />
        </svg>

        {/* Diagonal 45-Degree Linework Accents across the canvas */}
        <div className="absolute inset-0 hidden lg:block opacity-25">
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 1000 1000">
            <line
              x1="0"
              y1="100"
              x2="900"
              y2="1000"
              stroke="#243748"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
            <line
              x1="200"
              y1="0"
              x2="1000"
              y2="800"
              stroke="#243748"
              strokeWidth="0.75"
            />
          </svg>
        </div>

        {/* Top & Bottom Ambient Edge Vignettes */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#081D2E] via-[#081D2E]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#081D2E] via-[#081D2E]/70 to-transparent" />
      </div>

      {/* Sticky Viewport Container on Desktop (Flows naturally on mobile) */}
      <div className="relative z-10 lg:sticky lg:top-20 lg:min-h-[calc(100vh-5rem)] lg:flex lg:flex-col lg:justify-center overflow-x-clip py-14 lg:py-6">
        <Container wide className="w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.41fr_0.59fr] items-center gap-10 lg:gap-12 xl:gap-16">
            {/* Left Side: Sticky Editorial Storytelling */}
            <div className="w-full">
              <IdeasLeftSticky scrollState={scrollState} />
            </div>

            {/* Right Side: 45-Degree Diagonal Trajectory Cards */}
            <div className="w-full">
              <IdeasRightCards scrollState={scrollState} />
            </div>
          </div>
        </Container>
      </div>

      {/* Subtle border transitions */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
    </section>
  );
}
