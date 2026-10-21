// Classes partagées par le questionnaire et l'espace compte.

/** Bouton en verre clair (même famille que le CTA principal). Ajouter <span className="glass-flow" /> pour la lumière animée. */
export const glassAction =
  "group relative isolate inline-flex min-h-14 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full border border-white/25 bg-white/10 px-7 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md transition-[background-color,border-color,scale] duration-500 ease-calm hover:border-white/40 hover:bg-white/15 active:scale-[0.99] disabled:cursor-wait disabled:opacity-50";

/** Champ texte : verre fumé, halo doux au focus. */
export const fieldClass =
  "w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3.5 text-base text-text outline-none transition-[background-color,border-color,box-shadow] duration-300 placeholder:text-text-muted/50 hover:border-white/25 focus:border-white/55 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(255,255,255,0.06)]";

/** Panneau en verre (cartes, formulaires). */
export const panelClass =
  "relative isolate overflow-hidden rounded-3xl border border-white/15 bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl";
