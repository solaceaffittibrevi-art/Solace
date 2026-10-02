"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, readConsent, type Consent } from "@/lib/consent";

// Google Analytics 4: caricato SOLO dopo il consenso "statistiche" e solo se NEXT_PUBLIC_GA4_ID è
// impostato. Nessun segnale pubblicitario; cookie con durata massima di 13 mesi. Se il consenso viene
// revocato, la raccolta si ferma e i cookie _ga vengono eliminati.
const GA_ID = process.env.NEXT_PUBLIC_GA4_ID || "";

function deleteGaCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}

export default function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const sync = (c: Consent | null) => {
      const ok = c?.statistiche === true;
      (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = !ok;
      if (!ok) {
        window.gtag?.("consent", "update", { analytics_storage: "denied" });
        deleteGaCookies();
      }
      setAllowed(ok);
    };
    sync(readConsent());
    const onChange = (e: Event) => sync((e as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  useEffect(() => {
    if (!GA_ID || !allowed || document.getElementById("ga4-loader")) {
      if (allowed) window.gtag?.("consent", "update", { analytics_storage: "granted" });
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 60 * 60 * 24 * 395,
    });
    const s = document.createElement("script");
    s.id = "ga4-loader";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(s);
  }, [allowed]);

  return null;
}
