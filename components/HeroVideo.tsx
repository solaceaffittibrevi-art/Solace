"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "motion/react";
import Icon from "./Icon";

// Video di sfondo della home. La foto del Duomo resta il poster: è l'immagine che si vede durante il
// caricamento, quando la riproduzione automatica non è consentita (es. risparmio energetico su iPhone),
// con "Riduci movimento" attivo o con il risparmio dati. Il video parte solo dopo il caricamento della
// pagina, è senza traccia audio e sempre muto, e si ferma quando la testata esce dallo schermo.
const POSTER = "/images/milano-duomo.webp";
// Loop di 23 s (piazza del Duomo dal giorno alla notte) ricavato dal filmato originale in media/video-originale.
const SOURCES = { desktop: "/video/milano-duomo-loop-1280.mp4", mobile: "/video/milano-duomo-loop-960.mp4" };

type Conn = { saveData?: boolean; effectiveType?: string };

// `controls`: contenitore sopra la velatura in cui mostrare il comando pausa/riprendi.
export default function HeroVideo({ controls }: { controls: HTMLElement | null }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false); // pausa scelta dal visitatore
  const userPaused = useRef(false);

  // Sceglie il file dopo il caricamento: non compete con testi e immagini della pagina.
  useEffect(() => {
    if (reduced) return;
    const conn = (navigator as Navigator & { connection?: Conn }).connection;
    if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return;
    const pick = () => setSrc(window.matchMedia("(max-width: 900px)").matches ? SOURCES.mobile : SOURCES.desktop);
    if (document.readyState === "complete") pick();
    else {
      window.addEventListener("load", pick, { once: true });
      return () => window.removeEventListener("load", pick);
    }
  }, [reduced]);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return;
    video.muted = true;
    video.defaultMuted = true;
    video.play().catch(() => setPlaying(false)); // riproduzione automatica non consentita: resta il poster

    // Fuori dallo schermo il video si ferma; riparte al ritorno, se il visitatore non l'ha messo in pausa.
    const io = new IntersectionObserver(([entry]) => {
      if (userPaused.current) return;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      setPaused(false);
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      setPaused(true);
      video.pause();
    }
  };

  const showVideo = !reduced && src;

  return (
    <>
      <Image
        src={POSTER}
        alt="Piazza del Duomo a Milano di sera, con il Duomo illuminato e la Galleria Vittorio Emanuele II"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
      />
      {showVideo && (
        <video
          ref={ref}
          className={`hero__video${playing ? " is-playing" : ""}`}
          src={src}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          onError={() => setPlaying(false)}
        />
      )}
      {showVideo &&
        playing &&
        controls &&
        createPortal(
        <button
          type="button"
          className="hero__video-toggle"
          onClick={toggle}
          aria-label={paused ? "Riprendi il video di sfondo" : "Metti in pausa il video di sfondo"}
        >
          <Icon name={paused ? "play" : "pause"} size={18} />
        </button>,
          controls,
        )}
    </>
  );
}
