"use client";

import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { motionConfig, motionPresets, type MotionPreset } from "@/lib/animations";
import { cn } from "@/lib/cn";

interface MotionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  preset?: MotionPreset;
  delay?: number;
}

export function Motion({ children, className, delay = 0, preset = "fadeIn", ...props }: MotionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => typeof window !== "undefined" && !("IntersectionObserver" in window));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(motionPresets[preset], className)}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}

export function FadeIn(props: Omit<MotionProps, "preset">) {
  return <Motion preset="fadeIn" {...props} />;
}

export function SlideUp(props: Omit<MotionProps, "preset">) {
  return <Motion preset="slideUp" {...props} />;
}

export function SlideIn({ direction = "left", ...props }: Omit<MotionProps, "preset"> & { direction?: "left" | "right" }) {
  return <Motion preset={direction === "left" ? "slideLeft" : "slideRight"} {...props} />;
}

export function Stagger(props: Omit<MotionProps, "preset">) {
  return <Motion preset="stagger" {...props} />;
}

export function ImageReveal(props: Omit<MotionProps, "preset">) {
  return <Motion preset="imageReveal" {...props} />;
}

export function Parallax({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const offset = Math.max(-motionConfig.parallaxDistance, Math.min(motionConfig.parallaxDistance, (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.035));
        element.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div ref={ref} className={cn("will-change-transform", className)} {...props}>{children}</div>;
}

export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
