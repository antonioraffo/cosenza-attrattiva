"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { IconSparkle } from "@/components/ui/icons";

type Result = { answer: string | null; sources: { title: string; href: string; type: string }[] };

export function AskForm() {
  const t = useTranslations("assistant");
  const locale = useLocale();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<Result | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim().length < 3) return;
    setLoading(true);
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, locale }),
      });
      setRes((await r.json()) as Result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <form onSubmit={submit} className="flex gap-2">
        <label htmlFor="ask" className="sr-only">
          {t("title")}
        </label>
        <input
          id="ask"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("placeholder")}
          className="min-h-12 flex-1 rounded-full border border-neutro-300 bg-white px-5 outline-none focus:border-primario-600"
          maxLength={300}
        />
        <button type="submit" disabled={loading} className="min-h-12 rounded-full bg-primario-700 px-6 font-semibold text-white disabled:opacity-60">
          {t("send")}
        </button>
      </form>
      <div aria-live="polite" className="mt-6">
        {res && (
          <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)]">
            <p className="flex gap-2 leading-relaxed text-neutro-800">
              <IconSparkle className="mt-1 shrink-0 text-arancio-700" />
              {res.answer ?? t("noAnswer")}
            </p>
            {res.sources.length > 0 && (
              <>
                <p className="eyebrow mt-5 text-neutro-500">{t("sources")}</p>
                <ul className="mt-2 space-y-1">
                  {res.sources.map((s) => (
                    <li key={s.href + s.title}>
                      <a href={s.href} className="inline-flex min-h-11 items-center font-semibold text-primario-700 hover:underline">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
