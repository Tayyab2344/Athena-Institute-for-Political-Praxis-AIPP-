import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import Container from "@/components/ui/Container";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  eyebrow?: string;
  tone?: "ivory" | "muted" | "dark";
  wide?: boolean;
}

export default function Section({ children, className, eyebrow, tone = "ivory", wide = false, ...props }: SectionProps) {
  return (
    <section className={cn("aipp-section", tone === "muted" && "surface-muted", tone === "dark" && "surface-dark", className)} {...props}>
      <Container wide={wide}>
        {eyebrow ? <p className="type-label mb-4">{eyebrow}</p> : null}
        {children}
      </Container>
    </section>
  );
}
