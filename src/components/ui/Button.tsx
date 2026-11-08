import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-background hover:bg-primary-hover",
  secondary: "bg-background-muted text-primary hover:bg-primary-soft",
  outline: "border border-border text-primary hover:bg-primary hover:text-background",
  ghost: "text-primary hover:bg-primary-soft",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-9 px-4 text-[0.6875rem]",
  md: "min-h-11 px-5 text-xs",
  lg: "min-h-14 px-7 text-xs",
};

export function buttonStyles({ variant = "primary", size = "md", className }: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold uppercase tracking-[0.12em] transition-[background-color,color,border-color,transform] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export default function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return <button className={buttonStyles({ variant, size, className })} {...props} />;
}
