/**
 * Centralized Color System for Athena Institute for Political Praxis (AIPP)
 * 
 * Palette:
 * - Primary: Dark Navy Blue (#0A192F)
 * - Accent: Golden Grey (#958772)
 * - Background: Pure White (#FFFFFF) & Golden Grey Wash (#F7F6F2)
 * - Dark Surface: Midnight Navy (#06101E)
 * - Text: Deep Navy Charcoal (#0D1B2A) & Muted Slate Grey (#5C6470)
 */

export const COLORS = {
  // Brand Primary - Dark Navy Blue
  primary: {
    DEFAULT: "#0A192F",
    hover: "#172E54",
    soft: "#EBF1F8",
    muted: "#1E355B",
    contrastText: "#FFFFFF",
  },

  // Brand Accent - Golden Grey
  accent: {
    DEFAULT: "#958772",
    highlight: "#D1C4AC", // Champagne highlight for dark surfaces
    muted: "#7B6F5D",
    soft: "#F3EFE9",
    contrastText: "#FFFFFF",
  },

  // Backgrounds & Canvas
  background: {
    DEFAULT: "#FFFFFF", // Pure White canvas
    muted: "#F7F6F2", // Golden Grey subtle wash for alternating sections
    card: "#FFFFFF", // White card surface
    overlay: "rgba(10, 25, 47, 0.60)", // Modal overlay backdrop
  },

  // Surfaces
  surface: {
    DEFAULT: "#FFFFFF",
    muted: "#F7F6F2",
    dark: "#06101E", // Midnight Navy (Footers, Dark Banners)
  },

  // Typography & Content
  foreground: {
    DEFAULT: "#0D1B2A", // Deep Navy Charcoal for headings & body
    muted: "#5C6470", // Slate Grey for subtexts & metadata
    light: "#8F96A3", // Captions & subtle dates
    inverted: "#FFFFFF", // Light text on dark navy surfaces
    invertedMuted: "rgba(255, 255, 255, 0.70)",
  },

  // Borders & Dividers
  border: {
    DEFAULT: "rgba(10, 25, 47, 0.10)", // Soft navy hairline border
    hover: "rgba(10, 25, 47, 0.25)",
    dark: "rgba(255, 255, 255, 0.14)", // Translucent border for dark surfaces
  },
} as const;

export type ColorPalette = typeof COLORS;

/**
 * Standard Tailwind Utility Class Mappings
 * Use these helper constants when composing UI components for 100% consistency.
 */
export const COLOR_CLASSES = {
  bg: {
    white: "bg-background",
    muted: "bg-background-muted",
    primary: "bg-primary",
    primaryHover: "hover:bg-primary-hover",
    primarySoft: "bg-primary-soft",
    accent: "bg-accent",
    dark: "bg-surface-dark",
  },
  text: {
    foreground: "text-foreground",
    muted: "text-foreground-muted",
    primary: "text-primary",
    accent: "text-accent",
    inverted: "text-background",
    invertedMuted: "text-background/70",
  },
  border: {
    default: "border-border",
    dark: "border-border-dark",
    primary: "border-primary",
  },
} as const;

/**
 * Helper to get CSS variable string for inline styles or canvas/chart rendering
 */
export function getCssVar(variableName: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}
