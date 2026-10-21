"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { fieldClass, glassAction } from "@/components/ui/styles";

const labelClass = "mb-2 block text-sm text-text/90";

export function AccountForm({ initialEmail = "", initialName = "", questionnaire = false, onSuccess, onBusyChange }: {
  initialEmail?: string;
  initialName?: string;
  questionnaire?: boolean;
  onSuccess: (created: boolean) => Promise<void> | void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [mode, setMode] = useState<"signup" | "signin">(questionnaire ? "signup" : "signin");
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const reducedMotion = useReducedMotion();
  const signup = mode === "signup";
  const longEnough = password.length >= 12;
  const matches = confirmation.length > 0 && confirmation === password;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    if (signup && password !== confirmation) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setPending(true);
    onBusyChange?.(true);
    try {
      const response = signup
        ? await authClient.signUp.email({ email: email.trim().toLowerCase(), password, name: name.trim() })
        : await authClient.signIn.email({ email: email.trim().toLowerCase(), password });
      if (response.error) {
        const code = response.error.code;
        setError(response.error.status === 429
          ? "Trop de tentatives. Patiente une minute avant de réessayer."
          : code === "USER_ALREADY_EXISTS" || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
            ? questionnaire ? "Ce compte existe déjà. Choisis « Me connecter » pour envoyer tes réponses." : "Ce compte existe déjà. Choisis « Me connecter »."
            : code === "PASSWORD_TOO_SHORT" ? "Choisis un mot de passe d’au moins 12 caractères."
              : !signup ? "Connexion impossible. Vérifie ton e-mail et ton mot de passe."
                : "Le compte n’a pas pu être créé. Vérifie tes informations et réessaie.");
        return;
      }
      setPassword("");
      setConfirmation("");
      await onSuccess(signup);
    } catch {
      setError(questionnaire ? "La connexion a été interrompue. Réessaie dans un instant. Tes réponses sont toujours dans ce parcours." : "La connexion a été interrompue. Réessaie dans un instant.");
    } finally { setPending(false); onBusyChange?.(false); }
  }

  return <div>
    <div className="mb-8 grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.03] p-1" aria-label="Accès au compte" role="group">
      {(["signup", "signin"] as const).map(value => <button key={value} type="button" disabled={pending} aria-pressed={mode === value}
        onClick={() => { setMode(value); setError(""); setPassword(""); setConfirmation(""); }}
        className={`relative min-h-11 cursor-pointer rounded-full px-3 text-sm transition-colors duration-300 disabled:opacity-50 ${mode === value ? "text-text" : "text-text-muted hover:text-text"}`}>
        {mode === value ? <motion.span layoutId="account-mode" aria-hidden="true" transition={reducedMotion ? { duration: 0 } : { type: "spring", bounce: 0.15, duration: 0.5 }}
          className="absolute inset-0 rounded-full border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" /> : null}
        <span className="relative">{value === "signup" ? "Créer mon compte" : "Me connecter"}</span>
      </button>)}
    </div>
    <form onSubmit={submit} aria-busy={pending}>
      <fieldset disabled={pending} className="space-y-5">
        <legend className="sr-only">{signup ? "Inscription" : "Connexion"}</legend>
        {signup ? <div><label htmlFor="account-name" className={labelClass}>Ton prénom</label><input id="account-name" name="name" autoComplete="given-name" required maxLength={80} value={name} onChange={event => setName(event.target.value)} className={fieldClass} /></div> : null}
        <div><label htmlFor="account-email" className={labelClass}>Ton adresse e-mail</label><input id="account-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="toi@exemple.com" className={fieldClass} /></div>
        <div>
          <label htmlFor="account-password" className={labelClass}>{signup ? "Choisis ton mot de passe" : "Ton mot de passe"}</label>
          <div className="relative">
            <input id="account-password" name="password" type={visible ? "text" : "password"} autoComplete={signup ? "new-password" : "current-password"} required minLength={signup ? 12 : undefined} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} aria-describedby={signup ? "password-hint" : undefined} className={`${fieldClass} pr-24`} />
            <button type="button" onClick={() => setVisible(!visible)} aria-controls="account-password" aria-pressed={visible} className="absolute inset-y-1.5 right-1.5 min-w-11 cursor-pointer rounded-lg px-3 text-xs text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text">{visible ? "Masquer" : "Afficher"}</button>
          </div>
          {signup ? <p id="password-hint" className={`mt-2 flex items-center gap-2 text-xs leading-relaxed transition-colors ${longEnough ? "text-text" : "text-text-muted"}`}>
            <Check on={longEnough} />12 caractères minimum{password ? <span className="tabular-nums text-text-muted">· {password.length}/12</span> : null}. Une phrase facile à retenir fonctionne très bien.
          </p> : null}
        </div>
        {signup ? <div>
          <label htmlFor="account-confirmation" className={labelClass}>Confirme ton mot de passe</label>
          <input id="account-confirmation" name="confirmation" type={visible ? "text" : "password"} autoComplete="new-password" required maxLength={128} value={confirmation} onChange={event => setConfirmation(event.target.value)} className={fieldClass} />
          {confirmation ? <p className={`mt-2 flex items-center gap-2 text-xs ${matches ? "text-text" : "text-text-muted"}`}><Check on={matches} />{matches ? "Les mots de passe correspondent." : "Les mots de passe ne correspondent pas encore."}</p> : null}
        </div> : null}
        {error ? <p role="alert" className="rounded-xl border border-[#dbb5a0]/30 bg-[#dbb5a0]/5 p-4 text-sm leading-relaxed text-[#e9c4b0]">{error}</p> : null}
        <button type="submit" className={`${glassAction} w-full`}>
          <span aria-hidden="true" className="glass-flow" />
          {pending ? <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/25 border-t-white motion-reduce:animate-none" /> : null}
          {pending ? questionnaire ? "Connexion et envoi en cours…" : "Connexion en cours…" : questionnaire ? signup ? "Créer mon compte et envoyer" : "Me connecter et envoyer" : signup ? "Créer mon compte" : "Me connecter"}
          {pending ? null : <span aria-hidden="true">→</span>}
        </button>
      </fieldset>
      {signup ? <p className="mt-5 text-center text-xs leading-relaxed text-text-muted">Tes informations servent à gérer ton compte et ton questionnaire. <Link href="/confidentialite" className="underline underline-offset-4 hover:text-text">Confidentialité</Link>.</p> : null}
    </form>
  </div>;
}

function Check({ on }: { on: boolean }) {
  return <span aria-hidden="true" className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? "border-text bg-text text-bg" : "border-text-muted/50"}`}>
    {on ? <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-2.5"><path d="m3 8 3 3 7-7" /></svg> : null}
  </span>;
}
