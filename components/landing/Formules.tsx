"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import {
  dureeSeance, formatLabels, formats, getFormule, niveaux,
  type Format, type Formule,
} from "@/config/formules";
import { formulesSection as content } from "@/content/landing";
import { formatPrix } from "@/lib/format";

export function Formules() {
  const [format, setFormat] = useState<Format>("presentiel");
  const reducedMotion = useReducedMotion();
  const titleId = `${content.id}-title`;

  return (
    <section id={content.id} aria-labelledby={titleId} className="border-t border-line py-24 md:py-36">
      <div className="shell">
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <h2 id={titleId} className="font-display text-[clamp(2.75rem,5.8vw,5rem)] leading-[1.02] tracking-[-0.025em]">
            {content.title.split(". ").map((line, index) => (
              <span key={line} className={`block ${index === 0 ? "font-extralight italic" : ""}`}>
                {line}{index === 0 ? "." : ""}
              </span>
            ))}
          </h2>
          <div className="lg:pb-1">
            <p className="max-w-md text-base leading-relaxed text-text-muted md:text-lg">{content.subtitle}</p>
            <div role="group" aria-label={content.toggleLabel}
              className="relative mt-7 inline-flex max-w-full rounded-full border border-white/15 bg-white/[0.04] p-1.5 shadow-[inset_0_2px_5px_#00000066] backdrop-blur-md">
              {formats.map((value) => (
                <button key={value} type="button" aria-pressed={value === format} onClick={() => setFormat(value)}
                  className={`relative flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full px-5 text-sm font-medium transition-colors duration-300 sm:px-7 ${value === format ? "text-text" : "text-text-muted hover:text-text"}`}>
                  {value === format ? (
                    <motion.span layoutId="format-pill" aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-white/25 bg-white/[0.12] shadow-[inset_0_1px_0_#ffffff25,0_3px_8px_#00000040]"
                      transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }} />
                  ) : null}
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" className="relative size-4 shrink-0">
                    {value === "presentiel" ? <><path d="M16 8c0 4-6 9-6 9S4 12 4 8a6 6 0 1 1 12 0Z" /><circle cx="10" cy="8" r="2" /></> : <><rect x="2.5" y="3.5" width="15" height="10" rx="2" /><path d="M7 17h6M10 13.5V17" /></>}
                  </svg>
                  <span className="relative">{formatLabels[value]}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-6 md:mt-20 md:grid-cols-2 lg:gap-8">
          {niveaux.map((niveau, index) => (
            <Reveal key={niveau} delay={index * 0.12} className="flex min-w-0 [perspective:1200px]">
              <FormuleCard formule={getFormule(niveau, format)} highlighted={niveau === "complet"} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 grid gap-6 border-t border-line pt-7 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
          <div className="max-w-2xl space-y-2">
            {content.notes.map((note) => <p key={note} className="text-sm leading-relaxed text-text-muted">{note}</p>)}
          </div>
          <Button href={content.cta.href} variant="secondary" className="w-full sm:w-auto">{content.cta.label}</Button>
        </Reveal>
      </div>
    </section>
  );
}

function FormuleCard({ formule, highlighted }: { formule: Formule; highlighted: boolean }) {
  const reducedMotion = useReducedMotion();
  const { labels } = content;
  const name = highlighted ? "Complet" : "Avancé";

  return (
    <article className={`group relative isolate flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border p-6 shadow-[inset_0_1px_0_#ffffff20,0_5px_2px_#0a0a0c,0_22px_36px_-16px_#000000cc] backdrop-blur-md transition-[transform,background-color,border-color,box-shadow] duration-700 ease-calm hover:-translate-y-2 sm:p-8 lg:p-10 ${highlighted ? "border-white/45 bg-white/[0.11] ring-1 ring-white/10 hover:border-white/65 hover:bg-white/[0.15]" : "border-white/12 bg-white/[0.035] hover:border-white/35 hover:bg-white/[0.1]"}`}>
      {highlighted ? (
        <>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,#ffffff1c,transparent_65%)]" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/90 to-transparent" />
        </>
      ) : null}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-700 group-hover:opacity-100">
        <span className="glass-flow" />
      </span>
      <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-text-muted">{formatLabels[formule.format]}</span>
        {highlighted ? <span className="rounded-full border border-white/70 bg-text px-3 py-1 text-xs font-semibold text-bg">{content.highlight}</span> : null}
      </div>
      <h3 className="mt-7 font-display text-4xl leading-none tracking-[-0.02em] sm:text-5xl">{name}</h3>
      <p className="mt-4 min-h-14 max-w-md text-sm leading-relaxed text-text-muted sm:text-base">{formule.pourQui}</p>

      <motion.div key={formule.id} initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="mt-8" aria-live="polite" aria-atomic="true">
        <p className="text-sm text-text-muted">{content.totalLabel}</p>
        <p className="mt-2 font-display text-[clamp(3rem,5.5vw,4.5rem)] leading-none tracking-[-0.03em] tabular-nums">{formatPrix(formule.prix)}</p>
        <p className="mt-3 text-sm text-text-muted">
          <span className="font-medium text-text">{formatPrix(formule.prix * 0.3)}</span> {content.depositLabel}
        </p>
      </motion.div>

      <dl className="mt-8 divide-y divide-line border-y border-line">
        {[
          { label: labels.duree, value: formule.duree },
          { label: labels.rythme, value: formule.rythme },
          { label: labels.seances, value: dureeSeance },
        ].map((item) => (
          <div key={item.label} className="grid grid-cols-[5rem_1fr] gap-4 py-4 sm:grid-cols-[6rem_1fr]">
            <dt className="text-sm text-text-muted">{item.label}</dt>
            <dd className="text-right text-sm leading-relaxed">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-7 flex-1">
        <p className="text-sm text-text-muted">{labels.inclus}</p>
        <ul className="mt-4 space-y-3.5">
          {formule.inclus.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
              <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-text/70" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-7 flex min-h-12 items-center">
        {formule.bonus ? <p className="flex items-start gap-2 text-xs leading-relaxed text-text/85"><span aria-hidden="true" className="mt-1 size-1.5 shrink-0 rounded-full bg-text/70" />{formule.bonus}</p> : null}
      </div>
      <Button href={content.cta.href} animated={highlighted} variant={highlighted ? "primary" : "secondary"} className="mt-4 w-full">
        {content.cardCta}
        <span className="sr-only"> — {name}, {formatLabels[formule.format]}</span>
      </Button>
    </article>
  );
}
