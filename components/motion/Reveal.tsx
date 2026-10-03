"use client";

import type { ElementType, ReactNode } from "react";
import { useInView } from "@/lib/inview";
import { cn } from "@/lib/cn";

type Anim = "rise" | "curtain" | "rule";

/**
 * The generic entrance. Elements ship in their RESTING state and are only
 * knocked into their start state once `.motion-ready` lands on <html> — so
 * with JS disabled or broken, nothing is ever invisible.
 */
export function Reveal({
  as: Tag = "div",
  anim = "rise",
  delay = 0,
  gate = true,
  className,
  children,
  style,
  ...rest
}: {
  as?: ElementType;
  anim?: Anim;
  delay?: number;
  /** Hold the reveal back until this turns true (e.g. until the intro ends). */
  gate?: boolean;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
} & Record<string, unknown>) {
  const ref = useInView<HTMLElement>(gate);
  return (
    <Tag
      ref={ref}
      data-anim={anim}
      className={className}
      style={delay || style ? ({ ...(delay ? { "--anim-delay": `${delay}ms` } : {}), ...style } as React.CSSProperties) : undefined}
      {...rest}
    >
      {anim === "curtain" ? <Curtain>{children}</Curtain> : children}
    </Tag>
  );
}

/**
 * The two wrappers a curtain needs. Kept here rather than at each call site so
 * the structure the CSS depends on can never drift.
 */
export function Curtain({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn("curtain-window h-full w-full", className)}>
      <div className="curtain-scale h-full w-full">{children}</div>
    </div>
  );
}
