"use client";

import { MotionConfig } from "motion/react";

// reducedMotion="user": con "riduci movimento" attivo, Motion elimina gli spostamenti
// e mantiene solo le dissolvenze. Parallasse e contatori gestiscono il caso da soli.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
