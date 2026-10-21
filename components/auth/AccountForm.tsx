"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

const inputClass = "mt-2 w-full rounded-xl border border-line bg-white/[0.04] px-4 py-4 text-base outline-none focus:border-text";

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
  const signup = mode === "signup";

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
    <div className="mb-8 flex gap-6 border-b border-line" aria-label="Accès au compte">
      {(["signup", "signin"] as const).map(value => <button key={value} type="button" disabled={pending} aria-pressed={mode === value}
        onClick={() => { setMode(value); setError(""); setPassword(""); setConfirmation(""); }}
        className={`min-h-12 cursor-pointer border-b px-1 pb-3 text-sm transition-colors disabled:opacity-50 ${mode === value ? "border-text text-text" : "border-transparent text-text-muted hover:text-text"}`}>
        {value === "signup" ? "Créer mon compte" : "Me connecter"}
      </button>)}
    </div>
    <form onSubmit={submit} aria-busy={pending}>
      <fieldset disabled={pending} className="space-y-5">
        <legend className="sr-only">{signup ? "Inscription" : "Connexion"}</legend>
        {signup ? <div><label htmlFor="account-name" className="text-sm">Ton prénom</label><input id="account-name" name="name" autoComplete="given-name" required maxLength={80} value={name} onChange={event => setName(event.target.value)} className={inputClass} /></div> : null}
        <div><label htmlFor="account-email" className="text-sm">Ton adresse e-mail</label><input id="account-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} className={inputClass} /></div>
        <div>
          <div className="flex items-center justify-between gap-4"><label htmlFor="account-password" className="text-sm">{signup ? "Choisis ton mot de passe" : "Ton mot de passe"}</label><button type="button" onClick={() => setVisible(!visible)} aria-controls="account-password" aria-pressed={visible} className="min-h-11 cursor-pointer text-xs text-text-muted hover:text-text">{visible ? "Masquer" : "Afficher"}</button></div>
          <input id="account-password" name="password" type={visible ? "text" : "password"} autoComplete={signup ? "new-password" : "current-password"} required minLength={signup ? 12 : undefined} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} aria-describedby={signup ? "password-hint" : undefined} className={inputClass} />
          {signup ? <p id="password-hint" className="mt-2 text-xs leading-relaxed text-text-muted">12 caractères minimum. Tu peux utiliser une phrase facile à retenir.</p> : null}
        </div>
        {signup ? <div><label htmlFor="account-confirmation" className="text-sm">Confirme ton mot de passe</label><input id="account-confirmation" name="confirmation" type={visible ? "text" : "password"} autoComplete="new-password" required maxLength={128} value={confirmation} onChange={event => setConfirmation(event.target.value)} className={inputClass} /></div> : null}
        {error ? <p role="alert" className="text-sm leading-relaxed text-[#e9c4b0]">{error}</p> : null}
        <button type="submit" className="flex min-h-14 w-full cursor-pointer items-center justify-center rounded-full bg-text px-6 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-50">
          {pending ? questionnaire ? "Connexion et envoi en cours…" : "Connexion en cours…" : questionnaire ? signup ? "Créer mon compte et envoyer" : "Me connecter et envoyer" : signup ? "Créer mon compte" : "Me connecter"}
        </button>
      </fieldset>
      {signup ? <p className="mt-5 text-xs leading-relaxed text-text-muted">Tes informations servent à gérer ton compte et ton questionnaire. <Link href="/confidentialite" className="underline underline-offset-4 hover:text-text">Confidentialité</Link>.</p> : null}
    </form>
  </div>;
}
