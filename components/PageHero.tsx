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
  children,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  // Inquadratura: object-position su desktop e (facoltativa) su mobile.
  imagePosition?: { desktop: string; mobile?: string };
  children?: React.ReactNode;
}) {
  return (
    <section className={`page-hero${image ? " page-hero--image" : ""}`}>
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
              imagePosition
                ? ({ "--pos": imagePosition.desktop, "--pos-m": imagePosition.mobile ?? imagePosition.desktop } as React.CSSProperties)
                : undefined
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
