import { site } from "@/content/site";
import { ogCard, ogSize } from "@/lib/og";

export const alt = `${site.name} — ${site.tagline}`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogCard({
    headline: "FEW BRANDS. ALL IN.",
    sub: `${site.name} · ${site.location.city}, ${site.location.country}`,
  });
}
