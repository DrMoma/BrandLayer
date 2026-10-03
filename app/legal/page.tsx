import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { PageHero } from "@/components/blocks/PageHero";
import { Prose } from "@/components/blocks/Prose";
import { FooterHero } from "@/components/blocks/FooterHero";

export const metadata: Metadata = {
  title: "Legal",
  description: "Company information, site terms, ownership and liability.",
  alternates: { canonical: "/legal" },
  robots: { index: false, follow: true },
};

const UPDATED = "2026-10-03";

export default function LegalPage() {
  const { company } = site;
  const entity = [
    { term: "Registered name", value: company.legalName },
    { term: "Trading as", value: site.name },
    { term: "Entity type", value: company.form },
    { term: "Organisasjonsnummer", value: company.orgNumber },
    { term: "Registered address", value: company.address.join(", ") },
    { term: "VAT", value: company.vat },
    { term: "Responsible person", value: site.founder },
    { term: "Email", value: site.email, href: `mailto:${site.email}` },
  ];

  return (
    <>
      <PageHero kicker={`Last updated ${UPDATED}`} title="LEGAL" />

      <section className="section-y pt-0">
        <Prose>
          {/* NOTE: baseline terms. Have these reviewed before launch. */}
          <h2 className="type-h5">Company information</h2>
          <p className="type-body">
            {site.domain} is operated by the legal entity below, as required by Norwegian
            commercial-disclosure rules (ehandelsloven §8).
          </p>
          <dl className="grid border-t border-[var(--stroke-soft)]">
            {entity.map((row) => (
              <div
                key={row.term}
                className="grid gap-1 border-b border-[var(--stroke-soft)] py-4 tablet:grid-cols-[14rem_1fr] tablet:gap-6"
              >
                <dt className="type-label text-[var(--text-faint)]">{row.term}</dt>
                <dd className="type-body text-[var(--text-default)]">
                  {row.href ? <a href={row.href}>{row.value}</a> : row.value}
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="type-h5">Content</h2>
          <p className="type-body">
            All text, design, code and imagery on this site are the property of {site.name} unless
            stated otherwise. Material about other brands is published with their permission where
            applicable. You may not reproduce it commercially without written consent.
          </p>

          <h2 className="type-h5">Accuracy</h2>
          <p className="type-body">
            We keep this site accurate and current, but make no warranty that it is complete or
            error-free. Nothing here constitutes a binding offer; engagements are governed by a
            signed agreement.
          </p>

          <h2 className="type-h5">Liability</h2>
          <p className="type-body">
            To the extent permitted by Norwegian law, {site.name} is not liable for indirect or
            consequential loss arising from use of this site or from reliance on its content.
          </p>

          <h2 className="type-h5">Pitches and ideas</h2>
          <p className="type-body">
            We treat what you tell us in a pitch as confidential and don&apos;t share it outside{" "}
            {site.name} without your permission. We also build brands of our own and hear many
            ideas, so a pitch doesn&apos;t stop us working on something similar we already had, or
            arrive at independently. A pitch call creates no obligation on either side — nothing is
            agreed until it is signed.
          </p>

          <h2 className="type-h5">Data protection</h2>
          <p className="type-body">
            The entity above is the data controller. How we handle personal data is set out in
            our <Link href="/privacy">privacy notice</Link>. The supervisory authority is
            Datatilsynet, the Norwegian Data Protection Authority.
          </p>

          <h2 className="type-h5">Governing law</h2>
          <p className="type-body">
            This site and any commercial relationship arising through it are governed by Norwegian
            law, with the district court (tingrett) for the company&apos;s registered address as the
            agreed venue, unless a signed contract says otherwise.
          </p>
        </Prose>
      </section>

      <FooterHero />
    </>
  );
}
