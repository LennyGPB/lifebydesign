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

const actionClass = "group relative isolate inline-flex min-h-14 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full border border-white/25 bg-white/10 px-7 text-sm font-semibold backdrop-blur-md transition-[background-color,border-color] duration-500 hover:border-white/40 hover:bg-white/15 disabled:cursor-wait disabled:opacity-50";
const inputClass = "w-full rounded-xl border border-white/20 bg-white/[0.04] px-4 py-4 text-base text-text outline-none transition-colors placeholder:text-text-muted/60 focus:border-white/60 focus:bg-white/[0.07]";

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
            <p className="mb-7 text-sm text-text-muted">5 étapes · 20 questions · environ 4 minutes</p>
            <h1 className="font-display text-[clamp(3rem,6.5vw,5.5rem)] leading-[1.02] tracking-[-0.025em]"><span className="block font-extralight italic">Ton profil.</span>Ta formule.</h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">Quelques questions sur ton niveau, ta situation et ton engagement. Réponds honnêtement : c’est ce qui me permet de te recommander le bon niveau, sans te faire payer ce que tu maîtrises déjà.</p>
            <button type="button" className={`${actionClass} mt-9`} onClick={() => { setStarted(true); focusHeading(); }}><span aria-hidden="true" className="glass-flow" />Commencer<span aria-hidden="true">↗</span></button>
            <p className="mt-5 text-xs leading-relaxed text-text-muted">Tes réponses restent dans ce parcours jusqu’à l’envoi final. Tu peux revenir en arrière à chaque étape.</p>
          </div>
          <div className="relative isolate overflow-hidden rounded-2xl border border-white/20 bg-white/[0.06] p-8 shadow-[inset_0_1px_0_#ffffff25,0_20px_40px_-16px_#000000cc] ">
            <ol className="divide-y divide-line">
              {questionnaireSteps.map((item, index) => <li key={item.title} className="flex items-center gap-5 py-5"><span className="font-display text-sm text-text-muted">0{index + 1}</span><span className="font-display text-xl">{item.title}</span></li>)}
            </ol>
            <p className="mt-6 text-sm leading-relaxed text-text-muted">À l’arrivée : une recommandation personnalisée et, si les conditions sont réunies, un échange découverte.</p>
          </div>
        </div>
      ) : result ? (
        <Result result={result} firstName={String(answers.firstName || "")} saved={saved} accountCreated={accountCreated} pending={pending} error={sendError} headingRef={headingRef}
          onRetry={() => void submit()} onEdit={() => { setResult(null); setSendError(""); focusHeading(); }} />
      ) : needsAccount ? (
        <section className="mx-auto max-w-xl py-10 md:py-16" aria-labelledby="account-heading">
          <h1 id="account-heading" ref={headingRef} tabIndex={-1} className="scroll-mt-28 font-display text-4xl leading-tight outline-none sm:text-5xl">Une dernière étape.</h1>
          <p className="mt-5 mb-8 text-base leading-relaxed text-text-muted">Crée ton compte pour envoyer ton questionnaire et le retrouver dans ton espace. Tes réponses sont prêtes : elles seront envoyées automatiquement après ton inscription ou ta connexion.</p>
          <AccountForm questionnaire initialEmail={String(answers.email || "")} initialName={String(answers.firstName || "")} onBusyChange={setAuthPending} onSuccess={async created => { setAccountCreated(created); setNeedsAccount(false); await submit(); }} />
          {sendError ? <p role="alert" className="mt-5 text-sm text-[#e9c4b0]">{sendError}</p> : null}
          <button type="button" disabled={pending || authPending} onClick={() => { setNeedsAccount(false); setSendError(""); focusHeading(); }} className="mt-6 min-h-11 cursor-pointer text-sm text-text-muted underline underline-offset-4 disabled:opacity-50">Revenir à mes réponses</button>
        </section>
      ) : (
        <div className="questionnaire-workspace mx-auto mt-6 max-w-6xl">
          <nav aria-label="Étapes du questionnaire" className="questionnaire-sidebar">
            <p className="text-sm text-text-muted" aria-live="polite">Étape {step + 1} sur 5</p>
            <div role="progressbar" aria-label="Progression du questionnaire" aria-valuemin={0} aria-valuemax={5} aria-valuenow={step + 1} className="mt-4 h-px overflow-hidden bg-white/15">
              <div className="h-full origin-left bg-text transition-transform duration-700 ease-calm" style={{ transform: `scaleX(${(step + 1) / 5})` }} />
            </div>
            <ol className="questionnaire-steps mt-6 grid grid-cols-5 gap-2 sm:gap-4">
              {questionnaireSteps.map((item, index) => <li key={item.title} className="min-w-0 flex-1">
                <button type="button" onClick={() => goTo(index)} disabled={pending || index > furthestStep} aria-current={step === index ? "step" : undefined}
                  className={`flex min-h-11 w-full flex-col items-center gap-3 rounded-lg px-1 py-2 text-center text-sm transition-colors disabled:cursor-default ${index === step ? "text-text" : index < step ? "cursor-pointer text-text-muted hover:text-text" : "text-text-muted/50"}`}>
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${index === step ? "border-white/40 bg-white/10" : "border-white/15"}`}>{index < step ? "✓" : index + 1}</span>
                  <span className="hidden leading-snug sm:inline">{item.title}</span>
                </button>
              </li>)}
            </ol>
          </nav>

          <div className="questionnaire-main min-w-0">
            <h1 ref={headingRef} tabIndex={-1} className="scroll-mt-28 font-display text-[clamp(2.5rem,4.5vw,3.75rem)] leading-tight tracking-[-0.02em] outline-none">{questionnaireSteps[step].title}</h1>
            <p className="mt-3 text-base leading-relaxed text-text-muted">{questionnaireSteps[step].description}</p>
            <p className="mt-5 text-xs tabular-nums text-text-muted" aria-live="polite">{completedQuestions} / {requiredQuestions.length} réponses obligatoires renseignées</p>
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
  const title = <><span className="mr-3 text-sm font-normal text-text-muted">{String(q.number).padStart(2, "0")}</span>{q.label}{!q.required ? <span className="ml-2 text-xs font-normal text-text-muted">Facultatif</span> : null}</>;
  const control = optionField ? (
    <div className={q.type === "scale" ? "mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10" : `mt-4 grid gap-3 ${q.options!.length <= 4 ? "sm:grid-cols-2" : ""}`}>
      {q.options!.map(option => {
        const checked = Array.isArray(value) ? value.includes(option.value) : value === option.value;
        return <label key={option.value} className="relative block cursor-pointer">
          <input type={q.type === "checkbox" ? "checkbox" : "radio"} name={q.id} value={option.value} checked={checked} required={q.required && (q.type !== "checkbox" || q.id === "confirmations")} onChange={() => q.type === "checkbox" ? toggle(option.value) : onChange(option.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy} className="peer sr-only" />
          <span className={`flex h-full min-h-14 items-center gap-3 rounded-xl border border-white/15 bg-white/[0.025] text-sm leading-relaxed transition-[background-color,border-color] duration-300 hover:border-white/30 hover:bg-white/[0.055] peer-checked:border-white/50 peer-checked:bg-white/[0.12] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-white ${q.type === "scale" ? "justify-center px-1 py-3" : "px-4 py-4"}`}>
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
      <div className="relative isolate mt-10 overflow-hidden rounded-2xl border border-white/30 bg-white/[0.07] p-6 shadow-[inset_0_1px_0_#ffffff30,0_20px_40px_-16px_#000000cc] sm:p-9">
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
