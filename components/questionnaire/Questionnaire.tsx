"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { questionGroups, questionnaireSteps, type Question } from "@/content/questionnaire";
import { validateAnswers, type Answers, type FieldErrors, type QuestionnaireResult } from "@/lib/questionnaire";
import { getFormuleById, dureeSeance } from "@/config/formules";
import { siteConfig } from "@/config/site";
import { formatPrix } from "@/lib/format";
import { AccountForm } from "@/components/auth/AccountForm";
import { authClient } from "@/lib/auth-client";
import { fieldClass as inputClass, glassAction as actionClass, panelClass } from "@/components/ui/styles";

const pad = (n: number) => String(n).padStart(2, "0");

export function Questionnaire() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<QuestionnaireResult | null>(null);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sendError, setSendError] = useState("");
  const [needsAccount, setNeedsAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [authPending, setAuthPending] = useState(false);
  const submissionId = useRef<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();
  const requiredQuestions = questionGroups[step].filter(question => question.required);
  const currentErrors = validateAnswers(answers, step);
  const completedQuestions = requiredQuestions.filter(question => !currentErrors[question.id]).length;

  function focusHeading() {
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
    });
  }
  function goTo(next: number) {
    setStep(next);
    setFurthestStep(previous => Math.max(previous, next));
    setErrors({});
    focusHeading();
  }
  function change(id: string, value: string | string[]) {
    setAnswers(previous => ({ ...previous, [id]: value }));
    setErrors(previous => { const copy = { ...previous }; delete copy[id]; return copy; });
    submissionId.current = null;
    setSaved(false);
    setSendError("");
    if (id === "adult" && value === "no") {
      setResult({ status: "blocked", reason: "age" });
      focusHeading();
    }
  }
  function check(group: number) {
    const found = validateAnswers(answers, group);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) requestAnimationFrame(() => {
      const container = document.getElementById(`question-${first}`);
      const input = container?.querySelector<HTMLElement>("input,textarea");
      input?.focus();
    });
    return !first;
  }
  async function submit() {
    if (pending) return;
    for (let i = 0; i < questionGroups.length; i++) {
      const found = validateAnswers(answers, i);
      if (Object.keys(found).length) { setResult(null); goTo(i); setErrors(found); return; }
    }
    setPending(true);
    setSendError("");
    submissionId.current ??= crypto.randomUUID();
    try {
      const session = await authClient.getSession();
      if (session.error) throw new Error("Session unavailable");
      if (!session.data) {
        setResult(null);
        setNeedsAccount(true);
        focusHeading();
        return;
      }
      setNeedsAccount(false);
      const response = await fetch("/api/questionnaire", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: submissionId.current, answers }),
        signal: AbortSignal.timeout(20000),
      });
      const data = await response.json();
      if (response.status === 401) {
        setResult(null);
        setNeedsAccount(true);
        focusHeading();
        return;
      }
      if (data.result) { setResult(data.result); setSaved(data.saved === true); focusHeading(); }
      if (!response.ok) {
        if (data.errors) {
          const index = questionGroups.findIndex(group => group.some(q => data.errors[q.id]));
          setResult(null); goTo(Math.max(0, index)); setErrors(data.errors);
        }
        setSendError(data.error || "L’envoi a échoué. Réessaie dans un instant.");
      }
    } catch {
      setSendError("La connexion a été interrompue. Tes réponses sont toujours là : tu peux réessayer.");
    } finally { setPending(false); }
  }
  function next(event: FormEvent) {
    event.preventDefault();
    if (!check(step)) return;
    if (step === 4) void submit();
    else goTo(step + 1);
  }

  return (
    <div className="questionnaire shell pt-[calc(var(--nav-height)+1rem)] pb-24 md:pt-[calc(var(--nav-height)+1.5rem)] md:pb-32">
      <Link href="/" className="inline-flex min-h-11 items-center gap-3 text-sm text-text-muted transition-colors hover:text-text"><span aria-hidden="true">←</span> Retour au site</Link>
      {!started ? (
        <div className="mx-auto grid max-w-6xl items-center gap-12 py-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20 lg:py-10">
          <div>
            <p className="eyebrow flex items-center gap-3 text-text-muted"><span aria-hidden="true" className="h-px w-8 bg-accent" />Questionnaire</p>
            <h1 className="mt-6 font-display text-[clamp(3rem,6.5vw,5.5rem)] leading-[1.02] tracking-[-0.025em]"><span className="block font-extralight italic">Ton profil.</span>Ta formule.</h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">Quelques questions sur ton niveau, ta situation et ton engagement. Réponds honnêtement : c’est ce qui me permet de te recommander le bon niveau, sans te faire payer ce que tu maîtrises déjà.</p>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="En bref">
              {["5 étapes", "20 questions", "≈ 4 minutes"].map(item => <li key={item} className="rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-1.5 text-xs text-text/80">{item}</li>)}
            </ul>
            <button type="button" className={`${actionClass} mt-9`} onClick={() => { setStarted(true); focusHeading(); }}><span aria-hidden="true" className="glass-flow" />Commencer<span aria-hidden="true">→</span></button>
            <p className="mt-5 max-w-md text-xs leading-relaxed text-text-muted">Tes réponses restent dans ce parcours jusqu’à l’envoi final. Tu peux revenir en arrière à chaque étape.</p>
          </div>
          <div className={`${panelClass} p-6 sm:p-8`}>
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-10 -top-px h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />
            <p className="eyebrow text-text-muted">Le parcours</p>
            <ol className="relative mt-6">
              <span aria-hidden="true" className="absolute top-5 bottom-5 left-[1.1875rem] w-px bg-linear-to-b from-white/30 via-white/10 to-white/30" />
              {questionnaireSteps.map((item, index) => <li key={item.title} className="relative flex items-center gap-5 py-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-bg text-xs tabular-nums text-text-muted">{pad(index + 1)}</span>
                <span><span className="block font-display text-lg leading-tight">{item.title}</span><span className="mt-0.5 block text-xs text-text-muted">{item.description}</span></span>
              </li>)}
            </ol>
            <p className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-text-muted">À l’arrivée : une recommandation personnalisée et, si les conditions sont réunies, un échange découverte.</p>
          </div>
        </div>
      ) : result ? (
        <Result result={result} firstName={String(answers.firstName || "")} saved={saved} accountCreated={accountCreated} pending={pending} error={sendError} headingRef={headingRef}
          onRetry={() => void submit()} onEdit={() => { setResult(null); setSendError(""); focusHeading(); }} />
      ) : needsAccount ? (
        <section className="mx-auto grid max-w-6xl items-center gap-12 py-6 lg:grid-cols-[1fr_28rem] lg:gap-20 lg:py-12" aria-labelledby="account-heading">
          <div>
            <p className="eyebrow flex items-center gap-3 text-text-muted"><span aria-hidden="true" className="h-px w-8 bg-accent" />Dernière étape</p>
            <h1 id="account-heading" ref={headingRef} tabIndex={-1} className="mt-6 scroll-mt-28 font-display text-[clamp(2.75rem,5.5vw,4.5rem)] leading-[1.04] tracking-[-0.025em] outline-none"><span className="block font-extralight italic">Tes réponses</span>sont prêtes.</h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-text-muted md:text-lg">Crée ton compte pour envoyer ton questionnaire et le retrouver dans ton espace. L’envoi se fera automatiquement après ton inscription ou ta connexion.</p>
            <button type="button" disabled={pending || authPending} onClick={() => { setNeedsAccount(false); setSendError(""); focusHeading(); }} className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm text-text-muted transition-colors hover:text-text disabled:opacity-50"><span aria-hidden="true">←</span> Revenir à mes réponses</button>
          </div>
          <div className={`${panelClass} p-6 sm:p-8`}>
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-10 -top-px h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />
            <AccountForm questionnaire initialEmail={String(answers.email || "")} initialName={String(answers.firstName || "")} onBusyChange={setAuthPending} onSuccess={async created => { setAccountCreated(created); setNeedsAccount(false); await submit(); }} />
            {sendError ? <p role="alert" className="mt-5 text-sm text-[#e9c4b0]">{sendError}</p> : null}
          </div>
        </section>
      ) : (
        <div className="questionnaire-workspace mx-auto mt-6 max-w-6xl">
          <nav aria-label="Étapes du questionnaire" className="questionnaire-sidebar">
            <div className="flex items-baseline justify-between gap-4">
              <p className="eyebrow text-text-muted" aria-live="polite">Étape {step + 1} sur 5</p>
              <p aria-hidden="true" className="text-xs tabular-nums text-text-muted">{Math.round(((step + 1) / 5) * 100)} %</p>
            </div>
            <div role="progressbar" aria-label="Progression du questionnaire" aria-valuemin={0} aria-valuemax={5} aria-valuenow={step + 1} className="mt-4 h-1 rounded-full bg-white/10">
              <div className="h-full origin-left rounded-full bg-text shadow-[0_0_14px_rgba(255,255,255,0.55)] transition-transform duration-700 ease-calm" style={{ transform: `scaleX(${(step + 1) / 5})` }} />
            </div>
            <ol className="questionnaire-steps mt-6 grid grid-cols-5 gap-2 sm:gap-4">
              {questionnaireSteps.map((item, index) => <li key={item.title} className="min-w-0 flex-1">
                <button type="button" onClick={() => goTo(index)} disabled={pending || index > furthestStep} aria-current={step === index ? "step" : undefined}
                  className={`flex min-h-11 w-full flex-col items-center gap-3 rounded-xl px-1 py-2 text-center text-sm transition-colors duration-300 disabled:cursor-default ${index === step ? "text-text" : index <= furthestStep ? "cursor-pointer text-text-muted hover:bg-white/[0.03] hover:text-text" : "text-text-muted/45"}`}>
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums transition-[background-color,border-color,color,box-shadow] duration-500 ${index === step ? "border-white/50 bg-white/10 shadow-[0_0_16px_-2px_rgba(255,255,255,0.35)]" : index < step ? "border-text bg-text text-bg" : "border-white/15"}`}>
                    {index < step ? <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.25" className="size-3.5"><path d="m3 8 3 3 7-7" /></svg> : index + 1}
                  </span>
                  <span className="hidden leading-snug sm:inline">{item.title}</span>
                </button>
              </li>)}
            </ol>
          </nav>

          <div className="questionnaire-main min-w-0">
            <p className="eyebrow text-text-muted">Étape {pad(step + 1)} / 05</p>
            <h1 ref={headingRef} tabIndex={-1} className="mt-4 scroll-mt-28 font-display text-[clamp(2.5rem,4.5vw,3.75rem)] leading-tight tracking-[-0.02em] outline-none">{questionnaireSteps[step].title}</h1>
            <p className="mt-3 text-base leading-relaxed text-text-muted md:text-lg">{questionnaireSteps[step].description}</p>
            {requiredQuestions.length ? <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pr-4 pl-1.5" aria-live="polite">
              <span aria-hidden="true" className="relative h-1 w-14 overflow-hidden rounded-full bg-white/10"><span className="absolute inset-y-0 left-0 rounded-full bg-text transition-[width] duration-500 ease-calm" style={{ width: `${(completedQuestions / requiredQuestions.length) * 100}%` }} /></span>
              <span className="text-xs tabular-nums text-text-muted">{completedQuestions} / {requiredQuestions.length} réponses obligatoires</span>
            </div> : null}
            <AnimatePresence mode="wait" initial={false}>
              <motion.form key={step} onSubmit={next} noValidate aria-busy={pending} initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-10">
                <fieldset disabled={pending} className="min-w-0">
                {step === 4 ? <Review answers={answers} onEdit={goTo} /> : null}
                {Object.keys(errors).length ? <p role="alert" className="mb-7 rounded-xl border border-[#dbb5a0]/30 bg-[#dbb5a0]/5 p-4 text-sm text-[#e9c4b0]">Vérifie les réponses indiquées ci-dessous.</p> : null}
                <div className="questionnaire-fields">
                  {questionGroups[step].map(q => <QuestionField key={q.id} question={q} value={answers[q.id]} error={errors[q.id]} onChange={value => change(q.id, value)} />)}
                </div>
                {step === 4 ? <p className="mt-8 text-xs leading-relaxed text-text-muted">En envoyant ce questionnaire, tu transmets tes coordonnées et tes réponses à Life By Design pour l’étude de ton profil et une prise de contact. <Link href={siteConfig.routes.confidentialite} className="underline underline-offset-4 hover:text-text">Confidentialité</Link>.</p> : null}
                {sendError ? <p role="alert" className="mt-6 text-sm leading-relaxed text-[#e9c4b0]">{sendError}</p> : null}
                <div className="questionnaire-actions mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7">
                  <button type="button" disabled={pending} onClick={() => step === 0 ? setStarted(false) : goTo(step - 1)} className="min-h-12 cursor-pointer px-2 text-sm text-text-muted hover:text-text disabled:opacity-50">← Précédent</button>
                  <button type="submit" disabled={pending} className={actionClass}><span aria-hidden="true" className="glass-flow" />{pending ? "Envoi en cours…" : step === 4 ? "Voir ma recommandation" : "Continuer"}<span aria-hidden="true">→</span></button>
                </div>
                </fieldset>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionField({ question: q, value, error, onChange }: { question: Question; value: string | string[] | undefined; error?: string; onChange: (value: string | string[]) => void }) {
  const hintId = `hint-${q.id}`;
  const errorId = `error-${q.id}`;
  const describedBy = [q.hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined;
  const optionField = Boolean(q.options);
  function toggle(v: string) {
    const current = Array.isArray(value) ? value : [];
    if (q.id === "experience" && v === "none") { onChange(current.includes(v) ? [] : [v]); return; }
    const next = current.filter(item => q.id !== "experience" || item !== "none");
    onChange(next.includes(v) ? next.filter(item => item !== v) : [...next, v]);
  }
  const title = <><span className="mr-3 inline-flex translate-y-[-0.1em] items-center rounded-full border border-white/12 px-2 py-0.5 align-middle text-[0.6875rem] font-normal tabular-nums text-text-muted">{pad(q.number)}</span>{q.label}{!q.required ? <span className="ml-2 text-xs font-normal text-text-muted">Facultatif</span> : null}</>;
  const control = optionField ? (
    <div className={q.type === "scale" ? "mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10" : `mt-4 grid gap-3 ${q.options!.length <= 4 ? "sm:grid-cols-2" : ""}`}>
      {q.options!.map(option => {
        const checked = Array.isArray(value) ? value.includes(option.value) : value === option.value;
        return <label key={option.value} className="relative block cursor-pointer">
          <input type={q.type === "checkbox" ? "checkbox" : "radio"} name={q.id} value={option.value} checked={checked} required={q.required && (q.type !== "checkbox" || q.id === "confirmations")} onChange={() => q.type === "checkbox" ? toggle(option.value) : onChange(option.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy} className="peer sr-only" />
          <span className={`flex h-full min-h-14 items-center gap-3 rounded-xl border border-white/12 bg-white/[0.025] text-sm leading-relaxed transition-[background-color,border-color,box-shadow,color] duration-300 hover:border-white/28 hover:bg-white/[0.05] peer-checked:border-white/50 peer-checked:bg-white/[0.1] peer-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_28px_-10px_rgba(255,255,255,0.45)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-white ${q.type === "scale" ? "justify-center px-1 py-3" : "px-4 py-4"}`}>
            {q.type !== "scale" ? <span aria-hidden="true" className={`flex size-4 shrink-0 items-center justify-center border ${q.type === "checkbox" ? "rounded" : "rounded-full"} ${checked ? "border-text bg-text text-bg" : "border-text-muted/70"}`}>{checked ? <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="size-3"><path d="m3 8 3 3 7-7" /></svg> : null}</span> : null}
            {option.label}
          </span>
        </label>;
      })}
    </div>
  ) : q.type === "textarea" ? <textarea id={`input-${q.id}`} name={q.id} value={typeof value === "string" ? value : ""} onChange={e => onChange(e.target.value)} maxLength={q.maxLength} required={q.required} rows={4} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={`${inputClass} mt-4 resize-y`} />
    : <input id={`input-${q.id}`} name={q.id} type={q.type} value={typeof value === "string" ? value : ""} onChange={e => onChange(e.target.value)} placeholder={q.placeholder} autoComplete={q.autoComplete ?? "off"} maxLength={q.maxLength} required={q.required} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={`${inputClass} mt-4`} />;
  return optionField ? <fieldset id={`question-${q.id}`} aria-describedby={describedBy}>
    <legend className="text-base leading-relaxed font-medium sm:text-lg">{title}</legend>
    {q.hint ? <p id={hintId} className="mt-2 text-sm leading-relaxed text-text-muted">{q.hint}</p> : null}{control}
    {error ? <p id={errorId} className="mt-3 text-sm text-[#e9c4b0]">{error}</p> : null}
  </fieldset> : <div id={`question-${q.id}`}>
    <label htmlFor={`input-${q.id}`} className="block text-base leading-relaxed font-medium sm:text-lg">{title}</label>
    {q.hint ? <p id={hintId} className="mt-2 text-sm leading-relaxed text-text-muted">{q.hint}</p> : null}{control}
    {error ? <p id={errorId} className="mt-3 text-sm text-[#e9c4b0]">{error}</p> : null}
  </div>;
}

function Review({ answers, onEdit }: { answers: Answers; onEdit: (step: number) => void }) {
  return <section aria-label="Récapitulatif des réponses" className="mb-10">
    <h2 className="font-display text-2xl">Relire avant d’envoyer</h2>
    <p className="mt-2 mb-4 text-sm leading-relaxed text-text-muted">Ouvre une rubrique pour vérifier tes réponses. Tu peux encore les modifier.</p>
    <div className="divide-y divide-line border-y border-line">
    {questionGroups.slice(0, 4).map((group, index) => <details key={index} className="py-5">
      <summary className="cursor-pointer text-sm font-medium">{questionnaireSteps[index].title} <span className="ml-2 text-xs font-normal text-text-muted">Relire mes réponses</span></summary>
      <dl className="mt-5 space-y-4">
        {group.map(q => {
          const raw = answers[q.id]; const values = Array.isArray(raw) ? raw : [raw];
          const text = values.filter(Boolean).map(v => q.options?.find(o => o.value === v)?.label ?? v).join(" · ");
          return <div key={q.id}><dt className="text-xs text-text-muted">{q.label}</dt><dd className="mt-1 text-sm leading-relaxed break-words whitespace-pre-wrap">{text || "Non renseigné"}</dd></div>;
        })}
      </dl>
      <button type="button" onClick={() => onEdit(index)} className="mt-4 min-h-11 cursor-pointer text-sm underline underline-offset-4">Modifier cette étape</button>
    </details>)}
    </div>
  </section>;
}

function Result({ result, firstName, saved, accountCreated, pending, error, headingRef, onRetry, onEdit }: {
  result: QuestionnaireResult; firstName: string; saved: boolean; accountCreated: boolean; pending: boolean; error: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>; onRetry: () => void; onEdit: () => void;
}) {
  const formule = result.status === "recommended" ? getFormuleById(result.formuleId) : null;
  return <div className="mx-auto max-w-4xl py-6 md:py-10">
    {saved ? <div role="status" className="mb-10 border-y border-line py-6"><p className="font-display text-2xl">{accountCreated ? "Ton compte est créé, ton questionnaire est envoyé." : "Ton questionnaire a bien été envoyé."}</p><p className="mt-2 text-sm leading-relaxed text-text-muted">Tes réponses sont liées à ton compte et seront étudiées pour préparer la suite.</p><Link href="/compte" className="mt-3 inline-flex min-h-11 items-center text-sm underline underline-offset-4">Retrouver mon questionnaire</Link></div> : null}
    <p className="mb-6 text-sm text-text-muted">{result.status === "recommended" ? `${firstName}, voici ta recommandation.` : "Ton profil, au bon moment."}</p>
    <h1 ref={headingRef} tabIndex={-1} className="font-display text-[clamp(2.75rem,5.5vw,4.5rem)] leading-[1.04] tracking-[-0.025em] outline-none">
      {result.status === "recommended" ? <><span className="block font-extralight italic">Ta prochaine étape.</span>{formule?.nom}</> : "Pas maintenant."}
    </h1>
    {result.status === "recommended" && formule ? <>
      <div className={`${panelClass} mt-10 p-6 sm:p-9`}>
        <span aria-hidden="true" className="glass-flow glass-soft" />
        <p className="eyebrow mb-6 text-text-muted">Formule recommandée</p>
        <p className="max-w-xl text-base leading-relaxed text-text-muted">{formule.pourQui}</p>
        <p className="mt-7 font-display text-5xl tracking-[-0.025em] sm:text-6xl">{formatPrix(formule.prix)}</p>
        <p className="mt-3 text-sm text-text-muted">Tarif de lancement · {formatPrix(formule.prix * 0.3)} à l’engagement (30 %)</p>
        <dl className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
          {[{ label: "Durée", value: result.duration }, { label: "Rythme", value: formule.rythme }, { label: "Par séance", value: dureeSeance }].map(item => <div key={item.label}><dt className="text-xs text-text-muted">{item.label}</dt><dd className="mt-2 text-sm">{item.value}</dd></div>)}
        </dl>
        {result.inPersonOption ? <p className="mt-6 text-sm text-text-muted">Séance présentielle en option, à organiser lors de l’échange.</p> : null}
      </div>
      <div className="mt-10"><h2 className="font-display text-2xl">Pourquoi cette formule ?</h2><ul className="mt-5 space-y-4">{[...result.reasons, ...result.notes].map(note => <li key={note} className="flex gap-3 text-base leading-relaxed text-text-muted"><span aria-hidden="true" className="mt-3 size-1 shrink-0 rounded-full bg-text/70" />{note}</li>)}</ul></div>
      <div className="mt-10 border-t border-line pt-8"><p className="max-w-xl text-base leading-relaxed">Prochaine étape : un échange découverte pour valider ensemble ton profil et le bon moment pour commencer.</p><div className="mt-6 flex flex-wrap gap-4"><Button href={siteConfig.links.zcal} external animated>Réserver mon échange</Button><Button href={siteConfig.links.telegram} external variant="secondary">Me contacter sur Telegram</Button></div></div>
    </> : <div className="mt-8 max-w-2xl space-y-6 text-base leading-relaxed text-text-muted">
      {result.status === "blocked" && result.reason === "age" ? <p>L’accompagnement est réservé aux personnes de 18 ans ou plus. Tu pourras revenir quand cette condition sera remplie. Tes coordonnées n’ont pas été envoyées.</p> : <><p>Commencer sans les bonnes conditions, c’est risquer de perdre du temps et de l’argent. Construis d’abord ta base : garde une réserve pour vivre et un budget dédié à ta formation.</p><p>Le Kit Plan Financier Intérieur peut t’aider à préparer cette étape.</p><Button href={siteConfig.links.telegram} external animated>Me demander le Kit</Button></>}
    </div>}
    {error ? <div role="alert" className="mt-8 rounded-xl border border-[#dbb5a0]/30 bg-[#dbb5a0]/5 p-5"><p className="text-sm leading-relaxed text-[#e9c4b0]">{error}</p><button type="button" disabled={pending} onClick={onRetry} className={`${actionClass} mt-4`}>{pending ? "Envoi en cours…" : "Réessayer l’envoi"}</button></div> : null}
    <div className="mt-10 flex flex-wrap gap-6"><button type="button" onClick={onEdit} disabled={pending} className="min-h-11 cursor-pointer text-sm text-text-muted underline underline-offset-4 hover:text-text disabled:cursor-wait disabled:opacity-50">Modifier mes réponses</button><Link href="/" className="inline-flex min-h-11 items-center text-sm text-text-muted hover:text-text">Retour à l’accueil</Link></div>
  </div>;
}
