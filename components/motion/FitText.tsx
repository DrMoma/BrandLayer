"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { observe, unobserve } from "@/lib/inview";
import { cn } from "@/lib/cn";

const REF_SIZE = 100; // measure once at 100px, then scale linearly

/**
 * FIT TEXT — display type sized to fill its container exactly.
 *
 * This is the single most recognisable thing about the reference site: the
 * headline is never picked from a type scale, it is *fitted*, which is why its
 * computed size lands on fractional values like 97.3563px. Type that touches
 * both edges of its column reads as deliberate in a way that a snapped scale
 * never does.
 *
 * Text width scales linearly with font-size (letter-spacing is in em, so it
 * scales too), so one measurement at a 100px reference gives the exact answer
 * — no binary search, no iteration, no thrash.
 *
 * Measured in useLayoutEffect before paint, and re-measured on resize and on
 * font load, so there is no visible resize and no layout shift.
 */
export function FitText({
  text,
  className,
  lineClassName,
  reveal = true,
  delay = 0,
  stagger = 90,
  max = 240,
  min = 28,
  as: Tag = "div",
}: {
  text: string;
  className?: string;
  lineClassName?: string;
  reveal?: boolean;
  delay?: number;
  stagger?: number;
  max?: number;
  min?: number;
  /** The fitted block's element — `h1` when it is the page's headline. */
  as?: "div" | "h1" | "h2";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number | null>(null);
  const lines = text.split("\n");

  const fit = useCallback(() => {
    const wrap = wrapRef.current;
    const probe = measureRef.current;
    if (!wrap || !probe) return;

    const available = wrap.clientWidth;
    if (!available) return;

    let widest = 0;
    for (const line of lines) {
      probe.textContent = line;
      widest = Math.max(widest, probe.getBoundingClientRect().width);
    }
    if (!widest) return;

    const next = (available / widest) * REF_SIZE;
    setSize(Math.max(min, Math.min(max, next)));
  }, [lines, max, min]);

  useLayoutEffect(() => {
    fit();
  }, [fit]);

  // Register with the shared reveal observer — without this the line masks
  // never receive data-inview and the headline stays at opacity 0.
  useEffect(() => {
    const wrap = wrapRef.current;
    observe(wrap);
    return () => unobserve(wrap);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver(fit);
    ro.observe(wrap);

    // Re-fit once the real faces land, otherwise we would be sized to the
    // fallback metrics forever.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) fit();
    });

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [fit]);

  return (
    <div ref={wrapRef} className={cn("w-full", className)}>
      {/* Off-screen probe. Inherits every metric that affects width. */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className={cn("type-display", lineClassName)}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          left: "-9999px",
          top: 0,
          fontSize: `${REF_SIZE}px`,
        }}
      />
      <Tag
        className="type-display"
        style={{
          fontSize: size ? `${size}px` : undefined,
          // Pre-measurement fallback keeps the box the right shape so the
          // first paint is never wildly wrong.
          ...(size ? {} : { fontSize: "clamp(2.75rem, 12vw, 9rem)" }),
        }}
      >
        {lines.map((line, i) =>
          reveal ? (
            <span className="line-mask" key={i}>
              <span
                className={cn("block whitespace-nowrap", lineClassName)}
                style={{ ["--line-delay" as string]: `${delay + i * stagger}ms` }}
              >
                {line}
              </span>
            </span>
          ) : (
            <span key={i} className={cn("block whitespace-nowrap", lineClassName)}>
              {line}
            </span>
          )
        )}
      </Tag>
    </div>
  );
}
