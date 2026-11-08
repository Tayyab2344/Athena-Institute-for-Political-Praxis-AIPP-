import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeadingLevel = "display" | "h1" | "h2" | "h3" | "h4";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  level?: HeadingLevel;
  as?: ElementType;
  muted?: boolean;
}

export default function Heading({ children, className, level = "h2", as, muted = false, ...props }: HeadingProps) {
  const Component = as || (level === "display" ? "h1" : level);
  return (
    <Component className={cn(`type-${level}`, muted && "text-foreground-muted", className)} {...props}>
      {children}
    </Component>
  );
}
