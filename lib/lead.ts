// Validazione condivisa tra modulo (client) e API (server).
export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  zone: string;
  type: string;
  count: string;
  status: string;
  message: string;
  consent: boolean;
  website?: string; // campo trappola anti-spam, deve restare vuoto
};

export type LeadErrors = Partial<Record<keyof LeadInput | "contact", string>>;

export const propertyTypes = ["Monolocale", "Bilocale", "Trilocale", "Quadrilocale o più grande", "Villa o casa indipendente", "Altro"];
export const propertyCounts = ["1", "2–3", "4 o più"];
export const propertyStatuses = ["Vuoto", "Già in affitto breve", "Affittato a lungo termine", "Altro"];

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRe = /^[+()\d\s.-]{6,20}$/;

export function validateLead(v: LeadInput): LeadErrors {
  const e: LeadErrors = {};
  if (v.name.trim().length < 2) e.name = "Scrivi il tuo nome.";
  const email = v.email.trim();
  const phone = v.phone.trim();
  if (!email && !phone) e.contact = "Indica almeno un contatto: email o telefono.";
  if (email && !emailRe.test(email)) e.email = "Controlla l'indirizzo email: sembra incompleto.";
  if (phone && !phoneRe.test(phone)) e.phone = "Controlla il numero: usa solo cifre, spazi e il prefisso.";
  if (v.zone.trim().length < 2) e.zone = "Indica la zona o il quartiere dell'immobile.";
  if (!propertyTypes.includes(v.type)) e.type = "Scegli la tipologia.";
  if (!v.consent) e.consent = "Serve il tuo consenso per poterti ricontattare.";
  if (v.message.length > 2000) e.message = "Il messaggio è troppo lungo (massimo 2000 caratteri).";
  return e;
}
