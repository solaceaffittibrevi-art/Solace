import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy compatibile con il sito attuale: tutte le risorse (script, stili, font,
// immagini) sono servite dal sito stesso. 'unsafe-inline' serve per i piccoli script che Next.js
// inserisce nella pagina e per gli stili inline delle animazioni; 'unsafe-eval' e ws: solo in sviluppo.
// Se in futuro si aggiungono Tag Manager, Analytics o un widget Calendly incorporato, vanno
// aggiunti qui i relativi domini.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(process.env.NEXT_PUBLIC_SITE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Ignorata dai browser su http (sviluppo locale); attiva sul dominio in https.
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [{ source: "/analisi-gratuita", destination: "/valutazione-gratuita", permanent: true }];
  },
};

export default nextConfig;
