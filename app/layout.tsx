import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";

import "./globals.css";
import { site } from "@/content/site";
import { Header } from "@/components/chrome/Header";
import { CommandBar } from "@/components/chrome/CommandBar";
import { IntroSequence } from "@/components/chrome/IntroSequence";
import { MotionProvider } from "@/components/chrome/MotionProvider";
import { Cursor } from "@/components/chrome/Cursor";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
  // Metric-matched fallback: keeps FitText from shifting when the real face lands.
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "brand building",
    "founder mentor",
    "startup advisor",
    "brand strategy",
    "dropshipping",
    "SMMA",
    "Norway",
    "merkevarebygging",
    "gründer",
    "rådgiver",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: "en_US",
    alternateLocale: ["nb_NO"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

/** Tells search engines who runs the site — schema.org Organization. */
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.company.legalName,
  url: site.url,
  email: site.email,
  slogan: site.tagline,
  foundingDate: String(site.founded),
  founder: { "@type": "Person", name: site.founder },
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location.city,
    addressCountry: site.location.countryCode,
  },
  sameAs: [site.instagram],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-[var(--bg-default)] focus:px-5 focus:py-3 focus:text-[var(--text-default)]"
        >
          Skip to content
        </a>

        <MotionProvider />
        <IntroSequence />
        <Header />

        <main id="main">{children}</main>

        <CommandBar />
        <Cursor />
      </body>
    </html>
  );
}
