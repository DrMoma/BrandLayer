import { isSlot, type Brand } from "@/content/brands";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { Frame, Label, ArrowLink } from "@/components/blocks/primitives";
import { cn } from "@/lib/cn";

/**
 * Placeholder styling.
 *
 * Slots are legible but unmistakably unfinished — dotted rule, muted, mono.
 * The page reads as designed while being visibly not yet true, which is the
 * only honest way to ship a brand story before it has been written.
 */
function Slot({ children, className }: { children: string; className?: string }) {
  return (
    <span
      data-placeholder="true"
      className={cn(
        "type-label rounded-[4px] border border-dashed border-[var(--stroke-firm)] px-1.5 py-0.5 align-middle text-[var(--text-faint)]",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Renders real content plainly, and a slot as a visible placeholder. */
export function Value({ value, className }: { value: string; className?: string }) {
  return isSlot(value) ? <Slot className={className}>{value}</Slot> : <>{value}</>;
}

export function BrandHero({ brand }: { brand: Brand }) {
  return (
    <section className="pt-[calc(var(--header-h)+var(--space-block))]">
      <div className="canvas">
        <Reveal>
          <Label>
            {brand.role} · {brand.year}
          </Label>
        </Reveal>

        <LineReveal
          as="h1"
          text={brand.name.toUpperCase()}
          delay={80}
          className="type-head mt-8 text-[var(--text-default)]"
        />

        <p className="type-statement mt-[var(--space-block)] max-w-[38ch] text-[var(--text-neutral)]">
          <Value value={brand.summary} className="!type-body" />
        </p>

        <dl className="mt-[var(--space-block)] grid gap-6 border-t border-[var(--stroke-soft)] pt-8 tablet:grid-cols-12">
          <div className="tablet:col-span-4">
            <dt className="type-label text-[var(--text-faint)]">What it is</dt>
            <dd className="type-body mt-2 text-[var(--text-default)]">
              <Value value={brand.category} />
            </dd>
          </div>
          <div className="tablet:col-span-4">
            <dt className="type-label text-[var(--text-faint)]">Our role</dt>
            <dd className="type-body mt-2 text-[var(--text-default)]">{brand.role}</dd>
          </div>
          <div className="tablet:col-span-4">
            <dt className="type-label text-[var(--text-faint)]">Year</dt>
            <dd className="type-body mt-2 text-[var(--text-default)]">{brand.year}</dd>
          </div>
        </dl>

        {brand.link && (
          <Reveal className="mt-8">
            <ArrowLink href={brand.link} className="type-label text-[var(--text-default)]">
              Visit {brand.name}
            </ArrowLink>
          </Reveal>
        )}
      </div>

      <div className="canvas mt-[var(--space-block)]">
        <Frame slot={brand.media.key} aspect="16 / 9" priority />
      </div>
    </section>
  );
}

export function BrandChapters({ brand }: { brand: Brand }) {
  return (
    <div className="canvas flex flex-col">
      {brand.chapters.map((c, i) => (
        <Reveal
          key={c.kicker}
          delay={i * 60}
          className="grid gap-6 border-t border-[var(--stroke-soft)] py-10 tablet:grid-cols-12 tablet:gap-[var(--gutter)] tablet:py-16"
        >
          <div className="tablet:col-span-3">
            <Label>{c.kicker}</Label>
          </div>
          <div className="tablet:col-span-9">
            <h2 className="type-h5 text-[var(--text-default)]">
              <Value value={c.title} />
            </h2>
            <p className="type-body mt-5 max-w-[62ch] text-[var(--text-neutral)]">
              <Value value={c.body} />
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
