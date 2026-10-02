import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { properties } from "@/lib/immobili";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/servizi", "/come-funziona", "/immobili", "/chi-siamo", "/faq", "/valutazione-gratuita"];
  return [
    ...pages.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path === "/valutazione-gratuita" ? 0.9 : 0.7,
    })),
    ...properties.map((p) => ({ url: `${site.url}/immobili/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
