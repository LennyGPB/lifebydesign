"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "default" | "card";
};

export function Reveal({ children, delay = 0, className = "", variant = "default" }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const card = variant === "card";

  return (
    <motion.div
      className={className}
      initial={card
        ? { opacity: 0, y: reducedMotion ? 0 : 72, scale: reducedMotion ? 1 : 0.88, filter: reducedMotion ? "blur(0px)" : "blur(8px)" }
        : reducedMotion ? false
        : { opacity: 0, y: 24 }}
      whileInView={card
        ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
        : { opacity: 1, y: 0 }}
      viewport={{ once: !card, amount: card ? 0.3 : "some", margin: card ? "0px 0px -48px 0px" : "0px 0px -10% 0px" }}
      transition={{ duration: reducedMotion ? card ? 0.65 : 0 : card ? 1 : 0.9, delay: reducedMotion && !card ? 0 : delay, ease: card ? [0.16, 0.7, 0.3, 1] : [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
