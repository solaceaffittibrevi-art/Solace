import Image from "next/image";
import { Reveal } from "./motion/Reveal";
import Parallax from "./motion/Parallax";

// Testata delle pagine interne. Titolo e testo entrano con l'animazione CSS .enter
// (nessuna attesa di JavaScript); l'immagine laterale compare allo scroll.
export default function PageHero({
  title,
  lead,
  image,
  imageAlt = "",
  imagePosition,
  imageRatio,
  background,
  children,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  // Inquadratura: object-position su desktop e (facoltativa) su mobile.
  imagePosition?: { desktop: string; mobile?: string };
  // Proporzioni reali della foto (es. "3 / 2"): il riquadro non la ritaglia. Predefinito 4 / 5.
  imageRatio?: string;
  // Foto di sfondo a tutta larghezza, oscurata per mantenere leggibili i testi.
  // "contain": l'immagine resta intera (es. il monogramma), sfumata ai bordi nel colore della pagina.
  background?: { src: string; alt: string; position?: string; fit?: "cover" | "contain" };
  children?: React.ReactNode;
}) {
  return (
    <section className={`page-hero${image ? " page-hero--image" : ""}${background ? " page-hero--bg" : ""}`}>
      {background && (
        <div className={`page-hero__bg${background.fit === "contain" ? " page-hero__bg--contain" : ""}`}>
          <Image
            src={background.src}
            alt={background.alt}
            fill
            priority
            sizes="100vw"
            style={{ objectPosition: background.position ?? "50% 50%" }}
          />
        </div>
      )}
      {background && <div className="page-hero__bg-shade" aria-hidden="true" />}
      <div className="container page-hero__inner">
        <div className="page-hero__text">
          <h1 className="page-hero__title enter" style={{ "--i": 0 } as React.CSSProperties}>
            {title}
          </h1>
          {lead && (
            <p className="lead enter" style={{ "--i": 1 } as React.CSSProperties}>
              {lead}
            </p>
          )}
          {children && (
            <div className="enter" style={{ "--i": 2 } as React.CSSProperties}>
              {children}
            </div>
          )}
        </div>
        {image && (
          <Reveal
            className="page-hero__media"
            delay={0.15}
            style={
              {
                ...(imagePosition && { "--pos": imagePosition.desktop, "--pos-m": imagePosition.mobile ?? imagePosition.desktop }),
                ...(imageRatio && { "--ratio": imageRatio }),
              } as React.CSSProperties
            }
          >
            <Parallax strength={6}>
              <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 900px) 100vw, 45vw" />
            </Parallax>
          </Reveal>
        )}
      </div>
    </section>
  );
}
