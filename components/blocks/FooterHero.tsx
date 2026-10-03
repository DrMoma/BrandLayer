import Link from "next/link";
import { site } from "@/content/site";
import { Media } from "@/components/blocks/Media";
import { FitText } from "@/components/motion/FitText";
import { Reveal } from "@/components/motion/Reveal";
import { Label, ArrowLink } from "@/components/blocks/primitives";
import { Mark } from "@/components/chrome/Lockup";

/**
 * FOOTER AS HERO
 *
 * The last screen carries the same weight as the first: full-bleed media, a
 * fit-to-width lockup and one clear action. It is also the only deep-toned
 * section on the site — a single, deliberate change of ground at the very end,
 * instead of the page flipping back and forth while you scroll.
 */
export function FooterHero() {
  const year = new Date().getFullYear();

  return (
    <footer className="tone-deep relative isolate overflow-hidden bg-[var(--bg-default)] text-[var(--text-default)]">
      {/* Media sits behind everything, dimmed so type stays legible. */}
      <div className="absolute inset-0 -z-10 opacity-[0.55]">
        <Media slot="footer" className="h-full w-full object-cover" />
      </div>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--bg-default)] via-transparent to-[var(--bg-default)]"
        aria-hidden="true"
      />

      <div className="section-y">
        <div className="canvas">
          <Reveal>
            <Label>Got an idea?</Label>
          </Reveal>

          <div className="mt-8">
            <FitText text={"PITCH US\nYOUR BRAND"} stagger={90} />
          </div>

          <Reveal delay={100} className="mt-6">
            <p className="type-body max-w-[48ch] text-[var(--text-neutral)]">
              For founders who are ready to go all in — not just curious.
            </p>
          </Reveal>

          <div className="mt-[var(--space-block)] flex flex-col gap-10 tablet:flex-row tablet:items-end tablet:justify-between">
            <Reveal delay={160} className="flex flex-col gap-3">
              <Link
                href="/pitch#book"
                data-cursor="Book"
                className="group inline-flex w-fit items-center gap-3 rounded-full border border-[var(--stroke-firm)] px-6 py-3.5 transition-colors duration-300 hover:border-[var(--text-default)]"
              >
                <span className="type-nav text-[var(--text-default)]">{site.booking.label}</span>
                <span className="arrow-nudge" aria-hidden="true">
                  ↘
                </span>
              </Link>
              <Label>{site.booking.note}</Label>
            </Reveal>

            <Reveal delay={220} className="flex flex-col gap-2">
              <ArrowLink
                href={`mailto:${site.email}`}
                className="type-h5 text-[var(--text-default)]"
              >
                {site.email}
              </ArrowLink>
              <Label>
                {site.location.city}, {site.location.country} · {site.location.lat}°N{" "}
                {site.location.lon}°E
              </Label>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Meta row. Extra bottom padding clears the floating command bar, which
          is fixed 24px (mobile) / 60px (desktop) off the bottom and would
          otherwise sit on top of the last row on the page. */}
      <div className="canvas border-t border-[var(--stroke-soft)] pt-8 pb-[calc(var(--space-block)+72px)] tablet:pb-[calc(var(--space-block)+96px)]">
        <div className="flex flex-col gap-6 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-center gap-3">
            <Mark className="h-4 w-auto text-[var(--text-default)]" />
            <Label>
              © {year} {site.name} · Org.nr {site.company.orgNumber}
            </Label>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {site.nav.map((n) => (
              <Link key={n.href} href={n.href} className="type-label link-wipe text-[var(--text-neutral)]">
                {n.label}
              </Link>
            ))}
            <Link href="/cv" className="type-label link-wipe text-[var(--text-neutral)]">
              CV
            </Link>
            <Link href="/privacy" className="type-label link-wipe text-[var(--text-neutral)]">
              Privacy
            </Link>
            <Link href="/legal" className="type-label link-wipe text-[var(--text-neutral)]">
              Legal
            </Link>
            <a
              href={site.instagram}
              rel="noreferrer noopener"
              target="_blank"
              className="type-label link-wipe text-[var(--text-neutral)]"
            >
              {site.instagramHandle}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
