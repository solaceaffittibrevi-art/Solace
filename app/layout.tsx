import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

const sans = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Solace | Gestione affitti brevi premium",
  description:
    "Solace gestisce il tuo immobile in affitto breve: pricing dinamico, home staging, foto professionali e gestione ospiti completa. Più reddito, zero stress.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
