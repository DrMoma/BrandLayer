import { cn } from "@/lib/cn";

/**
 * READ-THROUGH
 *
 * A block of paragraphs that sits in light grey and darkens as it scrolls up
 * the viewport, leading the eye along the lines the way it would move if you
 * were reading aloud.
 *
 * ONE TIMELINE FOR THE WHOLE GROUP.
 * The wrapper — not each paragraph — declares the view timeline, and words are
 * indexed continuously across every paragraph. So the sweep runs once, from
 * the first word of the first paragraph to the last word of the last, instead
 * of each paragraph resolving on its own clock and all of them going at once.
 *
 * Driven entirely by a native scroll timeline: no scroll listener, no
 * observer, nothing on the main thread while scrolling.
 *
 * Word ranges OVERLAP — each word takes more of the timeline to darken than
 * the step between neighbours — so a band of words is always mid-transition
 * and the darkening reads as a soft sweep rather than switches flipping.
 *
 * The unread grey (--text-ghost) is intentionally below AA contrast. It is
 * safe because it is transient and never the resting state: without
 * scroll-timeline support, or under reduced motion, .read-word renders at
 * --text-default and this animation never applies.
 */
const START = 14; // % into the group's cover range where the first word begins
const SPREAD = 54; // % of the range across which the whole group resolves
const OVERLAP = 9; // % each word takes to darken — wider than the step, so they blend

export function ReadThrough({
  paragraphs,
  className,
  paragraphClassName,
}: {
  paragraphs: readonly string[];
  className?: string;
  paragraphClassName?: string;
}) {
  const split = paragraphs.map((p) => p.split(/\s+/).filter(Boolean));
  const total = split.reduce((n, words) => n + words.length, 0);
  const step = total > 1 ? SPREAD / (total - 1) : 0;

  // Continuous index across paragraphs, so the sweep never restarts.
  let cursor = 0;

  return (
    <div className={cn("read-block", className)}>
      {split.map((words, pi) => (
        <p key={pi} className={paragraphClassName}>
          {words.map((word, wi) => {
            const start = START + cursor * step;
            cursor += 1;
            return (
              <span
                key={wi}
                className="read-word"
                style={
                  {
                    "--read-start": `${start.toFixed(2)}%`,
                    "--read-end": `${(start + OVERLAP).toFixed(2)}%`,
                  } as React.CSSProperties
                }
              >
                {word}
                {wi < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
