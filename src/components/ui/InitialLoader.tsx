"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────
   AIPP Initial Branded Website Entry Animation
   - Shown strictly once per session on initial entry
   - Target duration: 1.2 to 1.4 seconds total
   - Respects prefers-reduced-motion (instant dismiss)
   - Centers official logo.png, reveals title and expanding gold rule
   - Smoothly dissolves into the live page
   ───────────────────────────────────────────────────────────── */

export default function InitialLoader() {
  const [shouldRender, setShouldRender] = useState(false);
  const [stage, setStage] = useState<"enter" | "active" | "exit" | "done">("enter");

  useEffect(() => {
    // 1. Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    // 2. Check session storage so this only displays on the initial entry
    try {
      const alreadySeen = sessionStorage.getItem("aipp_intro_seen");
      if (alreadySeen) {
        return;
      }
    } catch {
      // In case of private browsing storage restrictions, proceed smoothly
    }

    const frame = requestAnimationFrame(() => {
      setShouldRender(true);
    });

    const timerActive = setTimeout(() => {
      setStage("active");
    }, 200);

    const timerExit = setTimeout(() => {
      setStage("exit");
    }, 1100);

    const timerDone = setTimeout(() => {
      setStage("done");
      try {
        sessionStorage.setItem("aipp_intro_seen", "1");
      } catch {
      }
    }, 1500);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timerActive);
      clearTimeout(timerExit);
      clearTimeout(timerDone);
    };
  }, []);

  if (!shouldRender || stage === "done") {
    return null;
  }

  const isExiting = stage === "exit";
  const isActive = stage === "active" || stage === "exit";

  return (
    <aside
      aria-label="AIPP Introduction"
      aria-hidden={isExiting ? "true" : "false"}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#081D2E] text-white transition-opacity duration-400 ease-out pointer-events-none select-none ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center px-6 text-center max-w-md">
        {/* Official Institutional Logo */}
        <div
          className={`relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full border border-white/20 bg-white p-1 shadow-2xl transition-all duration-700 ease-out ${
            isActive ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Athena Institute for Political Praxis"
            fill
            sizes="96px"
            priority
            className="object-contain p-1"
          />
        </div>

        {/* Institutional Typography Lockup */}
        <div
          className={`pt-6 space-y-1.5 transition-all duration-700 delay-150 ease-out ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-none font-serif"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            AIPP
          </h2>
          <p
            className="text-[0.6875rem] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#B09C4B] pt-1"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Athena Institute for Political Praxis
          </p>
        </div>

        {/* Minimal Muted Gold Expanding Rule */}
        <div
          className={`my-4 h-[1.5px] bg-[#B09C4B] transition-all duration-700 delay-300 ease-out ${
            isActive ? "w-28 opacity-100" : "w-0 opacity-0"
          }`}
        />

        {/* Diplomatic Mission Descriptor */}
        <p
          className={`text-[0.6875rem] sm:text-[0.75rem] font-medium tracking-wider text-white/70 uppercase transition-all duration-700 delay-400 ease-out ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Elevating Women in Global Statecraft
        </p>
      </div>
    </aside>
  );
}

