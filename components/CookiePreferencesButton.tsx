"use client";

import { openCookiePreferences } from "@/lib/consent";

// Riapre il banner dei cookie per cambiare la scelta in qualsiasi momento.
export default function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={openCookiePreferences}>
      Preferenze cookie
    </button>
  );
}
