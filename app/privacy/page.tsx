import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHero } from "@/components/blocks/PageHero";
import { Prose } from "@/components/blocks/Prose";
import { FooterHero } from "@/components/blocks/FooterHero";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this site collects, what it does not, and who processes it.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

const UPDATED = "2026-10-03";

export default function PrivacyPage() {
  return (
    <>
      <PageHero kicker={`Last updated ${UPDATED}`} title="PRIVACY" />

      <section className="section-y pt-0">
        <Prose>
          {/* NOTE: written to match what this site actually does. Have it
              reviewed against GDPR before launch — this is not legal advice. */}
          <p className="type-body">
            This describes what {site.name} collects when you visit {site.domain}, and what happens
            to it. The data controller is {site.company.legalName}, a Norwegian sole
            proprietorship (ENK), organisasjonsnummer {site.company.orgNumber}, trading as{" "}
            {site.name}. Questions go to {site.email}.
          </p>

          <h2 className="type-h5">What we collect</h2>
          <p className="type-body">
            Nothing just for visiting. No account, no login, no analytics, no advertising or
            tracking cookies — the site sets no cookies of its own. Fonts, images and video are
            served from this site, not from third parties.
          </p>

          <h2 className="type-h5">Booking a pitch</h2>
          <p className="type-body">
            The calendar on the Pitch page is our own. Cal.com, the booking service behind it, is
            only loaded when you start using the calendar. If you book a call, what you enter —
            name, email, phone number and what the call is about — goes to Cal.com and to us, and
            Cal.com may set the cookies it needs for the booking to work. We use it to hold the
            call and follow up on your pitch, and nothing else. Cal.com is a US company, so these
            details may be processed outside the EEA under Cal.com&apos;s data processing terms.
            Booking records are kept while we work together, then deleted within 12 months.
          </p>

          <h2 className="type-h5">Email</h2>
          <p className="type-body">
            If you email {site.email}, your message is stored in our Google (Gmail) inbox. We keep
            correspondence for up to three years after our last exchange, then delete it.
          </p>

          <h2 className="type-h5">Hosting</h2>
          <p className="type-body">
            The site is hosted by Vercel, which processes standard server logs, including IP
            address, for security and delivery. Vercel keeps these logs for a short period and
            rotates them automatically.
          </p>

          <h2 className="type-h5">Who else sees it</h2>
          <p className="type-body">
            Only the services named above, each acting for us: Cal.com (bookings), Google (email)
            and Vercel (hosting). All three are US companies, so data may be processed outside the
            EEA under their standard data processing terms. We never sell or rent personal data.
          </p>

          <h2 className="type-h5">Why we&apos;re allowed to</h2>
          <p className="type-body">
            Booking and email details are processed because you asked us to talk with you (GDPR
            article 6(1)(b)). Server logs are processed in our legitimate interest in keeping the
            site secure and working (article 6(1)(f)).
          </p>

          <h2 className="type-h5">Your rights</h2>
          <p className="type-body">
            Under the GDPR you may ask for access to, correction, deletion, restriction or a
            portable copy of any personal data we hold about you, and you may object to
            processing. Write to {site.email} and we
            will respond within 30 days. You can also complain to Datatilsynet, the Norwegian Data
            Protection Authority, at datatilsynet.no.
          </p>
        </Prose>
      </section>

      <FooterHero />
    </>
  );
}
