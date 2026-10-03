/**
 * Facts. Everything in this file is TRUE and verifiable.
 * Anything not yet true lives in brands.ts as a marked slot.
 */
export const site = {
  name: "Brand Layer",
  domain: "brandlayer.no",
  url: "https://brandlayer.no",
  tagline: "We help founders build brands that last.",
  /** Short enough to read in a browser tab; the tagline carries the detail. */
  title: "Brand Layer — Few brands. All in.",
  description:
    "Brand Layer is run by Momcilo Paunov. We've launched three brands — this one, Perlemor and LANDR — and now help a few founders at a time build theirs: guiding, working alongside, and sometimes investing. You pitch first.",

  founded: 2023,
  founder: "Momcilo Paunov",

  /**
   * The legal entity behind the site (ehandelsloven §8). Every field matches
   * Brønnøysundregistrene — keep it that way if anything changes there.
   */
  company: {
    legalName: "MOMCILO PAUNOV",
    form: "Enkeltpersonforetak (ENK)",
    orgNumber: "936 104 894",
    address: ["c/o 337", "Vågavegen 29", "6008 Ålesund", "Norway"],
    vat: "Not registered for VAT (below the registration threshold)",
  },

  email: "hello@brandlayer.no",
  instagram: "https://www.instagram.com/yourbrandlayer",
  instagramHandle: "@yourbrandlayer",

  booking: {
    // Cal.com — swap the slug if you create a dedicated pitch event.
    slug: "momcilo-brandlayer/15min",
    label: "Book your pitch",
    note: "Weekday evenings & weekends · Oslo time",
  },

  location: {
    city: "Ålesund",
    country: "Norway",
    countryCode: "NO",
    region: "NO-15",
    lat: 62.4725,
    lon: 6.1549,
  },

  nav: [
    { label: "Brands", href: "/brands" },
    { label: "Approach", href: "/approach" },
    { label: "About", href: "/about" },
    { label: "Pitch", href: "/pitch" },
  ],

  /** Why we say no a lot — the reasons, in plain words. */
  principles: [
    {
      title: "We only back what we believe in.",
      body: "If we can't see how it wins, our time won't change that. Better to tell you now than to take your money and hope.",
    },
    {
      title: "Every yes gets everything.",
      body: "We keep the number of projects small on purpose, so each founder gets our full attention — not a slice of it.",
    },
    {
      title: "A no now saves you money later.",
      body: "Hearing it on the first call costs nothing. Finding out after stock, ads and a launch costs a lot more.",
    },
    {
      title: "Our name goes on it.",
      body: "Every brand we take on becomes proof of what we do. We only put our name on work we'd show anyone.",
    },
  ],

  /** Who we help — the marquee under the hero. */
  marquee: [
    "Product brands",
    "Coffee",
    "Dropshipping",
    "E-commerce",
    "SMMA",
    "Agencies",
    "Online",
    "In person",
    "Small",
    "Big",
  ],

  /**
   * The pitch. Shown on /pitch so founders can prepare, and mirrored as
   * booking questions in Cal.com — keep the two in sync.
   */
  pitchQuestions: [
    { q: "Your brand or idea, in one sentence.", required: true },
    { q: "What stage are you at?", hint: "Idea · Pre-launch · Launched (under a year) · Established", required: true },
    { q: "What kind of brand is it?", hint: "Product · Coffee or food · Dropshipping · E-commerce · SMMA or agency · Other" },
    { q: "What do you need most?", hint: "Guidance · Hands-on help · Investment" },
    { q: "Why will this one succeed?", required: true },
    { q: "A link to the brand, if there is one.", hint: "Website or Instagram" },
  ],
} as const;

export type Site = typeof site;
