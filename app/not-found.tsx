import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { FooterHero } from "@/components/blocks/FooterHero";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <PageHero
        kicker="404"
        title={"NOTHING\nHERE"}
        intro="That page has moved or never existed. Everything else is one keystroke away — press ⌘K."
      />
      <section className="section-y pt-0">
        <div className="canvas flex flex-wrap gap-3">
          {site.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="type-nav rounded-full border border-[var(--stroke-firm)] px-5 py-3 transition-colors duration-300 hover:border-[var(--text-default)]"
            >
              {n.label}
            </Link>
          ))}
        </div>
      </section>
      <FooterHero />
    </>
  );
}
