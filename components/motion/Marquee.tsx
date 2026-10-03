"use client";

/**
 * Continuous keyword band. The track holds the content twice and translates
 * exactly -50%, so the loop is seamless with no JS running the animation.
 * Pauses on hover; disabled outright under reduced motion.
 */
export function Marquee({
  items,
  duration = 40,
  separator = "·",
  className,
  itemClassName = "type-label text-[var(--text-neutral)]",
}: {
  items: readonly string[];
  duration?: number;
  separator?: string;
  className?: string;
  itemClassName?: string;
}) {
  const run = [...items, ...items];
  return (
    <div
      className={`marquee w-full overflow-hidden ${className ?? ""}`}
      aria-label={items.join(", ")}
      role="group"
    >
      <div
        className="marquee-track"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {run.map((item, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className={`flex shrink-0 items-center whitespace-nowrap ${itemClassName}`}
          >
            {item}
            <span className="px-[1.6em] text-[var(--text-faint)]">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
