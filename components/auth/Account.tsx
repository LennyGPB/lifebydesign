"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountForm } from "@/components/auth/AccountForm";
import { Button } from "@/components/ui/Button";
import { GlowBackdrop } from "@/components/ui/GlowBackdrop";
import { panelClass } from "@/components/ui/styles";
import { authClient } from "@/lib/auth-client";
import { getFormuleById } from "@/config/formules";
import type { QuestionnaireResult } from "@/lib/questionnaire";

type Submission = { id: string; createdAt: string; result: QuestionnaireResult };

const benefits = [
  "Retrouve tes questionnaires et tes recommandations.",
  "Envoie tes réponses en toute sécurité.",
  "Prépare ton échange découverte.",
];

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" });

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

  return <div className="relative isolate">
    <GlowBackdrop />
    <div className="shell pt-[calc(var(--nav-height)+1rem)] pb-24 md:pt-[calc(var(--nav-height)+1.5rem)] md:pb-32">
      <Link href="/" className="inline-flex min-h-11 items-center gap-3 text-sm text-text-muted transition-colors hover:text-text"><span aria-hidden="true">←</span> Retour au site</Link>

      {isPending ? <div role="status" className="mx-auto mt-10 max-w-4xl"><span className="sr-only">Chargement de ton espace…</span><Skeleton className="h-16 w-64" /><Skeleton className="mt-10 h-32 w-full" /></div>
        : sessionError ? <div className={`${panelClass} mx-auto mt-10 max-w-xl p-8`}><p role="alert" className="font-display text-2xl">Ton espace est momentanément inaccessible.</p><button type="button" onClick={() => void refetch()} className="mt-4 min-h-11 cursor-pointer text-sm underline underline-offset-4">Réessayer</button></div>
        : !session ? <div className="mx-auto grid max-w-6xl items-center gap-12 py-6 lg:grid-cols-[1fr_28rem] lg:gap-20 lg:py-12">
          <div>
            <p className="eyebrow flex items-center gap-3 text-text-muted"><span aria-hidden="true" className="h-px w-8 bg-accent" />Espace membre</p>
            <h1 className="mt-6 font-display text-[clamp(3rem,6vw,5rem)] leading-[1.02] tracking-[-0.025em]"><span className="block font-extralight italic">Ton espace.</span>Ton parcours.</h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-text-muted md:text-lg">Connecte-toi ou crée ton compte en quelques secondes.</p>
            <ul className="mt-9 hidden space-y-4 sm:block">
              {benefits.map(item => <li key={item} className="flex items-center gap-4 text-sm text-text/85"><span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" className="size-3"><path d="m3 8 3 3 7-7" /></svg></span>{item}</li>)}
            </ul>
          </div>
          <div className={`${panelClass} p-6 sm:p-8`}>
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-10 -top-px h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />
            <AccountForm onSuccess={async () => { await refetch(); }} />
          </div>
        </div>
        : <div className="mx-auto mt-6 max-w-4xl md:mt-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              <span aria-hidden="true" className="flex size-16 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.07] font-display text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">{(session.user.name || session.user.email).trim().charAt(0).toUpperCase()}</span>
              <div className="min-w-0">
                <p className="eyebrow text-text-muted">Mon compte</p>
                <h1 className="mt-2 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-none tracking-[-0.025em]">Bonjour {session.user.name}.</h1>
                <p className="mt-2 text-sm break-all text-text-muted">{session.user.email}</p>
              </div>
            </div>
            <button type="button" disabled={signingOut} onClick={() => void signOut()} className="min-h-11 cursor-pointer rounded-full border border-white/10 px-5 text-sm text-text-muted transition-colors hover:border-white/25 hover:text-text disabled:opacity-50">{signingOut ? "Déconnexion…" : "Me déconnecter"}</button>
          </div>

          <div className="mt-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
            <h2 className="font-display text-3xl">Mes questionnaires</h2>
            {submissions?.length ? <p className="text-sm tabular-nums text-text-muted">{submissions.length} envoyé{submissions.length > 1 ? "s" : ""}</p> : null}
          </div>

          {error ? <div className="mt-6 rounded-xl border border-[#dbb5a0]/30 bg-[#dbb5a0]/5 p-5"><p role="alert" className="text-sm text-[#e9c4b0]">{error}</p><button type="button" onClick={() => { setError(""); setReload(value => value + 1); }} className="mt-3 min-h-11 cursor-pointer text-sm underline underline-offset-4">Réessayer</button></div>
            : submissions === null ? <div role="status" className="mt-6 grid gap-4 sm:grid-cols-2"><span className="sr-only">Chargement de tes questionnaires…</span><Skeleton className="h-44" /><Skeleton className="h-44" /></div>
            : submissions.length === 0 ? <div className={`${panelClass} mt-6 p-8 sm:p-10`}>
              <span aria-hidden="true" className="glass-flow glass-soft" />
              <p className="font-display text-2xl">Aucun questionnaire pour l’instant.</p>
              <p className="mt-3 max-w-md leading-relaxed text-text-muted">Prends quelques minutes pour découvrir l’accompagnement qui te correspond.</p>
              <Button href="/questionnaire" animated className="mt-8">Remplir le questionnaire</Button>
            </div>
            : <>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">{submissions.map(submission => {
                const formule = submission.result.status === "recommended" ? getFormuleById(submission.result.formuleId) : null;
                return <li key={submission.id} className={`${panelClass} flex flex-col p-6 sm:p-7`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={`eyebrow rounded-full border px-3 py-1.5 ${formule ? "border-white/25 bg-white/[0.08] text-text" : "border-white/10 text-text-muted"}`}>{formule ? "Recommandé" : "Pas maintenant"}</span>
                    <time dateTime={submission.createdAt} className="text-xs text-text-muted">{dateFormat.format(new Date(submission.createdAt))}</time>
                  </div>
                  <h3 className="mt-6 font-display text-2xl">{formule ? formule.nom : "Les conditions pour commencer"}</h3>
                  {submission.result.status === "recommended" ? <p className="mt-3 text-sm leading-relaxed text-text-muted">{submission.result.reasons.join(" ")}</p> : <p className="mt-3 text-sm leading-relaxed text-text-muted">Questionnaire reçu et lié à ton compte.</p>}
                </li>;
              })}</ul>
              <Button href="/questionnaire" variant="secondary" size="md" className="mt-8">Remplir un nouveau questionnaire</Button>
            </>}
        </div>}
    </div>
  </div>;
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-2xl bg-white/[0.05] motion-reduce:animate-none ${className}`} />;
}
