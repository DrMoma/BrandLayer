/**
 * BRANDS WE'VE BUILT — the proof.
 *
 * Every value here is real. `SLOT()` and `isSlot()` stay exported so the
 * brand template and `npm run check:slots` keep working the moment a new,
 * not-yet-finished brand is added — but nothing currently on the site uses
 * them.
 */
export const SLOT = (label: string) => `[ ${label} ]` as const;
export const isSlot = (v: string) => /^\[ .+ \]$/.test(v);

export type Chapter = { kicker: string; title: string; body: string };

export type Brand = {
  slug: string;
  name: string;
  year: string;
  role: string;
  category: string;
  summary: string;
  link?: string;
  /** Grid placement: column span (of 12) and frame aspect ratio. */
  mosaic: { span: number; start?: number; row?: string; aspect: string; offsetY?: string };
  media: { key: string };
  chapters: readonly Chapter[];
};

export const brands: readonly Brand[] = [
  {
    slug: "brand-layer",
    name: "Brand Layer",
    year: "2023",
    role: "Founders",
    category: "Brand-building partner",
    summary:
      "We help founders build brands that last — guiding, building and backing a few brands at a time, all in. The brand you're looking at right now.",
    mosaic: { span: 7, start: 1, row: "1", aspect: "16 / 11" },
    media: { key: "brandOne" },
    chapters: [
      {
        kicker: "Where it started",
        title: "A studio in Drammen.",
        body: "We started Brand Layer in 2023, designing brands and building websites and stores for businesses that needed to look as good as they were.",
      },
      {
        kicker: "What changed",
        title: "We stopped building sites and started building brands.",
        body: "Launching Perlemor and LANDR ourselves showed us the website is the easy part. What decides whether a brand makes it is everything around it — the idea, the positioning, the launch and the push after. So in 2026 we rebuilt Brand Layer around that.",
      },
      {
        kicker: "What we do now",
        title: "Guide, build, back.",
        body: "We work with founders on every kind of brand — product, coffee, agency, online or in person, small or big. We guide the decisions, build what the brand needs, and put our own work behind the ones we believe in.",
      },
      {
        kicker: "How we choose",
        title: "You pitch us first.",
        body: "We don't take every project — we take the ones we think will succeed, and then give them 100%. That's why the first call is you selling us your idea, not us selling you a package.",
      },
    ],
  },
  {
    slug: "perlemor",
    name: "Perlemor",
    year: "2026",
    role: "Founders",
    category: "Jewellery brand",
    summary:
      "A Norwegian jewellery brand selling gold-plated jewellery and freshwater pearls online at perlemor.eu — built from the product catalogue up.",
    link: "https://perlemor.eu",
    mosaic: { span: 5, start: 8, row: "1 / span 2", aspect: "4 / 5", offsetY: "calc(var(--space-block) * 2)" },
    media: { key: "brandThree" },
    chapters: [
      {
        kicker: "The idea",
        title: "Jewellery that looks expensive, priced like it isn't.",
        body: "Gold-plated recycled brass and stainless steel, set with real freshwater pearls — a catalogue built to look premium without the premium markup.",
      },
      {
        kicker: "What we did",
        title: "Built the brand and the store, then checked our own work.",
        body: "We designed the identity and built the Shopify store, then went back through all 75 products and rewrote every marketing claim to match what the materials actually are and do.",
      },
      {
        kicker: "What it taught us",
        title: "Unverified claims find you eventually.",
        body: "Early copy overstated what the jewellery could survive — showers, swimming, the gym. We'd rather a shorter, accurate claim than a longer one we can't stand behind.",
      },
    ],
  },
  {
    slug: "landr",
    name: "LANDR",
    year: "2026",
    role: "Co-founder, with Niklas Lohne-Hansen",
    category: "Technical outdoor apparel",
    summary:
      "Premium technical snow gear, co-founded with Paralympian Niklas Lohne-Hansen and built around his own story — landr.no.",
    link: "https://landr.no",
    mosaic: { span: 7, start: 1, row: "2", aspect: "16 / 10" },
    media: { key: "brandTwo" },
    chapters: [
      {
        kicker: "The idea",
        title: "Gear with a founder's story behind it.",
        body: "Niklas is a Paralympian who needed technical snow gear that actually performs. We built a brand around that — not a logo bolted onto generic outerwear.",
      },
      {
        kicker: "What we did",
        title: "A black-and-white, editorial-first identity.",
        body: "Full brand identity and a built-from-scratch Shopify store — jackets, mid layers and accessories, photographed and written to carry the founder story honestly.",
      },
      {
        kicker: "What it taught us",
        title: "The founder's story carries the brand.",
        body: "A real reason to exist is worth more than any amount of styling. Our job was to get out of its way, not cover it up.",
      },
    ],
  },
] as const;

export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
export const getNextBrand = (slug: string) => {
  const i = brands.findIndex((b) => b.slug === slug);
  return brands[(i + 1) % brands.length];
};
