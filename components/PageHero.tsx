import Image from "next/image";
import { Reveal, RevealItem, Stagger } from "./motion/Reveal";
import Parallax from "./motion/Parallax";

export default function PageHero({
  eyebrow,
  title,
  lead,
  image,
  imageAlt = "",
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={`page-hero${image ? " page-hero--image" : ""}`}>
      <div className="container page-hero__inner">
        <Stagger className="page-hero__text" gap={0.1}>
          <RevealItem as="p" className="eyebrow">
            {eyebrow}
          </RevealItem>
          <RevealItem as="h1" className="page-hero__title">
            {title}
          </RevealItem>
          {lead && (
            <RevealItem as="p" className="lead">
              {lead}
            </RevealItem>
          )}
          {children && <RevealItem>{children}</RevealItem>}
        </Stagger>
        {image && (
          <Reveal className="page-hero__media" delay={0.15}>
            <Parallax strength={6}>
              <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 900px) 100vw, 45vw" />
            </Parallax>
          </Reveal>
        )}
      </div>
    </section>
  );
}
