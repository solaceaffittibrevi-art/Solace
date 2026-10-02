"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "./Icon";
import TrackedLink from "./TrackedLink";
import { propertyCounts, propertyStatuses, propertyTypes, validateLead, type LeadErrors, type LeadInput } from "@/lib/lead";
import { site } from "@/lib/site";
import { readSource } from "@/lib/source";
import { duration, ease, spring } from "@/lib/motion";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

const empty: LeadInput = { name: "", contact: "", zone: "", type: "", count: "", status: "", message: "", website: "" };

const errorLabels: Record<keyof LeadErrors, string> = {
  name: "Nome",
  contact: "Recapito",
  zone: "Zona",
  message: "Messaggio",
};

// Messaggi per i codici d'errore restituiti da /api/richiesta.
const failureText: Record<string, string> = {
  unavailable: "In questo momento non riusciamo a ricevere richieste dal sito. I dati che hai scritto sono ancora qui.",
  rate_limited:
    "Sono arrivate troppe richieste da questa connessione in poco tempo. I dati che hai scritto sono ancora qui: riprova tra qualche minuto.",
  in_progress: "La richiesta precedente è ancora in elaborazione. Attendi qualche secondo e riprova.",
};

const newRequestId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

// Modulo di richiesta valutazione. Obbligatori: nome, un recapito, zona. I dettagli sono facoltativi.
// La conferma compare solo se il server risponde che la richiesta è stata consegnata.
export default function LeadForm({ location = "valutazione" }: { location?: string }) {
  const uid = useId();
  const f = (name: string) => `lead${uid.replace(/[^a-zA-Z0-9]/g, "")}-${name}`;
  const [values, setValues] = useState<LeadInput>(empty);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const started = useRef(false);
  const inFlight = useRef(false);
  const requestId = useRef<string>("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const errors = validateLead(values);
  const show = (key: keyof LeadErrors) => (submitted || touched[key] ? errors[key] : undefined);
  const visibleErrors = submitted ? (Object.entries(errors) as [keyof LeadErrors, string][]) : [];
  const isValid = (key: keyof LeadErrors, filled: boolean) => filled && !errors[key] && (touched[key] || submitted);

  const set = <K extends keyof LeadInput>(key: K, value: LeadInput[K]) => {
    if (!started.current) {
      started.current = true;
      track("form_start", location);
    }
    setValues((v) => ({ ...v, [key]: value }));
  };
  const blur = (key: string) => setTouched((t) => ({ ...t, [key]: true }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return; // doppio clic o invio ripetuto
    setSubmitted(true);
    const currentErrors = Object.keys(errors);
    if (currentErrors.length) {
      track("form_error", location, `validazione:${currentErrors.join(",")}`);
      requestAnimationFrame(() => {
        const summary = summaryRef.current;
        if (!summary) return;
        summary.focus({ preventScroll: true });
        summary.scrollIntoView({ block: "center" });
      });
      return;
    }
    inFlight.current = true;
    if (!requestId.current) requestId.current = newRequestId();
    setStatus("submitting");
    setFailure("");
    try {
      const res = await fetch("/api/richiesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, requestId: requestId.current, source: readSource() }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? `http_${res.status}`);
      setStatus("success");
      track("lead_submit_success", location);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (err) {
      const reason = err instanceof Error ? err.message : "unknown";
      setStatus("error");
      setFailure(reason);
      track("form_error", location, `invio:${reason}`);
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "success") {
    return (
      <motion.div
        ref={successRef}
        tabIndex={-1}
        className="form-success"
        role="status"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: ease.out }}
      >
        <motion.span
          className="form-success__icon"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={spring.soft}
        >
          <Icon name="check" size={30} />
        </motion.span>
        <h2>Richiesta ricevuta, grazie {values.name.trim().split(" ")[0]}.</h2>
        <p>
          Ti ricontattiamo al recapito che hai indicato per conoscere meglio la casa e preparare la valutazione. Se
          preferisci fissare subito un orario, puoi prenotare una chiamata.
        </p>
        <TrackedLink href={site.calendly} event="calendly_click" location={`${location}-conferma`} className="btn btn--ghost" external>
          Prenota una chiamata
        </TrackedLink>
      </motion.div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-describedby={f("intro")}>
      <p id={f("intro")} className="form__intro">
        Tre informazioni e abbiamo quello che serve per richiamarti.
      </p>

      <AnimatePresence>
        {visibleErrors.length > 0 && (
          <motion.div
            ref={summaryRef}
            tabIndex={-1}
            className="form__summary"
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast, ease: ease.out }}
          >
            <p>
              <Icon name="alert" size={18} /> Manca qualcosa per inviare la richiesta:
            </p>
            <ul>
              {visibleErrors.map(([key, msg]) => (
                <li key={key}>
                  <a href={`#${f(key)}`}>
                    {errorLabels[key]}: {msg}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <Field id={f("name")} label="Nome" error={show("name")} valid={isValid("name", !!values.name)}>
        <input
          id={f("name")}
          name="name"
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => blur("name")}
          aria-invalid={!!show("name")}
          aria-describedby={show("name") ? `${f("name")}-error` : undefined}
          required
        />
      </Field>

      <Field
        id={f("contact")}
        label="Telefono o email"
        hint="Ti ricontattiamo solo qui, per questa richiesta."
        error={show("contact")}
        valid={isValid("contact", !!values.contact)}
      >
        <input
          id={f("contact")}
          name="contact"
          type="text"
          autoComplete="on"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="next"
          value={values.contact}
          onChange={(e) => set("contact", e.target.value)}
          onBlur={() => blur("contact")}
          aria-invalid={!!show("contact")}
          aria-describedby={`${f("contact")}-hint${show("contact") ? ` ${f("contact")}-error` : ""}`}
          required
        />
      </Field>

      <Field id={f("zone")} label="Comune o zona dell'immobile" error={show("zone")} valid={isValid("zone", !!values.zone)}>
        <input
          id={f("zone")}
          name="zone"
          autoComplete="address-level2"
          enterKeyHint="done"
          placeholder="Es. Milano, Navigli"
          value={values.zone}
          onChange={(e) => set("zone", e.target.value)}
          onBlur={() => blur("zone")}
          aria-invalid={!!show("zone")}
          aria-describedby={show("zone") ? `${f("zone")}-error` : undefined}
          required
        />
      </Field>

      <details className="form__more">
        <summary>
          Aggiungi qualche dettaglio <span>facoltativo</span>
          <Icon name="plus" size={18} />
        </summary>
        <div className="form__more-body">
          <div className="field">
            <span className="field__label" id={f("type-label")}>
              Tipologia
            </span>
            <div className="chips" role="radiogroup" aria-labelledby={f("type-label")}>
              {propertyTypes.map((t) => (
                <label key={t} className={`chip${values.type === t ? " is-checked" : ""}`}>
                  <input type="radio" name="type" value={t} checked={values.type === t} onChange={() => set("type", t)} />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div className="field">
            <span className="field__label" id={f("status-label")}>
              Situazione attuale
            </span>
            <div className="chips" role="radiogroup" aria-labelledby={f("status-label")}>
              {propertyStatuses.map((s) => (
                <label key={s} className={`chip${values.status === s ? " is-checked" : ""}`}>
                  <input type="radio" name="status" value={s} checked={values.status === s} onChange={() => set("status", s)} />
                  {s}
                </label>
              ))}
            </div>
          </div>
          <Field id={f("count")} label="Quanti immobili vorresti affidarci?">
            <select id={f("count")} name="count" value={values.count} onChange={(e) => set("count", e.target.value)}>
              <option value="">Preferisco non dirlo</option>
              {propertyCounts.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field id={f("message")} label="Messaggio" error={show("message")}>
            <textarea
              id={f("message")}
              name="message"
              rows={3}
              placeholder="Metratura, quando sarebbe libera, domande…"
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              onBlur={() => blur("message")}
            />
          </Field>
        </div>
      </details>

      <div className="form__hp" aria-hidden="true">
        <label htmlFor={f("website")}>Non compilare questo campo</label>
        <input id={f("website")} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            className="form__failure"
            role="alert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
          >
            <Icon name="alert" size={20} />
            <div>
              <p>
                <strong>La richiesta non è stata inviata.</strong>{" "}
                {failureText[failure] ??
                  "Si è verificato un problema di connessione. I dati che hai scritto sono ancora qui: puoi riprovare."}
              </p>
              <p>
                Puoi anche{" "}
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("whatsapp_click", `${location}-errore`)}
                >
                  scriverci su WhatsApp
                </a>{" "}
                o chiamare il{" "}
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} onClick={() => track("phone_click", `${location}-errore`)}>
                  {site.phone}
                </a>
                .
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        className="btn btn--lg btn--block form__submit"
        disabled={submitting}
        aria-disabled={submitting}
        whileTap={submitting ? undefined : { scale: 0.98 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={submitting ? "sending" : "idle"}
            className="form__submit-label"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: duration.fast }}
          >
            {submitting ? (
              <>
                <span className="spinner" aria-hidden="true" /> Invio in corso…
              </>
            ) : (
              <>
                Richiedi la valutazione <Icon name="arrow" size={18} />
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <p className="form__privacy">
        Usiamo questi dati solo per rispondere alla tua richiesta, senza iscriverti a newsletter o liste promozionali.
        {site.privacyUrl && (
          <>
            {" "}
            Dettagli nell&apos;<a href={site.privacyUrl}>informativa privacy</a>.
          </>
        )}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  valid,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  valid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`field${error ? " has-error" : ""}${valid ? " is-valid" : ""}`}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      {hint && (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      <div className="field__control">
        {children}
        <AnimatePresence>
          {valid && (
            <motion.span
              className="field__ok"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={spring.snappy}
              aria-hidden="true"
            >
              <Icon name="check" size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            className="field__error"
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
