"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "./Icon";
import TrackedLink from "./TrackedLink";
import { propertyCounts, propertyStatuses, propertyTypes, validateLead, type LeadErrors, type LeadInput } from "@/lib/lead";
import { site } from "@/lib/site";
import { duration, ease, spring } from "@/lib/motion";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

const empty: LeadInput = {
  name: "",
  email: "",
  phone: "",
  zone: "",
  type: "",
  count: "",
  status: "",
  message: "",
  consent: false,
  website: "",
};

const errorLabels: Record<string, string> = {
  name: "Nome",
  contact: "Contatto",
  email: "Email",
  phone: "Telefono",
  zone: "Zona",
  type: "Tipologia",
  consent: "Consenso",
  message: "Messaggio",
};

const fieldFor = (key: string) => (key === "contact" ? "lead-email" : `lead-${key}`);

export default function LeadForm() {
  const [values, setValues] = useState<LeadInput>(empty);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<string>("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const errors = validateLead(values);
  const show = (key: keyof LeadErrors) => (submitted || touched[key] ? errors[key] : undefined);
  const contactError = submitted || (touched.email && touched.phone) ? errors.contact : undefined;
  const visibleErrors = submitted ? Object.entries(errors) : [];

  const set = <K extends keyof LeadInput>(key: K, value: LeadInput[K]) => setValues((v) => ({ ...v, [key]: value }));
  const blur = (key: string) => setTouched((t) => ({ ...t, [key]: true }));
  const isValid = (key: keyof LeadErrors, filled: boolean) => filled && !errors[key] && (touched[key] || submitted);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus("submitting");
    setFailure("");
    try {
      const res = await fetch("/api/richiesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? `http_${res.status}`);
      setStatus("success");
      track("lead_submit_success", "analisi-gratuita");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (err) {
      setStatus("error");
      setFailure(err instanceof Error ? err.message : "unknown");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        ref={successRef}
        tabIndex={-1}
        className="form-success"
        role="status"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: ease.out }}
      >
        <motion.span className="form-success__icon" initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={spring.soft}>
          <Icon name="check" size={30} />
        </motion.span>
        <h2>Richiesta ricevuta, grazie {values.name.split(" ")[0]}.</h2>
        <p>
          Abbiamo i dati del tuo immobile. Ti ricontattiamo per approfondire e preparare l&apos;analisi. Se preferisci
          fissare subito un orario, puoi prenotare una chiamata.
        </p>
        <TrackedLink href={site.calendly} event="calendly_click" location="form-success" className="btn btn--ghost" external>
          Prenota una chiamata
        </TrackedLink>
      </motion.div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-describedby="form-intro">
      <p id="form-intro" className="form__intro">
        I campi con <span aria-hidden="true">*</span>
        <span className="sr-only">asterisco</span> sono obbligatori. Bastano un minuto e un contatto.
      </p>

      <AnimatePresence>
        {visibleErrors.length > 0 && (
          <motion.div
            ref={summaryRef}
            tabIndex={-1}
            className="form__summary"
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: duration.fast * 1.5, ease: ease.out }}
          >
            <p>
              <Icon name="alert" size={18} /> Controlla {visibleErrors.length === 1 ? "questo campo" : "questi campi"}:
            </p>
            <ul>
              {visibleErrors.map(([key, msg]) => (
                <li key={key}>
                  <a href={`#${fieldFor(key)}`}>
                    {errorLabels[key]}: {msg}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <fieldset className="form__group">
        <legend>Chi sei</legend>
        <Field id="lead-name" label="Nome e cognome" required error={show("name")} valid={isValid("name", !!values.name)}>
          <input
            id="lead-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={!!show("name")}
            aria-describedby={show("name") ? "lead-name-error" : undefined}
            required
          />
        </Field>
        <p className="form__hint" id="lead-contact-hint">
          Lasciaci almeno un recapito: email o telefono.
        </p>
        <div className="form__row">
          <Field id="lead-email" label="Email" error={show("email") ?? contactError} valid={isValid("email", !!values.email)}>
            <input
              id="lead-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              onBlur={() => blur("email")}
              aria-invalid={!!(show("email") ?? contactError)}
              aria-describedby={`lead-contact-hint${show("email") ?? contactError ? " lead-email-error" : ""}`}
            />
          </Field>
          <Field id="lead-phone" label="Telefono" error={show("phone")} valid={isValid("phone", !!values.phone)}>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              onBlur={() => blur("phone")}
              aria-invalid={!!show("phone")}
              aria-describedby={`lead-contact-hint${show("phone") ? " lead-phone-error" : ""}`}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="form__group">
        <legend>Il tuo immobile</legend>
        <div className="form__row">
          <Field id="lead-zone" label="Zona o quartiere" required error={show("zone")} valid={isValid("zone", !!values.zone)}>
            <input
              id="lead-zone"
              name="zone"
              placeholder="Es. Porta Romana, Navigli"
              value={values.zone}
              onChange={(e) => set("zone", e.target.value)}
              onBlur={() => blur("zone")}
              aria-invalid={!!show("zone")}
              aria-describedby={show("zone") ? "lead-zone-error" : undefined}
              required
            />
          </Field>
          <Field id="lead-type" label="Tipologia" required error={show("type")} valid={isValid("type", !!values.type)}>
            <select
              id="lead-type"
              name="type"
              value={values.type}
              onChange={(e) => {
                set("type", e.target.value);
                blur("type");
              }}
              onBlur={() => blur("type")}
              aria-invalid={!!show("type")}
              aria-describedby={show("type") ? "lead-type-error" : undefined}
              required
            >
              <option value="" disabled>
                Seleziona
              </option>
              {propertyTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="form__row">
          <Field id="lead-count" label="Quanti immobili?" optional>
            <select id="lead-count" name="count" value={values.count} onChange={(e) => set("count", e.target.value)}>
              <option value="">Preferisco non dirlo</option>
              {propertyCounts.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <div className="field">
            <span className="field__label" id="lead-status-label">
              Stato attuale <span className="field__opt">facoltativo</span>
            </span>
            <div className="chips" role="radiogroup" aria-labelledby="lead-status-label">
              {propertyStatuses.map((s) => (
                <label key={s} className={`chip${values.status === s ? " is-checked" : ""}`}>
                  <input type="radio" name="status" value={s} checked={values.status === s} onChange={() => set("status", s)} />
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>

        <Field id="lead-message" label="Vuoi aggiungere qualcosa?" optional error={show("message")}>
          <textarea
            id="lead-message"
            name="message"
            rows={4}
            placeholder="Metratura, disponibilità per un sopralluogo, domande..."
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            onBlur={() => blur("message")}
          />
        </Field>
      </fieldset>

      <div className="form__hp" aria-hidden="true">
        <label htmlFor="lead-website">Non compilare questo campo</label>
        <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div className={`consent${show("consent") ? " has-error" : ""}`}>
        <label htmlFor="lead-consent">
          <input
            id="lead-consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => {
              set("consent", e.target.checked);
              blur("consent");
            }}
            aria-invalid={!!show("consent")}
            aria-describedby={show("consent") ? "lead-consent-error" : undefined}
          />
          <span>
            Acconsento a essere ricontattato da Solace per questa richiesta.
            {site.privacyUrl ? (
              <>
                {" "}
                Ho letto l&apos;<a href={site.privacyUrl}>informativa privacy</a>.
              </>
            ) : null}{" "}
            <span aria-hidden="true">*</span>
          </span>
        </label>
        {show("consent") && (
          <p className="field__error" id="lead-consent-error">
            {show("consent")}
          </p>
        )}
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            className="form__failure"
            role="alert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast * 1.5 }}
          >
            <Icon name="alert" size={20} />
            <div>
              <p>
                <strong>La richiesta non è stata inviata.</strong>{" "}
                {failure === "not_configured"
                  ? "Il modulo non è ancora collegato al nostro sistema di ricezione."
                  : "Si è verificato un problema di connessione. I dati che hai scritto sono ancora qui: puoi riprovare."}
              </p>
              <p>
                Nel frattempo puoi{" "}
                <a href={site.calendly} target="_blank" rel="noopener noreferrer" onClick={() => track("calendly_click", "form-error")}>
                  prenotare una chiamata conoscitiva
                </a>
                {site.email && (
                  <>
                    {" "}
                    o scriverci a <a href={`mailto:${site.email}`}>{site.email}</a>
                  </>
                )}
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
                Richiedi l&apos;analisi gratuita <Icon name="arrow" size={18} />
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
      <p className="form__after">Nessun impegno. Ti ricontattiamo per approfondire e, se ha senso, fissare una chiamata o un sopralluogo.</p>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  optional,
  error,
  valid,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  valid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`field${error ? " has-error" : ""}${valid ? " is-valid" : ""}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {optional && <span className="field__opt">facoltativo</span>}
      </label>
      <div className="field__control">
        {children}
        <AnimatePresence>
          {valid && (
            <motion.span
              className="field__ok"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
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
