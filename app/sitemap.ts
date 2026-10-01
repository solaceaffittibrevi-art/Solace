import type { MetadataRoute } from "next";
import { properties, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/servizi", "/come-funziona", "/immobili", "/chi-siamo", "/faq", "/analisi-gratuita"];
  return [
    ...pages.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path === "/analisi-gratuita" ? 0.9 : 0.7,
    })),
    ...properties.map((p) => ({ url: `${site.url}/immobili/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
