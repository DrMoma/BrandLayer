import type { Metadata } from "next";
import { cv } from "@/content/cv";
import { site } from "@/content/site";
import { PageHero } from "@/components/blocks/PageHero";
import { FooterHero } from "@/components/blocks/FooterHero";
import { Label, ArrowLink } from "@/components/blocks/primitives";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: `CV — ${cv.name}`,
  description: cv.intro,
  alternates: { canonical: "/cv" },
};

function Rows({ rows }: { rows: readonly { period: string; role: string; org: string }[] }) {
  return (
    <div className="flex flex-col">
      {rows.map((r, i) => (
        <Reveal
          key={`${r.period}-${r.role}`}
          delay={i * 40}
          className="grid gap-1 border-t border-[var(--stroke-soft)] py-5 tablet:grid-cols-12 tablet:gap-[var(--gutter)]"
        >
          <Label className="tablet:col-span-3">{r.period}</Label>
          <p className="type-body text-[var(--text-default)] tablet:col-span-5">{r.role}</p>
          <p className="type-body text-[var(--text-neutral)] tablet:col-span-4">{r.org}</p>
        </Reveal>
      ))}
    </div>
  );
}

export default function CvPage() {
  return (
    <>
      <PageHero kicker="Curriculum vitae" title={cv.name.toUpperCase()} intro={cv.intro} />

      <section className="section-y pt-0">
        <div className="canvas flex flex-col gap-[var(--space-block)]">
          <div>
            <Label className="mb-6">Experience</Label>
            <Rows rows={cv.experience} />
          </div>

          <div>
            <Label className="mb-6">Education</Label>
            <Rows rows={cv.education} />
          </div>

          <div className="grid gap-[var(--space-block)] tablet:grid-cols-12 tablet:gap-[var(--gutter)]">
            <div className="tablet:col-span-6">
              <Label className="mb-6">Skills</Label>
              <ul className="flex flex-col gap-3 border-t border-[var(--stroke-soft)] pt-5">
                {cv.skills.map((s) => (
                  <li key={s} className="type-body text-[var(--text-default)]">
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="tablet:col-span-6">
              <Label className="mb-6">Languages</Label>
              <ul className="flex flex-col gap-3 border-t border-[var(--stroke-soft)] pt-5">
                {cv.languages.map((l) => (
                  <li key={l.name} className="type-body flex justify-between text-[var(--text-default)]">
                    <span>{l.name}</span>
                    <span className="text-[var(--text-neutral)]">{l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Reveal>
            <ArrowLink href={`mailto:${site.email}`} className="type-label text-[var(--text-default)]">
              {site.email}
            </ArrowLink>
          </Reveal>
        </div>
      </section>

      <FooterHero />
    </>
  );
}
