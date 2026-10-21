"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountForm } from "@/components/auth/AccountForm";
import { authClient } from "@/lib/auth-client";
import { getFormuleById } from "@/config/formules";
import type { QuestionnaireResult } from "@/lib/questionnaire";

type Submission = { id: string; createdAt: string; result: QuestionnaireResult };

export function Account() {
  const { data: session, isPending, error: sessionError, refetch } = authClient.useSession();
  const [loaded, setLoaded] = useState<{ userId: string; submissions: Submission[] } | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [signingOut, setSigningOut] = useState(false);
  const userId = session?.user.id;
  const submissions = loaded?.userId === userId ? loaded?.submissions ?? null : null;

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    void fetch("/api/compte/questionnaires", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setLoaded({ userId, submissions: data.submissions });
      }).catch(failure => {
        if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "Chargement impossible. Réessaie.");
      });
    return () => controller.abort();
  }, [userId, reload]);

  async function signOut() {
    setSigningOut(true);
    setError("");
    try {
      const response = await authClient.signOut();
      if (response.error) throw new Error();
      setLoaded(null);
    } catch { setError("La déconnexion a échoué. Réessaie."); }
    finally { setSigningOut(false); }
  }

  return <div className="shell pt-[calc(var(--nav-height)+3rem)] pb-24">
    <div className="mx-auto max-w-2xl">
      <Link href="/" className="inline-flex min-h-11 items-center text-sm text-text-muted hover:text-text">Retour au site</Link>
      <h1 className="mt-6 font-display text-5xl tracking-[-0.025em]">Mon compte.</h1>
      {isPending ? <p role="status" className="mt-8 text-text-muted">Chargement de ton espace…</p> : sessionError ? <div className="mt-8"><p role="alert">Ton espace est momentanément inaccessible.</p><button type="button" onClick={() => void refetch()} className="mt-4 min-h-11 cursor-pointer underline underline-offset-4">Réessayer</button></div> : !session ? <div className="mt-8"><p className="mb-8 leading-relaxed text-text-muted">Connecte-toi pour retrouver tes questionnaires et tes recommandations.</p><AccountForm onSuccess={async () => { await refetch(); }} /></div> : <>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6"><p className="text-text-muted">Bonjour {session.user.name}.<span className="mt-1 block text-sm break-all">{session.user.email}</span></p><button type="button" disabled={signingOut} onClick={() => void signOut()} className="min-h-11 cursor-pointer text-sm underline underline-offset-4 disabled:opacity-50">{signingOut ? "Déconnexion…" : "Me déconnecter"}</button></div>
        <h2 className="mt-10 font-display text-3xl">Mes questionnaires</h2>
        {error ? <div className="mt-6"><p role="alert" className="text-sm text-[#e9c4b0]">{error}</p><button type="button" onClick={() => { setError(""); setReload(value => value + 1); }} className="mt-3 min-h-11 cursor-pointer text-sm underline underline-offset-4">Réessayer</button></div> : submissions === null ? <p role="status" className="mt-6 text-text-muted">Chargement de tes questionnaires…</p> : submissions.length === 0 ? <p className="mt-6 leading-relaxed text-text-muted">Tu n’as pas encore envoyé de questionnaire. Prends quelques minutes pour découvrir l’accompagnement qui te correspond.</p> : <ul className="mt-6 divide-y divide-line">{submissions.map(submission => {
          const formule = submission.result.status === "recommended" ? getFormuleById(submission.result.formuleId) : null;
          return <li key={submission.id} className="py-6"><p className="text-sm text-text-muted">Envoyé le {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" }).format(new Date(submission.createdAt))}</p><h3 className="mt-2 font-display text-2xl">{formule ? formule.nom : "Les conditions pour commencer"}</h3><p className="mt-2 text-sm leading-relaxed text-text-muted">Questionnaire reçu et lié à ton compte.</p>{submission.result.status === "recommended" ? <p className="mt-3 text-sm leading-relaxed text-text-muted">{submission.result.reasons.join(" ")}</p> : null}</li>;
        })}</ul>}
        <Link href="/questionnaire" className="mt-8 inline-flex min-h-12 items-center rounded-full border border-line px-6 text-sm transition-colors hover:bg-white/5">Remplir un questionnaire</Link>
      </>}
    </div>
  </div>;
}
