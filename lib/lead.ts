// Validazione condivisa tra modulo (client) e API (server).
// Obbligatori solo: nome, un recapito (telefono o email) e la zona. Il resto è facoltativo.
export type LeadInput = {
  name: string;
  contact: string;
  zone: string;
  type: string;
  count: string;
  status: string;
  message: string;
  website?: string; // campo trappola anti-spam, deve restare vuoto
  requestId?: string; // identificativo dell'invio, per evitare richieste doppie
};

export type LeadErrors = Partial<Record<"name" | "contact" | "zone" | "message", string>>;

export const propertyTypes = ["Monolocale", "Bilocale", "Trilocale", "Più grande", "Villa o casa"];
export const propertyCounts = ["1", "2–3", "4 o più"];
export const propertyStatuses = ["Vuoto", "Già in affitto breve", "Affittato a lungo termine", "Altro"];

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRe = /^\+?[\d\s().-]{6,20}$/;

export function contactKind(value: string): "email" | "phone" | null {
  const v = value.trim();
  if (emailRe.test(v)) return "email";
  if (phoneRe.test(v) && v.replace(/\D/g, "").length >= 6) return "phone";
  return null;
}

export function validateLead(v: LeadInput): LeadErrors {
  const e: LeadErrors = {};
  if (v.name.trim().length < 2) e.name = "Scrivi il tuo nome.";
  const contact = v.contact.trim();
  if (!contact) e.contact = "Lasciaci un numero di telefono o un indirizzo email.";
  else if (!contactKind(contact))
    e.contact = contact.includes("@")
      ? "L'indirizzo email sembra incompleto: controlla la parte dopo la @."
      : "Il numero sembra incompleto: usa solo cifre, spazi e il prefisso.";
  if (v.zone.trim().length < 2) e.zone = "Indica il comune o il quartiere dell'immobile.";
  if (v.message.length > 2000) e.message = "Il messaggio è troppo lungo (massimo 2000 caratteri).";
  return e;
}
