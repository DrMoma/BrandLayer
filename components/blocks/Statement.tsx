import { ReadThrough } from "@/components/motion/ReadThrough";
import { Reveal } from "@/components/motion/Reveal";
import { Label, ArrowLink } from "@/components/blocks/primitives";

/**
 * The manifesto. Large serif paragraphs — the editorial voice that gives a
 * product company gravity. Set in 8 of 12 columns so the measure stays
 * readable no matter how wide the viewport gets.
 *
 * The paragraphs use ReadThrough rather than the usual rise-in reveal: they
 * are legible from the moment they exist and darken word by word as you scroll
 * through them. A block of copy this large wants to be read, not performed at.
 */
export function Statement({
  kicker,
  paragraphs,
  cta,
}: {
  kicker: string;
  paragraphs: readonly string[];
  cta?: { href: string; label: string };
}) {
  return (
    <div className="grid-canvas">
      <div className="col-span-full tablet:col-span-3">
        <Reveal>
          <Label>{kicker}</Label>
        </Reveal>
      </div>

      <div className="col-span-full mt-8 flex flex-col gap-[1.2em] tablet:col-span-8 tablet:col-start-5 tablet:mt-0">
        <ReadThrough
          paragraphs={paragraphs}
          className="flex flex-col gap-[1.2em]"
          paragraphClassName="type-statement"
        />

        {cta && (
          <Reveal delay={200} className="mt-4">
            <ArrowLink href={cta.href} className="type-label text-[var(--text-default)]">
              {cta.label}
            </ArrowLink>
          </Reveal>
        )}
      </div>
    </div>
  );
}
