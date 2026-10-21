import { NextResponse } from "next/server";
import { isDeepStrictEqual } from "node:util";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cleanAnswers, leadPriority, recommend, validateAnswers } from "@/lib/questionnaire";

const attempts = new Map<string, { count: number; reset: number }>();
const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Origine de la requête invalide." }, { status: 403, headers });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Format de requête invalide." }, { status: 415, headers });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  if (attempts.size > 2000) for (const [key, value] of attempts) if (value.reset < now) attempts.delete(key);
  if (attempts.size > 5000) attempts.delete(attempts.keys().next().value!);
  const rate = attempts.get(ip);
  if (rate && rate.reset > now && rate.count >= 15) {
    return NextResponse.json({ error: "Trop de tentatives. Réessaie dans quelques minutes." }, { status: 429, headers: { ...headers, "Retry-After": "600" } });
  }
  attempts.set(ip, rate && rate.reset > now ? { ...rate, count: rate.count + 1 } : { count: 1, reset: now + 600_000 });
  let body;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 32_000) return NextResponse.json({ error: "Réponses trop volumineuses." }, { status: 413, headers });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "La requête n’est pas lisible." }, { status: 400, headers });
  }
  const answers = cleanAnswers(body?.answers);
  if (!answers || typeof body?.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id)) {
    return NextResponse.json({ error: "Réponses invalides." }, { status: 400, headers });
  }
  if (answers.adult === "no") return NextResponse.json({ result: recommend(answers), saved: false }, { headers });
  const errors = validateAnswers(answers);
  if (Object.keys(errors).length) return NextResponse.json({ errors, error: "Certaines réponses sont à vérifier." }, { status: 422, headers });
  const result = recommend(answers);
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.json({ saved: false, error: "Connecte-toi pour envoyer ton questionnaire." }, { status: 401, headers });
    const existing = await prisma.questionnaireSubmission.findUnique({ where: { id: body.id } });
    if (existing) {
      if (existing.userId !== session.user.id || !isDeepStrictEqual(existing.answers, answers)) {
        return NextResponse.json({ saved: false, error: "Cet envoi ne correspond pas à tes réponses. Recharge le parcours avant de réessayer." }, { status: 409, headers });
      }
      return NextResponse.json({ result: existing.result, saved: true }, { headers });
    }
    await prisma.questionnaireSubmission.create({ data: {
      id: body.id,
      userId: session.user.id,
      firstName: String(answers.firstName),
      email: String(answers.email).toLowerCase(),
      telegram: String(answers.telegram),
      answers,
      result,
      priority: result.status === "blocked" ? "C" : leadPriority(answers),
    } });
  } catch (error) {
    // A concurrent retry may have inserted the same id. The next retry verifies ownership.
    const concurrent = error && typeof error === "object" && "code" in error && error.code === "P2002";
    return NextResponse.json({ result, saved: false, error: concurrent ? "Un envoi est déjà en cours. Réessaie pour confirmer son enregistrement." : "Ta recommandation est prête, mais tes réponses n’ont pas pu être enregistrées. Réessaie l’envoi." }, { status: 503, headers });
  }
  return NextResponse.json({ result, saved: true }, { headers });
}
