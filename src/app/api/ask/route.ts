import { z } from "zod";
import { KeywordProvider } from "@/server/assistant";

export const dynamic = "force-dynamic";

const Body = z.object({
  question: z.string().trim().min(3).max(300),
  locale: z.enum(["it", "en"]).default("it"),
});

/** Stub dell'assistente: nessun dato personale, nessun log delle domande. */
export async function POST(req: Request) {
  if (process.env.NEXT_PUBLIC_FEATURE_ASSISTANT !== "true") {
    return Response.json({ error: "assistente non attivo" }, { status: 404 });
  }
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "richiesta non valida", issues: parsed.error.issues }, { status: 400 });
  const result = await KeywordProvider.answer(parsed.data.question, parsed.data.locale);
  return Response.json(result);
}
