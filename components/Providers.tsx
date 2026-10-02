"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { captureSource } from "@/lib/source";

// reducedMotion="user": con "riduci movimento" attivo, Motion elimina gli spostamenti
// e mantiene solo le dissolvenze. Parallasse e contatori gestiscono il caso da soli.
export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    captureSource();
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
