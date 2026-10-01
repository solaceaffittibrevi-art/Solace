import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solace | Affitti brevi",
  description: "Gestione professionale di affitti brevi.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
