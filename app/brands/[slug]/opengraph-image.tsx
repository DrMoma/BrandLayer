import { site } from "@/content/site";
import { brands, getBrand } from "@/content/brands";
import { ogCard, ogSize } from "@/lib/og";

export const alt = `A brand built by ${site.name}`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export default async function BrandOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const brand = getBrand((await params).slug);
  if (!brand) return ogCard({ headline: "FEW BRANDS. ALL IN.", sub: site.name });
  return ogCard({
    headline: brand.name.toUpperCase(),
    sub: `${brand.category} · ${brand.year} · ${site.name}`,
  });
}
