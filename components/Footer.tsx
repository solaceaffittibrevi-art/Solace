import Link from "next/link";
import Logo from "./Logo";
import Icon from "./Icon";
import GlassIcon from "./GlassIcon";
import Skyline from "./Skyline";
import TrackedLink from "./TrackedLink";
import CookiePreferencesButton from "./CookiePreferencesButton";
import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <Skyline className="footer__skyline" />
      <div className="footer__grid container">
        <div className="footer__brand">
          <Logo />
          <p>Gestione di affitti brevi a Milano per proprietari che vogliono una casa curata e risultati chiari.</p>
        </div>

        <nav aria-label="Sezioni del sito" className="footer__col">
          <h2 className="footer__title">Il sito</h2>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/valutazione-gratuita">Valutazione gratuita</Link>
            </li>
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__title">Contatti</h2>
          <ul>
            <li>
              <TrackedLink href={site.calendly} event="calendly_click" location="footer" external>
                Prenota una chiamata
              </TrackedLink>
            </li>
            {site.email && (
              <li>
                <TrackedLink href={`mailto:${site.email}`} event="email_click" location="footer">
                  {site.email}
                </TrackedLink>
              </li>
            )}
            {site.phone && (
              <li>
                <TrackedLink href={`tel:${site.phone.replace(/\s/g, "")}`} event="phone_click" location="footer">
                  {site.phone}
                </TrackedLink>
              </li>
            )}
            {site.whatsapp && (
              <li>
                <TrackedLink href={`https://wa.me/${site.whatsapp}`} event="whatsapp_click" location="footer" external>
                  Scrivici su WhatsApp
                </TrackedLink>
              </li>
            )}
          </ul>
          <div className="footer__social">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Solace su Instagram (nuova scheda)">
              <GlassIcon name="instagram" size="md" />
            </a>
            <a href={site.airbnbProfile} target="_blank" rel="noopener noreferrer" className="footer__airbnb">
              Profilo Airbnb <Icon name="external" size={16} />
              <span className="sr-only">(si apre in una nuova scheda)</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer__legal container">
        <p className="footer__business">
          {site.business} — P. IVA {site.vat} — {site.address.street}, {site.address.postalCode} {site.address.city} (
          {site.address.province})
        </p>
        <p>© {new Date().getFullYear()} Solace Real Estate Short Rent</p>
        <ul className="footer__policies">
          <li>
            <Link href={site.privacyUrl}>Privacy policy</Link>
          </li>
          <li>
            <Link href={site.cookieUrl}>Cookie policy</Link>
          </li>
          <li>
            <CookiePreferencesButton className="footer__prefs" />
          </li>
        </ul>
      </div>
    </footer>
  );
}
