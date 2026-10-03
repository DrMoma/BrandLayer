import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHero } from "@/components/blocks/PageHero";
import { BookingCalendar } from "@/components/blocks/BookingCalendar";
import { FooterHero } from "@/components/blocks/FooterHero";
import { Label, ArrowLink } from "@/components/blocks/primitives";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Pitch",
  description:
    "Pitch us your brand. Book a 15-minute call and tell us why your idea will work.",
  alternates: { canonical: "/pitch" },
};

export default function PitchPage() {
  return (
    <>
      <PageHero
        kicker="Pitch us your brand"
        title={"YOUR IDEA.\nYOUR PITCH."}
        intro="The first call works the other way round. Tell us what you're building and why it will work. If we believe it, we'll tell you how we can help."
      />

      <section className="tone-stone section-y bg-[var(--bg-default)]">
        <div className="canvas grid gap-[var(--space-block)] tablet:grid-cols-12 tablet:gap-[var(--gutter)]">
          <div className="tablet:col-span-4">
            <Reveal>
              <Label>What we'll ask you</Label>
            </Reveal>
            <Reveal delay={60}>
              <p className="type-body mt-4 max-w-[36ch] text-[var(--text-neutral)]">
                Come ready to answer these. Short answers are fine — the call is where you
                make the case.
              </p>
            </Reveal>
          </div>

          <ol className="flex flex-col tablet:col-span-8">
            {site.pitchQuestions.map((item, i) => (
              <Reveal
                as="li"
                key={item.q}
                delay={i * 60}
                className="grid grid-cols-[3rem_1fr] gap-4 border-t border-[var(--stroke-soft)] py-6"
              >
                <Label className="tabular-nums">{String(i + 1).padStart(2, "0")}</Label>
                <div className="flex flex-col gap-1.5">
                  <p className="type-h6 text-[var(--text-default)]">
                    {item.q}
                    {"required" in item && item.required && (
                      <span className="sr-only"> (required)</span>
                    )}
                  </p>
                  {"hint" in item && item.hint && (
                    <p className="type-label text-[var(--text-faint)]">{item.hint}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y">
        <div className="canvas grid gap-[var(--space-block)] tablet:grid-cols-12 tablet:gap-[var(--gutter)]">
          <div className="flex flex-col gap-10 tablet:col-span-4">
            <Reveal className="flex flex-col gap-2">
              <Label>Availability</Label>
              <p className="type-body text-[var(--text-default)]">{site.booking.note}</p>
            </Reveal>

            <Reveal delay={80} className="flex flex-col gap-2">
              <Label>Rather write?</Label>
              <ArrowLink href={`mailto:${site.email}`} className="type-h5 text-[var(--text-default)]">
                {site.email}
              </ArrowLink>
            </Reveal>

            <Reveal delay={140} className="flex flex-col gap-2">
              <Label>Based in</Label>
              <p className="type-body text-[var(--text-default)]">
                {site.location.city}, {site.location.country}
                <br />
                <span className="text-[var(--text-neutral)]">Online or in person</span>
              </p>
            </Reveal>

            <Reveal delay={200} className="flex flex-col gap-2">
              <Label>Elsewhere</Label>
              <ArrowLink href={site.instagram} className="type-body text-[var(--text-default)]">
                {site.instagramHandle}
              </ArrowLink>
            </Reveal>
          </div>

          <div
            id="book"
            className="scroll-mt-[calc(var(--header-h)+24px)] tablet:col-span-8"
          >
            <div className="w-full max-w-[26rem] desktop:max-w-none">
              <Reveal>
                <Label className="mb-6">{site.booking.label}</Label>
              </Reveal>
              <BookingCalendar />
            </div>
          </div>
        </div>
      </section>

      <FooterHero />
    </>
  );
}
