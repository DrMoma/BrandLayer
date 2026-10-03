import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead, Label } from "@/components/blocks/primitives";

/** Why we say no a lot — four plain reasons, not invented metrics. */
export function StandardsBand() {
  return (
    <div className="canvas">
      <SectionHead kicker="How we choose" title={"WHY WE SAY\nNO A LOT"} />

      <div className="mt-[var(--space-block)] grid gap-px overflow-hidden border border-[var(--stroke-soft)] bg-[var(--stroke-soft)] tablet:grid-cols-2">
        {site.principles.map((p, i) => (
          <Reveal
            key={p.title}
            delay={i * 80}
            className="flex flex-col gap-4 bg-[var(--bg-default)] p-6 tablet:min-h-[240px] tablet:p-10"
          >
            <Label className="tabular-nums">{String(i + 1).padStart(2, "0")}</Label>
            <h3 className="type-h3 max-w-[20ch] text-[var(--text-default)]">{p.title}</h3>
            <p className="type-body max-w-[52ch] text-[var(--text-neutral)]">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
