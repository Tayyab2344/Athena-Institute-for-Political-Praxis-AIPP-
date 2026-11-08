export const motionPresets = {
  fadeIn: "motion-fade-in",
  slideUp: "motion-slide-up",
  slideLeft: "motion-slide-left",
  slideRight: "motion-slide-right",
  scaleIn: "motion-scale-in",
  imageReveal: "motion-image-reveal",
  stagger: "motion-stagger",
} as const;

export const motionConfig = {
  duration: {
    fast: 180,
    base: 420,
    slow: 720,
  },
  stagger: {
    short: 80,
    medium: 150,
    long: 220,
  },
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  revealDistance: 20,
  parallaxDistance: 18,
  viewportThreshold: 0.16,
} as const;

export type MotionPreset = keyof typeof motionPresets;
