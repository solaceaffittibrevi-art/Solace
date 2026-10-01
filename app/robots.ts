import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// L'indicizzazione è attiva solo quando il sito è pubblicato in produzione con il suo dominio:
// in locale e nelle anteprime i motori di ricerca vengono tenuti fuori.
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";
  if (!isProduction) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
