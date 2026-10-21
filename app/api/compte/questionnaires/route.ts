import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.json({ error: "Connecte-toi pour consulter tes questionnaires." }, { status: 401, headers });
    const submissions = await prisma.questionnaireSubmission.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, createdAt: true, result: true },
    });
    return NextResponse.json({ submissions }, { headers });
  } catch {
    return NextResponse.json({ error: "Tes questionnaires ne sont pas accessibles pour le moment. Réessaie dans un instant." }, { status: 503, headers });
  }
}
