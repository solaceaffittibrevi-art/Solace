import type { Metadata } from "next";

// Metadati di pagina: titolo, descrizione, canonical e anteprime social (Open Graph e X/Twitter)
// generati sul server, quindi presenti nell'HTML restituito. Il dominio dei canonical viene da
// `metadataBase` (NEXT_PUBLIC_SITE_URL) nel layout.

export const defaultShareImage = {
  url: "/images/milano-duomo.webp",
  width: 1672,
  height: 941,
  alt: "Piazza del Duomo a Milano di sera, con il Duomo illuminato",
};

export function pageMetadata({
  title,
  description,
  path,
  image = defaultShareImage,
}: {
  title: string; // titolo completo, già con "| Solace"
  description: string;
  path: string;
  image?: { url: string; alt: string; width?: number; height?: number };
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "it_IT",
      siteName: "Solace",
      title,
      description,
      url: path,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
