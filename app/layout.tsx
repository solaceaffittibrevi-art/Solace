import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { site } from "@/lib/site";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Gestione Affitti Brevi Milano | Solace",
    template: "%s | Solace",
  },
  description:
    "Gestione affitti brevi e Airbnb a Milano: ospiti, pulizie, prezzi e adempimenti seguiti da Solace, con un rendiconto chiaro di incassi e costi. Richiedi una valutazione gratuita.",
  keywords: [
    "gestione affitti brevi Milano",
    "gestione Airbnb Milano",
    "gestione appartamenti per affitti brevi",
    "property management Milano",
    "gestione case vacanza Milano",
    "analisi gratuita dell'immobile",
  ],
  applicationName: "Solace",
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Solace",
    title: "Gestione Affitti Brevi Milano | Solace",
    description: "Gestiamo il tuo appartamento in affitto breve a Milano. Richiedi l'analisi gratuita del tuo immobile.",
    images: [{ url: "/images/milano-duomo.webp", width: 1672, height: 941, alt: "Piazza del Duomo a Milano di sera" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  // Indicizzazione solo sul sito pubblicato: anteprime e sviluppo restano fuori dai motori di ricerca.
  robots:
    process.env.NEXT_PUBLIC_SITE_ENV === "production"
      ? { index: true, follow: true }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: "#070b16",
  colorScheme: "dark light",
};

// Solo dati reali: denominazione e P. IVA forniti dal titolare, recapiti pubblici, profili ufficiali.
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Solace",
  legalName: site.business,
  vatID: site.vat,
  url: site.url,
  logo: `${site.url}/brand/logo-stacked.svg`,
  description: "Gestione di affitti brevi e property management a Milano.",
  areaServed: { "@type": "City", name: "Milano" },
  email: site.email,
  telephone: site.phone.replace(/\s/g, ""),
  founder: { "@type": "Person", name: "Gabriel Dal Molin" },
  sameAs: [site.instagram, site.airbnbProfile],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {/* Senza JavaScript i contenuti animati restano visibili. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a href="#contenuto" className="skip-link">
          Vai al contenuto
        </a>
        <Providers>
          <Header />
          <main id="contenuto" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      </body>
    </html>
  );
}
