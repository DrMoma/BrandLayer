import type { Metadata } from "next";
import { audience, whatYouGet } from "@/content/approach";
import { CapabilityStack } from "@/components/blocks/CapabilityStack";
import { PageHero } from "@/components/blocks/PageHero";
import { ProcessSteps } from "@/components/blocks/ProcessSteps";
import { FooterHero } from "@/components/blocks/FooterHero";
import { SectionHead, Label } from "@/components/blocks/primitives";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "Three ways to work together — guide, build or back. For founders at any stage: product brands, coffee, dropshipping, e-commerce, SMMA and agencies.",
  alternates: { canonical: "/approach" },
};

export default function ApproachPage() {
  return (
    <>
      <PageHero
        kicker="Approach"
        title={"THREE\nWAYS IN"}
        intro="Some founders need a clear head beside them. Some need another pair of hands. A few need someone with skin in the game. Most projects start with one and grow into the next."
      />

      <section className="tone-stone section-y bg-[var(--bg-default)]">
        <CapabilityStack />
      </section>

      <section className="section-y">
        <div className="canvas">
          <SectionHead kicker="Who it's for" title={"ANY BRAND.\nANY STAGE."} />

          <Reveal className="mt-[var(--space-block)]">
            <p className="type-statement max-w-[40ch] text-[var(--text-neutral)]">
              Product brands, coffee, dropshipping, e-commerce, SMMA and agencies — online or in
              person, small or big.
            </p>
          </Reveal>

          <div className="mt-[var(--space-block)] grid gap-px overflow-hidden border border-[var(--stroke-soft)] bg-[var(--stroke-soft)] tablet:grid-cols-2 desktop:grid-cols-4">
            {audience.stages.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 70}
                className="flex flex-col gap-4 bg-[var(--bg-default)] p-8 tablet:min-h-[220px]"
              >
                <Label className="tabular-nums">{String(i + 1).padStart(2, "0")}</Label>
                <h3 className="type-h5 text-[var(--text-default)]">{s.label}</h3>
                <p className="type-body text-[var(--text-neutral)]">{s.body}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-[var(--space-section)] grid gap-10 border-t border-[var(--stroke-soft)] pt-10 tablet:grid-cols-12 tablet:gap-[var(--gutter)]">
            <div className="tablet:col-span-4">
              <Reveal>
                <Label>What you get</Label>
              </Reveal>
            </div>
            <ol className="flex flex-col tablet:col-span-8">
              {whatYouGet.map((line, i) => (
                <Reveal
                  as="li"
                  key={line}
                  delay={i * 60}
                  className="border-t border-[var(--stroke-soft)] py-5 first:border-t-0 first:pt-0"
                >
                  <p className="type-h6 text-[var(--text-default)]">{line}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="tone-stone section-y bg-[var(--bg-default)]">
        <ProcessSteps />
      </section>

      <FooterHero />
    </>
  );
}
