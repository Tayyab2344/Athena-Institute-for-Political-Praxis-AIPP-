/**
 * Centralized Brand Color System for Athena Institute for Political Praxis (AIPP)
 * 
 * Palette:
 * - Deep Navy: #0D2C49
 * - Dark Navy: #081D2E
 * - Slate Navy: #243748
 * - Muted Gold: #B09C4B
 * - Off-White: #F7F7F7
 * - Pure White: #FFFFFF
 * - Muted Text: #64717C
 * - Border: #D9DEE2
 */

export const COLORS = {
  // Brand Primaries
  navy: {
    DEFAULT: "#0D2C49", // Deep Navy
    dark: "#081D2E",   // Dark Navy
    slate: "#243748",  // Slate Navy
    hover: "#081D2E",
    soft: "#EBF1F8",
    contrastText: "#FFFFFF",
  },
  primary: {
    DEFAULT: "#0D2C49",
    hover: "#081D2E",
    soft: "#EBF1F8",
    muted: "#243748",
    contrastText: "#FFFFFF",
  },

  // Brand Accent - Muted Gold
  gold: {
    DEFAULT: "#B09C4B",
    highlight: "#D4C278",
    muted: "#8C7B38",
    soft: "#F8F5E9",
    contrastText: "#081D2E",
  },
  accent: {
    DEFAULT: "#B09C4B",
    highlight: "#D4C278",
    muted: "#8C7B38",
    soft: "#F8F5E9",
    contrastText: "#081D2E",
  },

  // Backgrounds & Surfaces
  background: {
    DEFAULT: "#FFFFFF",
    muted: "#F7F7F7",
    dark: "#081D2E",
    card: "#FFFFFF",
    overlay: "rgba(8, 29, 46, 0.70)",
  },
  surface: {
    DEFAULT: "#FFFFFF",
    muted: "#F7F7F7",
    dark: "#081D2E",
    slate: "#243748",
  },

  // Typography
  foreground: {
    DEFAULT: "#081D2E",
    muted: "#64717C",
    light: "#9AA5AF",
    inverted: "#FFFFFF",
    invertedMuted: "rgba(255, 255, 255, 0.75)",
  },

  // Borders & Dividers
  border: {
    DEFAULT: "#D9DEE2",
    hover: "rgba(13, 44, 73, 0.25)",
    dark: "rgba(255, 255, 255, 0.14)",
  },
} as const;

export type ColorPalette = typeof COLORS;

export const COLOR_CLASSES = {
  bg: {
    white: "bg-white",
    muted: "bg-[#F7F7F7]",
    primary: "bg-[#0D2C49]",
    dark: "bg-[#081D2E]",
    slate: "bg-[#243748]",
    gold: "bg-[#B09C4B]",
  },
  text: {
    foreground: "text-[#081D2E]",
    muted: "text-[#64717C]",
    primary: "text-[#0D2C49]",
    gold: "text-[#B09C4B]",
    inverted: "text-white",
    invertedMuted: "text-white/75",
  },
  border: {
    default: "border-[#D9DEE2]",
    dark: "border-white/10",
    primary: "border-[#0D2C49]",
    gold: "border-[#B09C4B]",
  },
} as const;

export function getCssVar(variableName: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}
