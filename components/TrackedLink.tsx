"use client";

import Link from "next/link";
import { track, type ConversionEvent } from "@/lib/analytics";
import Icon from "./Icon";

// Link alle azioni di conversione: registra l'evento (senza dati personali) e poi naviga.
export default function TrackedLink({
  href,
  event,
  location,
  className,
  external = false,
  arrow = false,
  children,
}: {
  href: string;
  event: ConversionEvent;
  location: string;
  className?: string;
  external?: boolean;
  arrow?: boolean;
  children: React.ReactNode;
}) {
  const content = (
    <>
      {children}
      {arrow && <Icon name="arrow" size={18} className="btn__icon" />}
      {external && <span className="sr-only"> (si apre in una nuova scheda)</span>}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={() => track(event, location)}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={() => track(event, location)}>
      {content}
    </Link>
  );
}
