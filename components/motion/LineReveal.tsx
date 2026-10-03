"use client";

import type { ElementType } from "react";
import { useInView } from "@/lib/inview";

/**
 * Text rises out of its own baseline, one authored line at a time.
 *
 * Lines are split on "\n" in the content rather than measured at runtime:
 * the writer controls where the break falls, which matters enormously for
 * display type. 70ms stagger, matching the house rhythm.
 */
export function LineReveal({
  text,
  as: Tag = "span",
  className,
  lineClassName,
  delay = 0,
  stagger = 70,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useInView<HTMLElement>();
  const lines = text.split("\n");

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span className="line-mask" key={i}>
          <span
            className={lineClassName}
            style={{ ["--line-delay" as string]: `${delay + i * stagger}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
