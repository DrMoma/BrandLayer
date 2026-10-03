import { cn } from "@/lib/cn";

/**
 * The mark: two planes in 2:1 isometric space.
 *
 * Every edge runs at atan(0.5) = 26.565deg — the constant this whole design
 * system is built on. The planes are separated by exactly one third of a
 * plane's thickness, which is why they read as stacked rather than adjacent.
 *
 * Both planes are addressable (data-plane) so the intro can fly them in
 * along their own axis and land them in register.
 */
export function Mark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 138 133"
      fill="currentColor"
      aria-hidden="true"
      className={cn("block w-auto", className)}
      data-mark={animated ? "animated" : undefined}
    >
      <path data-plane="top" d="M0 45 L90 0 L138 24 L48 69 Z" />
      <path data-plane="bottom" d="M0 109 L90 64 L138 88 L48 133 Z" />
    </svg>
  );
}

/**
 * Full lockup. The mark stands in for the "B", so the visible text reads
 * "rand Layer" — but the accessible name is always the real one. Screen
 * readers and crawlers must never see the decorative truncation.
 */
export function Lockup({
  className,
  markClassName,
  animated = false,
}: {
  className?: string;
  markClassName?: string;
  animated?: boolean;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-[0.1em] text-[1em]", className)}
      role="img"
      aria-label="Brand Layer"
    >
      {/*
        Sized and nudged to sit as the wordmark's own first letter rather than
        as a separate mark beside it. The text box runs full em including
        descender space, so its optical cap-centre sits above the geometric
        centre — hence the small upward offset. Scaled to cap height so it
        reads as a capital, not an oversized glyph.
      */}
      <Mark
        animated={animated}
        className={cn(
          "h-[0.76em] w-auto shrink-0 -translate-y-[0.055em]",
          markClassName
        )}
      />
      <span
        aria-hidden="true"
        data-lockup="wordmark"
        className="font-sans font-semibold leading-none tracking-[-0.035em]"
      >
        rand Layer
      </span>
    </span>
  );
}
