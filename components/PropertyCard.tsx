import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import type { Property } from "@/lib/immobili";

export default function PropertyCard({ property, size = "default", priority = false }: { property: Property; size?: "default" | "large"; priority?: boolean }) {
  return (
    <article className={`pcard pcard--${size}`}>
      <Link href={`/immobili/${property.slug}`} className="pcard__link">
        <div className="pcard__media">
          <Image
            src={property.photos[0].src}
            alt={property.photos[0].alt}
            fill
            priority={priority}
            sizes={size === "large" ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"}
          />
        </div>
        <div className="pcard__body">
          <p className="pcard__zone">
            <Icon name="pin" size={15} />
            <span>
              {property.zone}
              {property.city !== "Milano" && `, ${property.city}`}
            </span>
          </p>
          <h3 className="pcard__name">{property.name}</h3>
          <p className="pcard__meta">
            {property.type} · fino a {property.guests} ospiti
          </p>
          <span className="pcard__more" aria-hidden="true">
            Scopri <Icon name="arrow" size={16} />
          </span>
        </div>
      </Link>
      <a href={property.airbnb} target="_blank" rel="noopener noreferrer" className="pcard__airbnb">
        Visualizza su Airbnb <Icon name="external" size={14} />
        <span className="sr-only">: {property.name} (si apre in una nuova scheda)</span>
      </a>
    </article>
  );
}
