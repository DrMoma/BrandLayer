export type Way = {
  index: string;
  slug: string;
  label: string;
  title: string;
  body: string;
  includes: readonly string[];
};

/** Three ways in. Every project starts with one; some grow into the next. */
export const approach: readonly Way[] = [
  {
    index: "01",
    slug: "guide",
    label: "Guide",
    title: "Clarity\nbefore money.",
    body: "Before you spend on stock, ads or a logo, we get the foundations right: who it's for, what it's called, what it promises and how it launches. Regular sessions, honest feedback, and a plan you can actually follow.",
    includes: ["Positioning", "Naming", "Offer", "Launch plan", "Regular sessions"],
  },
  {
    index: "02",
    slug: "build",
    label: "Build",
    title: "In it\nwith you.",
    body: "When advice isn't enough, we roll up our sleeves. Identity, store or website, content and the first customers — built alongside you, not handed over in a folder.",
    includes: ["Brand identity", "Store or website", "Content", "First customers", "Sales"],
  },
  {
    index: "03",
    slug: "back",
    label: "Back",
    title: "More than\nadvice.",
    body: "For the few brands we believe in most, we invest. When we're in, we're in — and we want it to win as much as you do.",
    includes: ["Investment", "Ongoing involvement", "Long-term partnership"],
  },
];

/** What founders get, in plain terms — rendered on /approach. */
export const whatYouGet = [
  "You'll leave the first call with a straight answer — yes or no, and why.",
  "You'll get a written plan before anything costs money.",
  "You'll work directly with us — no account managers, no handoffs.",
  "You'll have us as invested in the outcome as you are.",
] as const;

/** Who it's for — rendered on /approach. */
export const audience = {
  stages: [
    { label: "Just an idea", body: "You know what you want to build, but not yet how." },
    { label: "About to launch", body: "The product is close. The brand around it isn't." },
    { label: "Launched and stuck", body: "It's live, it sells a little, and it's stopped growing." },
    { label: "Ready to grow", body: "It works. Now it needs to get bigger without breaking." },
  ],
} as const;
