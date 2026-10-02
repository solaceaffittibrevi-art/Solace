import { RevealItem, Reveal, Stagger } from "./motion/Reveal";
import Icon from "./Icon";
import { site, testimonials } from "@/lib/site";

export default function Testimonials() {
  return (
    <section className="section section--paper testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <Reveal className="section-head">
          <h2 id="testimonials-title" className="h2">
            Cosa scrivono gli ospiti, <em>dopo il soggiorno.</em>
          </h2>
          <p className="section-head__text">
            Alcune recensioni lasciate su Airbnb dagli ospiti delle case che gestiamo. Sono loro a dirci se il lavoro è
            fatto bene.
          </p>
        </Reveal>

        <Stagger as="ul" className="testimonials__list" gap={0.12}>
          {testimonials.map((t, i) => (
            <RevealItem as="li" key={t.author} className={`quote quote--${i % 2 ? "b" : "a"}`}>
              <figure>
                <div className="quote__stars" role="img" aria-label="5 stelle su 5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Icon key={s} name="star" size={14} />
                  ))}
                </div>
                <blockquote>
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption>
                  <strong>{t.author}</strong>
                  <span>
                    {[t.origin, "ospite Airbnb"].filter(Boolean).join(" · ")}
                  </span>
                  <span className="quote__lang">Tradotta da Airbnb {t.language}</span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </Stagger>

        <Reveal className="testimonials__more">
          <a href={site.airbnbProfile} target="_blank" rel="noopener noreferrer" className="link-arrow">
            Leggi tutte le recensioni sul profilo Airbnb
            <Icon name="external" size={16} />
            <span className="sr-only">(si apre in una nuova scheda)</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
