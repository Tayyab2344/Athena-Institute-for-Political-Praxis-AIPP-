"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { COLORS } from "@/lib/colors";

interface SwatchItem {
  name: string;
  role: string;
  hex: string;
  classRef: string;
  isDark?: boolean;
}

const SWATCH_GROUPS: { groupName: string; swatches: SwatchItem[] }[] = [
  {
    groupName: "Brand Identity",
    swatches: [
      { name: "Primary Navy", role: "Brand Core & Headings", hex: COLORS.primary.DEFAULT, classRef: "bg-primary text-background", isDark: true },
      { name: "Navy Hover", role: "Button & Link Hover", hex: COLORS.primary.hover, classRef: "bg-primary-hover text-background", isDark: true },
      { name: "Navy Soft", role: "Badge & Pill Backgrounds", hex: COLORS.primary.soft, classRef: "bg-primary-soft text-primary" },
      { name: "Golden Grey", role: "Accent & Eyebrows", hex: COLORS.accent.DEFAULT, classRef: "bg-accent text-background", isDark: true },
      { name: "Champagne", role: "Dark Surface Highlights", hex: COLORS.accent.highlight, classRef: "text-accent" },
    ],
  },
  {
    groupName: "Surfaces & Canvas",
    swatches: [
      { name: "White Canvas", role: "Default Background & Cards", hex: COLORS.background.DEFAULT, classRef: "bg-background border border-border" },
      { name: "Golden Wash", role: "Muted Alternating Sections", hex: COLORS.background.muted, classRef: "bg-background-muted border border-border" },
      { name: "Midnight Navy", role: "Footer & Dark Surfaces", hex: COLORS.surface.dark, classRef: "bg-surface-dark text-background", isDark: true },
    ],
  },
  {
    groupName: "Typography & Borders",
    swatches: [
      { name: "Navy Charcoal", role: "Headings & Primary Text", hex: COLORS.foreground.DEFAULT, classRef: "text-foreground", isDark: true },
      { name: "Slate Grey", role: "Subtext & Secondary Metadata", hex: COLORS.foreground.muted, classRef: "text-foreground-muted" },
      { name: "Hairline Border", role: "Light Dividers & Cards", hex: COLORS.border.DEFAULT, classRef: "border-border" },
      { name: "Dark Border", role: "Dividers on Midnight Navy", hex: COLORS.border.dark, classRef: "border-border-dark", isDark: true },
    ],
  },
];

export default function ColorPalette({ className = "" }: { className?: string }) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {SWATCH_GROUPS.map((group) => (
        <div key={group.groupName} className="space-y-3">
          <h4 className="type-label text-accent">{group.groupName}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {group.swatches.map((swatch) => (
              <div
                key={swatch.name}
                onClick={() => handleCopy(swatch.hex)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-background p-3 transition-all hover:border-primary hover:shadow-soft"
                title="Click to copy HEX"
              >
                <div
                  className="relative h-16 w-full rounded-lg border border-border/50 transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundColor: swatch.hex }}
                >
                  <div className="absolute top-2 right-2 rounded-full bg-background/80 p-1 text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    {copiedHex === swatch.hex ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-start justify-between">
                  <div>
                    <span className="font-serif text-sm font-semibold text-foreground block">
                      {swatch.name}
                    </span>
                    <span className="type-body-small text-xs text-foreground-muted block">
                      {swatch.role}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] font-mono text-foreground-muted">
                  <span>{swatch.hex}</span>
                  <span className="rounded bg-background-muted px-1.5 py-0.5 text-[10px] text-primary">
                    {swatch.classRef.split(" ")[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
