import type { Metadata } from "next";
import { WorkMosaic } from "@/components/blocks/WorkMosaic";
import { PageHero } from "@/components/blocks/PageHero";
import { FooterHero } from "@/components/blocks/FooterHero";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "The brands we've built — what they were, what we did, and what each one taught us about building the next.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  return (
    <>
      <PageHero
        kicker="Brands we've built"
        title={"RECEIPTS.\nNOT DECKS."}
        intro="We don't ask you to trust advice we haven't taken ourselves. These are the brands we've built — the wins, and what we learned the hard way."
      />
      <section className="section-y pt-0">
        <WorkMosaic />
      </section>
      <FooterHero />
    </>
  );
}
