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
    default: "Gestione affitti brevi a Milano | Solace",
    template: "%s | Solace – Gestione affitti brevi Milano",
  },
  description:
    "Solace gestisce il tuo appartamento in affitto breve a Milano: annunci, prezzi, ospiti, pulizie e adempimenti, con rendicontazione trasparente. Richiedi un'analisi gratuita.",
  keywords: ["gestione affitti brevi Milano", "gestione Airbnb Milano", "property management Milano", "affitti brevi Milano"],
  applicationName: "Solace",
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Solace",
    title: "Solace – Gestione affitti brevi a Milano",
    description: "La tua casa a Milano, gestita con cura e trasparenza. Richiedi un'analisi gratuita del tuo immobile.",
    images: [{ url: "/images/immobili/suite-prestige/01.jpg", width: 1920, height: 1280, alt: "Terrazzo sui tetti di Milano" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#070b16",
  colorScheme: "dark light",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: "Solace",
  url: site.url,
  logo: `${site.url}/brand/logo-stacked.svg`,
  description: "Gestione di affitti brevi e property management a Milano.",
  areaServed: { "@type": "City", name: "Milano" },
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
