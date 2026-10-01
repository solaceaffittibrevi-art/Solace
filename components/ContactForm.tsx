"use client";

import { useState } from "react";
import { site } from "@/lib/site";

// Nessun backend per ora: il modulo apre il programma di posta con la richiesta già compilata.
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = [
      `Nome: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Telefono: ${data.get("phone")}`,
      `Città dell'immobile: ${data.get("city")}`,
      `Tipologia: ${data.get("type")}`,
      "",
      String(data.get("message") ?? ""),
    ].join("\n");
    const subject = "Richiesta valutazione immobile";
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__row">
        <label>
          Nome e cognome
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <div className="form__row">
        <label>
          Telefono
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label>
          Città dell&apos;immobile
          <input name="city" required />
        </label>
      </div>
      <label>
        Tipologia
        <select name="type" defaultValue="Appartamento">
          <option>Monolocale</option>
          <option>Appartamento</option>
          <option>Villa</option>
          <option>Altro</option>
        </select>
      </label>
      <label>
        Messaggio
        <textarea name="message" rows={4} placeholder="Raccontaci del tuo immobile" />
      </label>
      <button className="btn" type="submit">
        Richiedi la valutazione gratuita
      </button>
      {sent && (
        <p className="form__note">
          Si è aperto il tuo programma di posta: invia l&apos;email per completare la richiesta.
        </p>
      )}
    </form>
  );
}
