import { site } from "@/content/site";
import { brands, isSlot } from "@/content/brands";
import { approach } from "@/content/approach";

export type SearchItem = {
  id: string;
  label: string;
  group: "Brands" | "Approach" | "Pages" | "Pitch";
  href: string;
  hint?: string;
  keywords: string;
};

const known = (...values: string[]) => values.filter((v) => !isSlot(v));

export const searchIndex: SearchItem[] = [
  ...brands.map((b) => ({
    id: `brand-${b.slug}`,
    label: b.name,
    group: "Brands" as const,
    href: `/brands/${b.slug}`,
    hint: `${b.role} · ${b.year}`,
    keywords: known(b.name, b.role, b.category, b.summary).join(" ").toLowerCase(),
  })),
  ...approach.map((w) => ({
    id: `way-${w.slug}`,
    label: w.label,
    group: "Approach" as const,
    href: "/approach",
    hint: w.title.replace(/\n/g, " "),
    keywords: [w.label, w.title, w.body, ...w.includes].join(" ").toLowerCase(),
  })),
  ...site.nav.map((n) => ({
    id: `page-${n.href}`,
    label: n.label,
    group: "Pages" as const,
    href: n.href,
    keywords: n.label.toLowerCase(),
  })),
  {
    id: "pitch",
    label: site.booking.label,
    group: "Pitch",
    href: "/pitch#book",
    hint: site.booking.note,
    keywords:
      "pitch book call idea apply meeting schedule contact talk brand coffee dropshipping smma agency product ecommerce startup",
  },
  {
    id: "email",
    label: site.email,
    group: "Pitch",
    href: `mailto:${site.email}`,
    hint: "Email us",
    keywords: "email mail contact write reach",
  },
];

export function searchItems(query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return searchIndex
    .map((item) => {
      let score = 0;
      for (const term of terms) {
        if (item.label.toLowerCase().startsWith(term)) score += 6;
        else if (item.label.toLowerCase().includes(term)) score += 4;
        else if (item.keywords.includes(term)) score += 1;
        else return null;
      }
      return { item, score };
    })
    .filter((r): r is { item: SearchItem; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
    .map((r) => r.item);
}
