import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHero } from "@/components/blocks/PageHero";
import { Statement } from "@/components/blocks/Statement";
import { FooterHero } from "@/components/blocks/FooterHero";
import { Frame, Label, ArrowLink } from "@/components/blocks/primitives";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Momcilo Paunov — founder of Brand Layer, based in Ålesund, Norway. Three brands launched; now helping a few founders at a time build theirs.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    index: "01",
    title: "You pitch first",
    body: "The first call is yours. Tell us what you're building and why it will work — then we'll tell you how we'd help.",
  },
  {
    index: "02",
    title: "Honest, even when it's a no",
    body: "If we don't believe in it, we'll say so, and tell you why. That's worth more than a polite maybe.",
  },
  {
    index: "03",
    title: "All in, or not at all",
    body: "When we say yes, we're in 100%. No half-hearted retainers, no disappearing after the kickoff.",
  },
  {
    index: "04",
    title: "Sales over slides",
    body: "A brand works when people buy it. Everything we do gets measured against that.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About"
        title={"BUILT BY\nDOING"}
        intro={`${site.founder} founded ${site.name} in Drammen in ${site.founded}. Today we're based in ${site.location.city}, ${site.location.country} — three brands launched, and helping other founders build theirs.`}
      />

      <section className="section-y pt-0">
        <div className="canvas">
          <Frame slot="about" aspect="16 / 9" priority />
        </div>
      </section>

      <section className="section-y pt-0">
        <Statement
          kicker="How we got here"
          paragraphs={[
            "We learned brand building by doing it — selling on the shop floor, running the numbers, leading a team, and starting again when something didn't work.",
            "Now we put that to work for other founders. We keep the number of projects small on purpose, so the ones we take get everything we have.",
          ]}
        />
      </section>

      <section className="tone-stone section-y bg-[var(--bg-default)]">
        <div className="canvas">
          <Label>Principles</Label>
          <div className="mt-[var(--space-block)] grid gap-px overflow-hidden border border-[var(--stroke-soft)] bg-[var(--stroke-soft)] tablet:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal
                key={p.index}
                delay={i * 70}
                className="flex flex-col gap-4 bg-[var(--bg-default)] p-8 tablet:min-h-[260px] tablet:p-10"
              >
                <Label className="tabular-nums">{p.index}</Label>
                <h2 className="type-h5 text-[var(--text-default)]">{p.title}</h2>
                <p className="type-body text-[var(--text-neutral)]">{p.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-[var(--space-block)]">
            <ArrowLink href="/cv" className="type-label text-[var(--text-default)]">
              Founder's CV
            </ArrowLink>
          </Reveal>
        </div>
      </section>

      <FooterHero />
    </>
  );
}
