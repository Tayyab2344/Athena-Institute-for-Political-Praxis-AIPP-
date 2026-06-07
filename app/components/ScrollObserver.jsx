"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    let observer;
    let timeoutId;

    const setupObserver = () => {
      const elements = document.querySelectorAll(
        ".reveal-up, .reveal-fade, .reveal-left, .reveal-right, .reveal-scale"
      );

      const observerOptions = {
        root: null, // viewport
        rootMargin: "0px 0px -60px 0px", // Trigger when elements are 60px inside the viewport
        threshold: 0.05, // Trigger when 5% is visible
      };

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If it is already in view on mount (e.g. above fold), trigger immediately
        if (rect.top >= 0 && rect.top <= window.innerHeight) {
          el.classList.add("revealed");
        } else {
          observer.observe(el);
        }
      });
    };

    // Use a small delay to ensure Next.js has completed the DOM updates for the new page
    timeoutId = setTimeout(setupObserver, 150);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return null;
}
