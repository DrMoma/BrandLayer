import { brands } from "@/content/brands";
import { Hero } from "@/components/blocks/Hero";
import { Statement } from "@/components/blocks/Statement";
import { CapabilityStack } from "@/components/blocks/CapabilityStack";
import { WorkMosaic } from "@/components/blocks/WorkMosaic";
import { StandardsBand } from "@/components/blocks/StandardsBand";
import { ProcessSteps } from "@/components/blocks/ProcessSteps";
import { FooterHero } from "@/components/blocks/FooterHero";
import { SectionHead, ArrowLink } from "@/components/blocks/primitives";
import { Reveal } from "@/components/motion/Reveal";

// One looping hero film. Add entries back here to restore the carousel — the
// controls and autoplay reappear on their own once there is more than one.
const slides = [{ slot: "heroOne", caption: "Pitch us your brand", href: "/pitch" }];

export default function Home() {
  return (
    <>
      <Hero title={"FEW BRANDS.\nALL IN."} slides={slides} />

      <section className="section-y">
        <Statement
          kicker="Why we do this"
          paragraphs={[
            "We've launched three brands — Brand Layer, Perlemor and LANDR — and each one taught us the same thing: the idea is rarely what fails. What fails is everything around it — the name, the story, the first hundred customers, the nerve to keep going.",
            "That's where we work. Coffee brands, product brands, dropshipping stores, agencies — small or big, online or on a street corner. We guide, we work alongside you, and sometimes we invest.",
            "We don't take every project. The ones we take, we take all the way — because we only say yes when we believe it will work.",
          ]}
          cta={{ href: "/about", label: "More about us" }}
        />
      </section>

      <section className="tone-stone section-y bg-[var(--bg-default)]">
        <div className="canvas">
          <SectionHead kicker="How we help" title={"THREE\nWAYS IN"} />
        </div>
        <div className="mt-[var(--space-block)]">
          <CapabilityStack />
        </div>
      </section>

      <section className="section-y">
        <div className="canvas">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHead kicker="Brands we've built" title={"RECEIPTS.\nNOT DECKS."} className="flex-1" />
            <Reveal delay={140}>
              <ArrowLink href="/brands" className="type-label text-[var(--text-default)]">
                All brands
              </ArrowLink>
            </Reveal>
          </div>
        </div>

        <div className="mt-[var(--space-block)]">
          <WorkMosaic items={brands} />
        </div>
      </section>

      <section className="tone-stone section-y bg-[var(--bg-default)]">
        <StandardsBand />
      </section>

      <section className="section-y">
        <ProcessSteps />
      </section>

      <FooterHero />
    </>
  );
}
