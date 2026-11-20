import "server-only";
import { sql } from "drizzle-orm";
import { db } from "@/server/db/client";
import { excerpt } from "@/lib/text";

export interface AskSource {
  type: "chapter" | "place";
  title: string;
  href: string;
}

export interface AskAnswer {
  answer: string | null;
  sources: AskSource[];
  provider: string;
}

/**
 * Contratto per l'assistente "Chiedi a Cosenza". L'MVP usa `KeywordProvider`
 * (ricerca full-text sui contenuti). In fase 2 un `LlmRagProvider` potrà recuperare
 * gli stessi passaggi (pgvector) e passarli a un LLM come contesto, citando le fonti.
 */
export interface AnswerProvider {
  name: string;
  answer(question: string, locale: "it" | "en"): Promise<AskAnswer>;
}

type Row = { kind: "chapter" | "place"; slug: string; parent: string | null; title: string; body: string; rank: number };

export const KeywordProvider: AnswerProvider = {
  name: "keyword-fts",
  async answer(question, locale) {
    const cfg = locale === "it" ? sql.raw("'italian'") : sql.raw("'english'");
    const rows = Array.from(
      await db.execute<Row>(sql`
        -- termini in OR (non tutti devono comparire), poi ordinamento per pertinenza
        with q as (select nullif(replace(plainto_tsquery(${cfg}::regconfig, unaccent(${question}))::text, '&', '|'), '')::tsquery as query),
        docs as (
          select 'chapter' as kind, c.id::text as slug, i.slug as parent,
                 c.title->>${locale} as title, c.body->>${locale} as body
          from chapters c join itineraries i on i.id = c.itinerary_id
          union all
          select 'place', p.slug, null, p.name->>${locale}, p.body->>${locale}
          from places p
        )
        select kind, slug, parent, title, body,
               ts_rank(to_tsvector(${cfg}::regconfig, unaccent(title || ' ' || body)), q.query) as rank
        from docs, q
        where to_tsvector(${cfg}::regconfig, unaccent(title || ' ' || body)) @@ q.query
        order by rank desc
        limit 3
      `),
    );
    if (!rows.length) return { answer: null, sources: [], provider: this.name };
    const best = rows[0]!;
    // passaggio più pertinente: il paragrafo che contiene più termini della domanda
    const terms = question.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
    const paragraphs = best.body.split(/\n{2,}/);
    const scored = paragraphs
      .map((p) => ({ p, s: terms.filter((t) => p.toLowerCase().includes(t)).length }))
      .sort((a, b) => b.s - a.s);
    return {
      answer: excerpt(scored[0]?.p ?? best.body, 70),
      sources: rows.map((r) => ({
        type: r.kind,
        title: r.title,
        href: r.kind === "place" ? `/${locale}/luoghi/${r.slug}` : `/${locale}/itinerari/${r.parent}/racconto`,
      })),
      provider: this.name,
    };
  },
};
