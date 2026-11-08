import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  wide?: boolean;
}

export default function Container({ className, wide = false, ...props }: ContainerProps) {
  return <div className={cn(wide ? "aipp-container-wide" : "aipp-container", className)} {...props} />;
}
