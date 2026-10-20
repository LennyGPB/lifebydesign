"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  dureeSeance,
  formatLabels,
  formats,
  getFormule,
  niveauLabels,
  niveaux,
  type Format,
  type Formule,
} from "@/config/formules";
import { formulesSection as content } from "@/content/landing";
import { formatPrix } from "@/lib/format";

export function Formules() {
  const [format, setFormat] = useState<Format>("presentiel");
  const titleId = `${content.id}-title`;

  return (
    <section
      id={content.id}
      aria-labelledby={titleId}
      className="border-t border-line py-24 md:py-36"
    >
      <div className="shell">
        <SectionTitle
          id={titleId}
          label={content.label}
          title={content.title}
          text={content.subtitle}
          align="center"
        />

        <Reveal delay={0.1} className="mt-12 flex justify-center">
          <div
            role="group"
            aria-label={content.toggleLabel}
            className="relative inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur-md"
          >
            {formats.map((value) => {
              const active = value === format;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFormat(value)}
                  className={`relative min-h-11 rounded-full px-6 text-sm font-semibold transition-colors duration-300 ${
                    active ? "text-text" : "text-text/60 hover:text-text"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="format-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-white/20 bg-white/[0.1]"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  ) : null}
                  <span className="relative">{formatLabels[value]}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:mt-14 md:grid-cols-2">
          {niveaux.map((niveau, index) => (
            <Reveal key={niveau} delay={0.15 + index * 0.08} className="flex">
              <FormuleCard formule={getFormule(niveau, format)} highlighted={niveau === "complet"} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-10 max-w-2xl space-y-2 text-center">
          {content.notes.map((note) => (
            <p key={note} className="text-sm leading-relaxed text-text-muted">
              {note}
            </p>
          ))}
        </Reveal>

        <Reveal className="mt-10 flex justify-center">
          <Button href={content.cta.href} variant="secondary">
            {content.cta.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function FormuleCard({ formule, highlighted }: { formule: Formule; highlighted: boolean }) {
  const { labels } = content;

  return (
    <article
      className={`relative flex w-full flex-col rounded-[20px] border p-7 backdrop-blur-md transition-[background-color,border-color] duration-500 ease-calm md:p-9 ${
        highlighted
          ? "border-white/25 bg-white/[0.05] hover:border-white/35"
          : "border-white/10 bg-white/[0.03] hover:border-white/18"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow text-text-muted">{niveauLabels[formule.niveau]}</p>
        {highlighted ? (
          <span className="eyebrow rounded-full border border-white/20 bg-white/[0.08] px-3 py-1 text-[0.62rem] text-text">
            {content.highlight}
          </span>
        ) : null}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={formule.id}
          className="flex flex-1 flex-col"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="mt-6 font-display text-[1.75rem] leading-[1.1] tracking-[-0.02em] text-balance md:text-[2rem]">
            {formule.nom}
          </h3>
          <p className="mt-6 font-display text-5xl leading-none tracking-[-0.02em] md:text-6xl">
            {formatPrix(formule.prix)}
          </p>

          <div className="mt-8 border-t border-line pt-6">
            <p className="eyebrow text-text-muted">{labels.pourQui}</p>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-text/90">{formule.pourQui}</p>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              { label: labels.duree, value: formule.duree },
              { label: labels.rythme, value: formule.rythme },
              { label: labels.seances, value: dureeSeance },
            ].map((item) => (
              <div key={item.label}>
                <dt className="eyebrow text-[0.62rem] text-text-muted">{item.label}</dt>
                <dd className="mt-2 text-sm leading-snug">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 border-t border-line pt-6">
            <p className="eyebrow text-text-muted">{labels.inclus}</p>
            <ul className="mt-4 space-y-3">
              {formule.inclus.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-snug">
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {formule.bonus ? (
            <p className="mt-7 inline-flex self-start rounded-full border border-accent/40 bg-accent-soft px-4 py-2 text-xs font-semibold text-accent">
              {formule.bonus}
            </p>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-0.5 size-4 shrink-0 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
