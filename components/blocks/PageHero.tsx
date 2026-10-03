import { FitText } from "@/components/motion/FitText";
import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/blocks/primitives";

/** Inner-page header. Same fit-to-width lockup as home, at a calmer scale. */
export function PageHero({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="pt-[calc(var(--header-h)+var(--space-block))] pb-[var(--space-block)]">
      <div className="canvas">
        <Reveal>
          <Label>{kicker}</Label>
        </Reveal>
        <div className="mt-8">
          <FitText as="h1" text={title} max={180} />
        </div>
        {intro && (
          <p className="type-statement mt-[var(--space-block)] max-w-[40ch] text-[var(--text-neutral)]">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
