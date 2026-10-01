import Image from "next/image";
import Logo from "@/components/Logo";
import ContactForm from "@/components/ContactForm";
import { caseStudies, properties, services, site, steps } from "@/lib/site";

export default function Home() {
  return (
    <>
      <header className="nav">
        <a href="#top" aria-label="Solace, torna all'inizio">
          <Logo small />
        </a>
        <nav className="nav__links">
          <a href="#servizi">Servizi</a>
          <a href="#processo">Come funziona</a>
          <a href="#casi-studio">Casi studio</a>
          <a href="#immobili">Immobili</a>
        </nav>
        <a className="btn btn--small" href="#contatti">
          Valutazione gratuita
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <Image
            src="/images/villa-soggiorno.jpg"
            alt="Soggiorno di una villa vista mare gestita da Solace"
            fill
            priority
            sizes="100vw"
            className="hero__bg"
          />
          <div className="hero__content">
            <p className="eyebrow">Gestione premium di affitti brevi</p>
            <h1>
              Valorizziamo il tuo immobile.
              <br />
              <em>Massimizziamo i tuoi guadagni.</em>
            </h1>
            <p className="hero__lead">
              Ci occupiamo di tutto: prezzi, ospiti, pulizie, burocrazia. Tu ricevi report
              chiari e pagamenti puntuali.
            </p>
            <div className="hero__actions">
              <a className="btn" href="#contatti">
                Richiedi una valutazione gratuita
              </a>
              <a className="btn btn--ghost" href="#casi-studio">
                Guarda i risultati
              </a>
            </div>
          </div>
        </section>

        <section className="stats" aria-label="Risultati medi">
          <div>
            <strong>+30%</strong>
            <span>reddito medio rispetto alla locazione tradizionale</span>
          </div>
          <div>
            <strong>85%+</strong>
            <span>tasso di occupazione medio</span>
          </div>
          <div>
            <strong>4,9/5</strong>
            <span>valutazione media degli ospiti</span>
          </div>
        </section>

        <section id="servizi" className="section">
          <p className="eyebrow">I nostri servizi</p>
          <h2>Una gestione completa, curata in ogni dettaglio</h2>
          <div className="services">
            {services.map((s, i) => (
              <article key={s.title} className="service">
                <span className="service__num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="processo" className="section section--alt">
          <p className="eyebrow">Come funziona</p>
          <h2>Dal sopralluogo al primo ospite in cinque passi</h2>
          <ol className="steps">
            {steps.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="casi-studio" className="section">
          <p className="eyebrow">Casi studio</p>
          <h2>Risultati reali, valore concreto</h2>
          <p className="section__intro">
            Risultati medi dopo i primi 12 mesi di gestione completa Solace.
          </p>
          <div className="cases">
            {caseStudies.map((c) => (
              <article key={c.title} className="case">
                <div className="case__body">
                  <p className="case__place">{c.place}</p>
                  <h3>{c.title}</h3>
                  <p className="case__detail">{c.detail}</p>
                  <p className="case__growth">
                    {c.growth} <span>reddito annuo</span>
                  </p>
                  <table>
                    <thead>
                      <tr>
                        <th />
                        <th>Prima</th>
                        <th>Con Solace</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Occupazione</td>
                        <td>{c.before.occupancy}</td>
                        <td>{c.after.occupancy}</td>
                      </tr>
                      <tr>
                        <td>Tariffa/notte</td>
                        <td>{c.before.rate}</td>
                        <td>{c.after.rate}</td>
                      </tr>
                      <tr>
                        <td>Reddito annuo</td>
                        <td>{c.before.revenue}</td>
                        <td>{c.after.revenue}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="immobili" className="section section--alt">
          <p className="eyebrow">Immobili in gestione</p>
          <h2>Ogni soggiorno, un&apos;esperienza</h2>
          <div className="gallery">
            {properties.map((p) => (
              <figure key={p.src}>
                <Image src={p.src} alt={`${p.title}, ${p.place}`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw" />
                <figcaption>
                  <strong>{p.title}</strong>
                  <span>{p.place}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="contatti" className="section contact">
          <div className="contact__text">
            <p className="eyebrow">Contattaci oggi</p>
            <h2>Il tuo immobile, il nostro impegno</h2>
            <p>
              Richiedi una valutazione gratuita e senza impegno: ti diciamo quanto può rendere
              il tuo immobile con Solace.
            </p>
            <ul className="contact__list">
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            </ul>
          </div>
          <ContactForm />
        </section>
      </main>

      <footer className="footer">
        <Logo small />
        <p>{site.cities.join(" · ")}</p>
        <p>
          © {new Date().getFullYear()} {site.name} {site.tagline}
        </p>
      </footer>
    </>
  );
}
