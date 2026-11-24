import { defineRouting } from "next-intl/routing";

/**
 * Lingue predisposte: i testi inglesi restano in messages/en.json e nei contenuti.
 * Il sito per ora è monolingua: per riattivare l'inglese basta rimetterlo in `locales`
 * (e ripristinare il LocaleSwitcher nell'header e gli alternates nel layout).
 */
export const AVAILABLE_LOCALES = ["it", "en"] as const;

export const routing = defineRouting({
  locales: ["it"],
  defaultLocale: "it",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
