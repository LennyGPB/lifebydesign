"use client";

import { motion, useMotionTemplate, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { processSection, hero } from "@/content/landing";

export function Process() {
  const titleId = `${processSection.id}-title`;
  const pathRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pathRef, offset: ["start 80%", "end 65%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 75, damping: 28, mass: 0.8 });
  const lineTransform = useMotionTemplate`scaleY(${progress})`;
  const [intro, conclusion] = processSection.title.split(", ");

  return (
    <section id={processSection.id} aria-labelledby={titleId} className="border-t border-line py-24 md:py-36">
      <div className="shell grid items-start gap-14 lg:grid-cols-[0.9fr_1.3fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--nav-height)+3rem)]">
          <Reveal>
            <h2 id={titleId} className="max-w-xl font-display text-[clamp(2.75rem,5.3vw,4.5rem)] leading-[1.04] tracking-[-0.025em]">
              <span className="block font-extralight italic">{intro},</span>
              <span className="block">{conclusion}</span>
            </h2>
            <div className="mt-9">
              <Button href={hero.primaryCta.href} animated>{processSection.ctaLabel}</Button>
            </div>
          </Reveal>
        </div>

        <div ref={pathRef} className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute top-9 bottom-9 left-5 w-px bg-white/10 sm:left-7">
            <motion.div style={{ transform: lineTransform }} className="absolute inset-0 origin-top bg-linear-to-b from-white/40 via-white to-white/60" />
          </div>
          <ol className="relative space-y-5 sm:space-y-7">
            {processSection.steps.map((step, index) => (
              <ProcessStep key={step.title} step={step} index={index} progress={progress} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ step, index, progress }: {
  step: (typeof processSection.steps)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const threshold = index / processSection.steps.length;
  const illumination = useTransform(progress, [Math.max(0, threshold - 0.06), threshold + 0.06], [0.25, 1]);

  return (
    <li className="group relative pl-14 sm:pl-20">
      <motion.div aria-hidden="true" style={{ opacity: illumination }}
        className="absolute top-6 left-0 flex size-10 items-center justify-center rounded-full border border-white/35 bg-[#19191c] shadow-[inset_0_1px_0_#ffffff25,0_4px_8px_#00000066] sm:left-2">
        <span className="font-display text-xs tracking-wider">{String(index + 1).padStart(2, "0")}</span>
      </motion.div>
      <Reveal delay={0.04 * index}>
        <article className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-6 transition-[background-color,border-color,transform] duration-700 ease-calm group-hover:translate-x-1 group-hover:border-white/25 group-hover:bg-white/[0.065] sm:px-8 sm:py-8">
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
            <span className="glass-flow" />
          </span>
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-2xl leading-tight tracking-[-0.015em] sm:text-3xl">{step.title}</h3>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
              className="mt-1 size-5 shrink-0 text-text-muted transition-[transform,color] duration-700 group-hover:translate-x-1 group-hover:text-text">
              {index === 0 ? <><rect x="5" y="3" width="14" height="18" rx="3" /><path d="M9 8h6M9 12h6M9 16h3" /></> :
                index === 1 ? <><circle cx="12" cy="12" r="9" /><path d="m16 8-2 6-6 2 2-6 6-2Z" /></> :
                index === 2 ? <path d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5A8.5 8.5 0 0 1 10.5 3H12a8 8 0 0 1 8 8.5ZM7 10h8M7 14h5" /> :
                <path d="M4 12h16m-7-7 7 7-7 7" />}
            </svg>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-text-muted sm:text-base">{step.text}</p>
          {index === processSection.steps.length - 1 ? (
            <div aria-hidden="true" className="mt-6 h-px w-16 bg-linear-to-r from-white/60 to-transparent" />
          ) : null}
        </article>
      </Reveal>
    </li>
  );
}
