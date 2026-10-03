import { process } from "@/content/process";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { SectionHead, Label } from "@/components/blocks/primitives";

export function ProcessSteps() {
  return (
    <div className="canvas">
      <SectionHead kicker="How it starts" title={"YOU GO\nFIRST"} />

      <div className="mt-[var(--space-block)] flex flex-col">
        {process.map((step, i) => (
          <Reveal
            key={step.index}
            delay={i * 90}
            className="grid gap-6 border-t border-[var(--stroke-soft)] py-8 tablet:grid-cols-12 tablet:gap-[var(--gutter)] tablet:py-12"
          >
            <Label className="tabular-nums tablet:col-span-1">{step.index}</Label>

            <div className="tablet:col-span-3">
              <Label className="text-[var(--text-default)]">{step.kicker}</Label>
            </div>

            <div className="tablet:col-span-8">
              <LineReveal
                as="h3"
                text={step.title}
                className="type-h5 text-[var(--text-default)]"
              />
              <p className="type-body mt-4 max-w-[56ch] text-[var(--text-neutral)]">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
