"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Respecte le réglage « réduire les animations » du système.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
