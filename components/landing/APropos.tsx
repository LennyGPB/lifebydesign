"use client";

import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SceneImage } from "@/components/ui/SceneImage";
import { apropos } from "@/content/landing";

export function APropos() {
  const titleId = `${apropos.id}-title`;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 65, damping: 26, mass: 0.8 });
  const rotateX = useTransform(progress, [0, 1], [10, -8]);
  const rotateY = useTransform(progress, [0, 1], [-16, 14]);
  const rotateZ = useTransform(progress, [0, 1], [-5, 5]);
  const y = useTransform(progress, [0, 1], [24, -24]);
  const transform = useMotionTemplate`translate3d(0, ${y}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;

  return (
    <section
      ref={sectionRef}
      id={apropos.id}
      aria-labelledby={titleId}
      className="border-t border-line py-24 md:py-36"
    >
      <div className="shell grid items-center gap-12 md:grid-cols-[5fr_7fr] md:gap-16 lg:gap-24">
        <div className="mx-auto w-full max-w-md px-4 py-8 [perspective:1100px] md:mx-0">
          <motion.div style={{ transform }} className="relative isolate aspect-[4/5] overflow-hidden rounded-2xl border border-white/20 bg-bg-elevated shadow-[inset_0_1px_0_#ffffff30,4px_7px_3px_#111113,12px_30px_45px_-12px_#000000cc]">
          <SceneImage
            src={apropos.image.src}
            alt={apropos.image.alt}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="opacity-80"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-bg/80 via-bg/10 to-transparent"
          />
          </motion.div>
        </div>

        <div>
          <Reveal>
            <h2 id={titleId} className="font-display text-[clamp(2.125rem,4.8vw,3.75rem)] leading-[1.04] font-normal tracking-[-0.015em] text-balance">
              {apropos.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 space-y-5">
            {apropos.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-xl text-base leading-relaxed text-text-muted md:text-lg md:leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
