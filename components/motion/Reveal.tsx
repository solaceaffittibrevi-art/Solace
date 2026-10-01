"use client";

import { motion, type Variants } from "motion/react";
import { container, fadeUp, viewport } from "@/lib/motion";

type Tag = "div" | "section" | "ul" | "ol" | "li" | "p" | "h1" | "h2" | "h3" | "header" | "figure" | "article" | "blockquote" | "dl";

// Comparsa allo scroll. La classe "reveal" serve al fallback senza JavaScript (vedi layout):
// i contenuti restano leggibili anche se le animazioni non partono.
export function Reveal({
  as = "div",
  children,
  className,
  variants = fadeUp,
  delay = 0,
  amount,
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  amount?: number;
}) {
  const Component = motion[as];
  return (
    <Component
      className={["reveal", className].filter(Boolean).join(" ")}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ ...viewport, ...(amount !== undefined && { amount }) }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Component>
  );
}

// Gruppo che fa comparire in sequenza i figli <RevealItem>.
export function Stagger({
  as = "div",
  children,
  className,
  gap,
  delay,
  amount,
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  amount?: number;
}) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={container(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ ...viewport, ...(amount !== undefined && { amount }) }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  as = "div",
  children,
  className,
  variants = fadeUp,
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}) {
  const Component = motion[as];
  return (
    <Component className={["reveal", className].filter(Boolean).join(" ")} variants={variants}>
      {children}
    </Component>
  );
}
