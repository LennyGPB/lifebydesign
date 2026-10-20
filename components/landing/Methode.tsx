"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SceneImage } from "@/components/ui/SceneImage";
import { methode } from "@/content/landing";

const scenePoses = [
  "[transform:translateY(4px)_rotateX(8deg)_rotateY(-16deg)_rotateZ(-5deg)_scale(0.94)]",
  "[transform:translateY(-6px)_rotateX(-7deg)_rotateY(14deg)_rotateZ(4deg)_scale(0.94)]",
  "[transform:translateY(6px)_rotateX(10deg)_rotateY(-12deg)_rotateZ(-4deg)_scale(0.94)]",
  "[transform:translateY(-4px)_rotateX(-6deg)_rotateY(18deg)_rotateZ(5deg)_scale(0.94)]",
];

export function Methode() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const titleId = `${methode.id}-title`;
  const duration = reducedMotion ? 0 : 0.65;

  return (
    <section id={methode.id} aria-labelledby={titleId} className="border-t border-line py-24 md:py-36">
      <div className="shell">
        <Reveal className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
          <h2 id={titleId} className="font-display text-[clamp(2.75rem,5.8vw,5rem)] leading-[1.02] tracking-[-0.025em]">
            {methode.title.split(". ").map((line, index) => (
              <span key={line} className={`block ${index === 0 ? "font-extralight italic" : index === 2 ? "text-text-muted" : ""}`}>
                {line}{index < 2 ? "." : ""}
              </span>
            ))}
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-text-muted lg:pb-2 lg:text-lg">{methode.text}</p>
        </Reveal>

        <div className="mt-14 grid items-start gap-8 md:mt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal className="px-3 py-4 [perspective:1200px] sm:px-4 lg:sticky lg:top-[calc(var(--nav-height)+2rem)]">
            <div
              className={`relative isolate h-[23rem] overflow-hidden rounded-2xl bg-bg-elevated shadow-[inset_0_1px_0_#ffffff30,3px_6px_3px_#161618,10px_24px_40px_-12px_#000000cc] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] sm:h-[28rem] lg:h-[34rem] ${scenePoses[active]}`}
            >
              <motion.div aria-hidden="true" className="absolute inset-0"
                animate={{ scale: reducedMotion ? 1 : 1.08, x: reducedMotion ? 0 : [0, -8, 4, -4][active] }}
                transition={{ duration: reducedMotion ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }}>
                {methode.piliers.map((pilier, index) => (
                  <div key={pilier.image} className={`absolute inset-0 transition-opacity duration-700 ease-calm ${index === active ? "opacity-100" : "opacity-0"}`}>
                    <SceneImage src={pilier.image} alt="" sizes="(min-width: 1024px) 45vw, 100vw" position="60% center" />
                  </div>
                ))}
              </motion.div>
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-black/20" />
              <div aria-hidden="true" className="absolute inset-x-7 top-7 flex gap-2">
                {methode.piliers.map((pilier, index) => (
                  <span key={pilier.title} className="h-px flex-1 overflow-hidden bg-white/25">
                    <motion.span className="block h-full origin-left bg-white" animate={{ scaleX: index <= active ? 1 : 0 }} transition={{ duration }} />
                  </span>
                ))}
              </div>
              <div aria-hidden="true" className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={active} initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
                    transition={{ duration: reducedMotion ? 0.15 : 0.35 }}>
                    <span className="mb-5 block font-display text-[7rem] leading-none font-extralight tracking-[-0.04em] text-white/80 sm:text-[9rem]">
                      {String(active + 1).padStart(2, "0")}
                    </span>
                    <div className="relative isolate overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md sm:p-6">
                      <p className="font-display text-2xl leading-tight text-white">{methode.piliers[active].title}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          <ol className="border-t border-line">
            {methode.piliers.map((pilier, index) => {
              const selected = active === index;
              const panelId = `${methode.id}-panel-${index}`;
              const buttonId = `${methode.id}-button-${index}`;
              return (
                <li key={pilier.title} className="border-b border-line">
                  <div className={`group relative isolate overflow-hidden transition-colors duration-500 ${selected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}`}>
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                      <span className="glass-flow" />
                    </span>
                    <h3>
                      <button id={buttonId} type="button" aria-expanded={selected} aria-controls={panelId}
                        onClick={() => setActive(index)}
                        className="flex min-h-28 w-full cursor-pointer items-center gap-5 px-5 py-7 text-left sm:gap-7 sm:px-7 sm:py-9">
                        <span aria-hidden="true" className={`self-start pt-1 font-display text-sm tracking-widest transition-colors duration-500 ${selected ? "text-text" : "text-text-muted"}`}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={`flex-1 font-display text-[clamp(1.375rem,2.5vw,2rem)] leading-tight tracking-[-0.015em] transition-colors duration-500 ${selected ? "text-text" : "text-text-muted group-hover:text-text"}`}>
                          {pilier.title}
                        </span>
                        <span aria-hidden="true" className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20">
                          <span className="absolute h-px w-3 bg-text" />
                          <span className={`absolute h-3 w-px bg-text transition-transform duration-500 ${selected ? "rotate-90" : "rotate-0"}`} />
                        </span>
                      </button>
                    </h3>
                    <motion.div id={panelId} role="region" aria-labelledby={buttonId} aria-hidden={!selected} inert={!selected}
                      initial={false} animate={{ height: selected ? "auto" : 0, opacity: selected ? 1 : 0 }}
                      transition={{ duration, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                      <p className="max-w-lg pr-7 pb-9 pl-14 text-sm leading-relaxed text-text/75 sm:pl-[4.5rem] sm:text-base">{pilier.text}</p>
                    </motion.div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
