import Link from "next/link";
import Logo from "./Logo";
import Icon from "./Icon";
import GlassIcon from "./GlassIcon";
import Skyline from "./Skyline";
import TrackedLink from "./TrackedLink";
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
              <Link href="/analisi-gratuita">Analisi gratuita</Link>
            </li>
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__title">Contatti</h2>
          <ul>
            <li>
              <a href={site.calendly} target="_blank" rel="noopener noreferrer">
                Prenota una chiamata <span className="sr-only">(si apre in una nuova scheda)</span>
              </a>
            </li>
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            )}
            {site.phone && (
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
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
        <p>
          © {new Date().getFullYear()} {site.legalName}
        </p>
        {site.privacyUrl && <a href={site.privacyUrl}>Privacy e cookie</a>}
      </div>
    </footer>
  );
}
