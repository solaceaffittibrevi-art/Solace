"use client";

import { MotionConfig } from "motion/react";
import ConsentBanner from "./ConsentBanner";
import Analytics from "./Analytics";

// reducedMotion="user": con "riduci movimento" attivo, Motion elimina gli spostamenti
// e mantiene solo le dissolvenze. Parallasse e contatori gestiscono il caso da soli.
// Banner dei cookie e Analytics: niente di facoltativo viene caricato prima del consenso.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <ConsentBanner analyticsEnabled={Boolean(process.env.NEXT_PUBLIC_GA4_ID)} />
      <Analytics />
    </MotionConfig>
  );
}
