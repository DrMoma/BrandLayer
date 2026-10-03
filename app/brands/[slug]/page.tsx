import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { brands, getBrand, getNextBrand, isSlot } from "@/content/brands";
import { BrandHero, BrandChapters } from "@/components/case/CaseParts";
import { FooterHero } from "@/components/blocks/FooterHero";
import { SectionHead } from "@/components/blocks/primitives";
import { Reveal } from "@/components/motion/Reveal";

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};
  const description = isSlot(brand.summary) ? `${brand.name} — ${brand.role}, ${brand.year}.` : brand.summary;
  // The layout template appends "— Brand Layer", so Brand Layer's own page
  // needs a different title or the name doubles up.
  return {
    title: brand.name === site.name ? "The story" : brand.name,
    description,
    alternates: { canonical: `/brands/${brand.slug}` },
    openGraph: { title: brand.name, description },
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();
  const next = getNextBrand(slug);

  return (
    <>
      <BrandHero brand={brand} />

      <section className="section-y">
        <BrandChapters brand={brand} />
      </section>

      <section className="tone-stone section-y bg-[var(--bg-default)]">
        <div className="canvas">
          <SectionHead kicker="Next brand" title={next.name.toUpperCase()} />
          <Reveal delay={160} className="mt-[var(--space-block)]">
            <Link
              href={`/brands/${next.slug}`}
              data-cursor="View"
              className="group inline-flex items-center gap-3 rounded-full border border-[var(--stroke-firm)] px-6 py-3.5 transition-colors duration-300 hover:border-[var(--text-default)]"
            >
              <span className="type-nav">See {next.name}</span>
              <span className="arrow-nudge" aria-hidden="true">
                ↘
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <FooterHero />
    </>
  );
}
