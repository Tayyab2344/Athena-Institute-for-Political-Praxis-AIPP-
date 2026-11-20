"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────────────────────
   AIPP Reusable Page-to-Page Navigation Transition
   - Target duration: 450 to 550ms
   - Subtle opacity & translateY(12px -> 0px) motion curve
   - Minimal top golden indicator during navigation
   - Zero layout shift, full reduced-motion accessibility
   ───────────────────────────────────────────────────────────── */

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsNavigating(true);
    });
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 450);

    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <>
      {/* Subtle top indicator on page transition */}
      <div
        aria-hidden="true"
        className={`fixed top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#B09C4B] via-[#D8C778] to-[#B09C4B] z-[9990] pointer-events-none transition-opacity duration-300 ${
          isNavigating ? "opacity-100" : "opacity-0"
        }`}
        style={{
          animation: isNavigating ? "aipp-page-progress 450ms ease-out forwards" : "none",
        }}
      />

      {/* Main page animated container keyed by pathname */}
      <div key={pathname} className="aipp-page-transition w-full flex-1 flex flex-col">
        {children}
      </div>
    </>
  );
}
