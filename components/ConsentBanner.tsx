"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PREFERENCES_EVENT, readConsent, saveConsent } from "@/lib/consent";
import { captureSource, clearSource } from "@/lib/source";
import { duration, ease } from "@/lib/motion";

// Banner dei cookie: "Accetta" e "Rifiuta" hanno lo stesso peso, la chiusura equivale a "Rifiuta".
// "Personalizza" mostra la sola categoria facoltativa (statistiche). Il banner si riapre dal footer.
export default function ConsentBanner({ analyticsEnabled }: { analyticsEnabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [stats, setStats] = useState(false);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // Elemento che aveva il focus prima dell'apertura: lo riceve di nuovo alla chiusura (es. "Preferenze cookie").
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const current = readConsent();
    if (current?.statistiche) captureSource();
    // Il primo controllo avviene dopo il montaggio: sul server non si conosce la scelta del visitatore.
    const show = () => {
      const c = readConsent();
      setStats(c?.statistiche ?? false);
      setDetails(true);
      setOpen(true);
    };
    const t = window.setTimeout(() => {
      if (!current) setOpen(true);
    }, 0);
    window.addEventListener(PREFERENCES_EVENT, show);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(PREFERENCES_EVENT, show);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const active = document.activeElement;
    if (active instanceof HTMLElement && !panelRef.current?.contains(active)) returnFocus.current = active;
    panelRef.current?.focus({ preventScroll: true });
  }, [open, details]);

  const choose = (statistiche: boolean) => {
    saveConsent(statistiche);
    if (statistiche) captureSource();
    else clearSource();
    setOpen(false);
    setDetails(false);
    // Il banner sparisce con un'animazione: il focus non deve restare sui suoi pulsanti.
    const target = returnFocus.current;
    returnFocus.current = null;
    if (target && target !== document.body && target.isConnected) target.focus({ preventScroll: true });
    else {
      // Nessun elemento di partenza (banner aperto al caricamento): il Tab successivo riparte dall'inizio
      // della pagina, cioè dal link "Vai al contenuto".
      const body = document.body;
      body.setAttribute("tabindex", "-1");
      body.focus({ preventScroll: true });
      body.addEventListener("blur", () => body.removeAttribute("tabindex"), { once: true });
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open && e.key === "Escape") choose(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          className="consent"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          tabIndex={-1}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: duration.base, ease: ease.out }}
        >
          <button type="button" className="consent__close" onClick={() => choose(false)} aria-label="Chiudi e rifiuta i cookie facoltativi">
            <span aria-hidden="true">×</span>
          </button>
          <h2 id={titleId} className="consent__title">
            Cookie e statistiche
          </h2>
          <p className="consent__text">
            Usiamo solo strumenti tecnici necessari al sito. Con il tuo consenso registriamo anche da quale pagina o
            campagna sei arrivato{analyticsEnabled ? " e statistiche di visita con Google Analytics" : ""}, per capire
            come migliorare il sito. Puoi cambiare idea quando vuoi da &ldquo;Preferenze cookie&rdquo; in fondo alla
            pagina. Dettagli nella <Link href="/cookie">cookie policy</Link>.
          </p>

          {details && (
            <div className="consent__options">
              <div className="consent__option">
                <div>
                  <strong>Tecnici</strong>
                  <span>Necessari al funzionamento, ad esempio per ricordare questa scelta. Sempre attivi.</span>
                </div>
                <span className="consent__always">Sempre attivi</span>
              </div>
              <label className="consent__option">
                <div>
                  <strong>Statistiche</strong>
                  <span>
                    Provenienza della visita allegata alla tua richiesta
                    {analyticsEnabled ? " e misurazione delle visite con Google Analytics" : ""}.
                  </span>
                </div>
                <input
                  type="checkbox"
                  role="switch"
                  className="consent__switch"
                  checked={stats}
                  onChange={(e) => setStats(e.target.checked)}
                />
              </label>
            </div>
          )}

          <div className="consent__actions">
            <button type="button" className="btn btn--ghost consent__btn" onClick={() => choose(false)}>
              Rifiuta
            </button>
            {details ? (
              <button type="button" className="btn btn--ghost consent__btn" onClick={() => choose(stats)}>
                Salva le scelte
              </button>
            ) : (
              <button type="button" className="btn btn--ghost consent__btn" onClick={() => setDetails(true)}>
                Personalizza
              </button>
            )}
            <button type="button" className="btn btn--ghost consent__btn" onClick={() => choose(true)}>
              Accetta
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
