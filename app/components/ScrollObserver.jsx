"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Select elements to reveal
    const elements = document.querySelectorAll(
      ".reveal-up, .reveal-fade, .reveal-left, .reveal-right"
    );

    const observerOptions = {
      root: null, // viewport
      rootMargin: "0px 0px -60px 0px", // Trigger when elements are 60px inside the viewport
      threshold: 0.05, // Trigger when 5% is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          // Stop observing once revealed to maintain clean state
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elements.forEach((el) => {
      // If it is already in view on mount (e.g. above fold), trigger immediately
      const rect = el.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight) {
        el.classList.add("revealed");
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
