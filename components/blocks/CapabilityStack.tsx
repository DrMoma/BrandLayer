import { approach } from "@/content/approach";
import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/blocks/primitives";

/**
 * THE WAYS IN
 *
 * Three cards side by side on desktop. On phones they stack as a deck while
 * you scroll (position: sticky), all the same height so the last card covers
 * the one beneath it completely. Each card reads top to bottom: number and
 * name, the promise, what it means, what's included.
 */
export function CapabilityStack() {
  return (
    <div className="canvas">
      <div className="grid gap-6 tablet:grid-cols-3 tablet:gap-[var(--gutter)]">
        {approach.map((c, i) => (
          <Reveal
            as="article"
            key={c.slug}
            id={c.slug}
            delay={i * 80}
            className="sticky flex min-h-[29rem] scroll-mt-[calc(var(--header-h)+24px)] flex-col rounded-[var(--radius-card)] border border-[var(--stroke-soft)] bg-[var(--bg-raised)] p-6 shadow-[0_-12px_40px_-24px_rgb(20_20_20/0.25)] tablet:static tablet:min-h-0 tablet:p-8 tablet:shadow-none desktop:p-10"
            style={{
              // Phones: a deck. Each card pins a little lower than the last so
              // their edges show — except the final one, which lands exactly on
              // the card before it and covers it completely.
              top: `calc(var(--header-h) + 16px + ${Math.min(i, approach.length - 2) * 14}px)`,
              zIndex: i + 1,
            }}
          >
            <div className="flex items-baseline justify-between">
              <Label className="tabular-nums">{c.index}</Label>
              <Label>{c.label}</Label>
            </div>

            <h3 className="type-h3 mt-10 whitespace-pre-line text-[var(--text-default)] tablet:mt-14">
              {c.title}
            </h3>
            <p className="type-body mt-5 text-[var(--text-neutral)]">{c.body}</p>

            <ul className="mt-auto flex flex-wrap gap-2 pt-8">
              {c.includes.map((d) => (
                <li
                  key={d}
                  className="type-label rounded-full border border-[var(--stroke-soft)] px-3 py-1.5 text-[var(--text-neutral)]"
                >
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
