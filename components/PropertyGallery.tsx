"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "./Icon";
import { duration, ease } from "@/lib/motion";

type Photo = { src: string; alt: string };

// Galleria dell'immobile: griglia editoriale + visualizzatore a schermo intero su <dialog>
// (focus gestito dal browser, Esc per chiudere), frecce da tastiera e dissolvenza tra le foto.
export default function PropertyGallery({ photos, name }: { photos: Photo[]; name: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);

  const openAt = (i: number) => {
    setDirection(1);
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const go = useCallback(
    (step: number) => {
      setDirection(step);
      setIndex((i) => (i === null ? i : (i + step + photos.length) % photos.length));
    },
    [photos.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  return (
    <>
      <ul className="gallery">
        {photos.map((photo, i) => (
          <li key={photo.src} className={`gallery__item gallery__item--${i}`}>
            <button type="button" onClick={() => openAt(i)} className="gallery__button">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={i === 0 ? "(max-width: 900px) 100vw, 66vw" : "(max-width: 900px) 50vw, 33vw"}
                priority={i === 0}
              />
              <span className="gallery__zoom glass-icon glass-icon--md" aria-hidden="true">
                <Icon name="expand" size={18} />
              </span>
              <span className="sr-only">Apri la foto {i + 1} di {photos.length} a schermo intero</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog ref={dialogRef} className="lightbox" aria-label={`Foto di ${name}`} onClose={close} onCancel={close}>
        {index !== null && (
          <div className="lightbox__inner">
            <button type="button" className="lightbox__close glass-icon glass-icon--lg glass-icon--interactive" onClick={close} autoFocus>
              <Icon name="close" size={26} />
              <span className="sr-only">Chiudi la galleria</span>
            </button>
            <div className="lightbox__stage">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={index}
                  className="lightbox__frame"
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: duration.base, ease: ease.out }}
                >
                  <Image src={photos[index].src} alt={photos[index].alt} fill sizes="100vw" className="lightbox__img" />
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="lightbox__caption" aria-live="polite">
              <span>
                {index + 1} / {photos.length}
              </span>
              {photos[index].alt}
            </p>
            <button type="button" className="lightbox__btn lightbox__btn--prev glass-icon glass-icon--lg glass-icon--interactive" onClick={() => go(-1)}>
              <Icon name="chevronLeft" size={28} />
              <span className="sr-only">Foto precedente</span>
            </button>
            <button type="button" className="lightbox__btn lightbox__btn--next glass-icon glass-icon--lg glass-icon--interactive" onClick={() => go(1)}>
              <Icon name="chevronRight" size={28} />
              <span className="sr-only">Foto successiva</span>
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
