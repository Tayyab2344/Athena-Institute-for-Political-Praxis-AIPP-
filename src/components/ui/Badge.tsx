import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: "primary" | "neutral" | "light";
}

export default function Badge({ children, className, tone = "primary", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 type-label",
        tone === "primary" && "bg-primary text-background",
        tone === "neutral" && "border border-border text-primary",
        tone === "light" && "bg-primary-soft text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
