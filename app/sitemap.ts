import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { brands } from "@/content/brands";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/brands", "/approach", "/about", "/pitch", "/cv"];

  return [
    ...routes.map((r) => ({
      url: `${site.url}${r}`,
      lastModified: now,
      changeFrequency: (r === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: r === "" ? 1 : 0.7,
    })),
    ...brands.map((b) => ({
      url: `${site.url}/brands/${b.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
