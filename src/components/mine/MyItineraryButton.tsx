"use client";

/* eslint-disable @next/next/no-img-element -- miniature già ottimizzate in public/media */
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { tr } from "@/lib/i18n";
import { clearSaved, moveSaved, myItinerary, shareParam, toggleSaved } from "@/lib/stores/my-itinerary";
import { IconArrowRight, IconClose } from "@/components/ui/icons";
import { createStore } from "@/lib/stores/create-store";
import { usePlaces } from "./useSavedPlaces";

/** Pannello unico per tutta la pagina (aperto dall'header o dal menu mobile). */
const drawer = createStore({ open: false });
const setOpen = (open: boolean) => drawer.set(() => ({ open }));

/** Link WhatsApp con l'elenco delle tappe e il collegamento all'itinerario condiviso. */
export function whatsappHref(text: string, url: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
}

/**
 * "Il mio itinerario" nell'header (al posto del Passaporto): pulsante con contatore che apre il
 * pannello laterale delle tappe salvate, come nel prototipo "Città da vivere".
 */
export function MyItineraryButton({ block = false, onNavigate }: { block?: boolean; onNavigate?: () => void }) {
  const t = useTranslations("mine");
  const saved = myItinerary.useStore((s) => s.places);
  return (
    <button
      type="button"
      className={block ? "site-header-cta site-header-cta--block" : "site-header-cta"}
      aria-haspopup="dialog"
      onClick={() => {
        onNavigate?.();
        setOpen(true);
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
      </svg>
      <span>{t("open")}</span>
      <span className="ca-count" aria-label={t("count", { count: saved.length })}>
        {saved.length}
      </span>
    </button>
  );
}

/** Pannello laterale con le tappe salvate: ordine, rimozione, condivisione su WhatsApp, svuota. */
export function MyItineraryDrawer() {
  const t = useTranslations("mine");
  const locale = useLocale();
  const saved = myItinerary.useStore((s) => s.places);
  const open = drawer.useStore((s) => s.open);
  const dialog = useRef<HTMLDialogElement>(null);
  const places = usePlaces(open);
  const list = saved.map((slug) => places?.find((p) => p.slug === slug)).filter((p) => p !== undefined);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const shareUrl = typeof window === "undefined" ? "" : `${window.location.origin}/${locale}/mio-itinerario?p=${shareParam(saved)}`;
  const shareText = t("shareText", { places: list.map((p) => tr(p.name, locale).split(" – ")[0]).join(", ") });
  const go = () => setOpen(false);

  return (
    <dialog ref={dialog} className="ca-drawer" aria-labelledby="mine-title" onClose={() => setOpen(false)} onClick={(e) => e.target === dialog.current && setOpen(false)}>
      <div className="ca-drawer-inner">
        <div className="ca-drawer-head">
          <h2 id="mine-title">{t("title")}</h2>
          <button type="button" className="site-icon-button" aria-label={t("close")} onClick={() => setOpen(false)}>
            <IconClose size={22} />
          </button>
        </div>
        {saved.length === 0 ? (
          <div className="ca-drawer-empty">
            <p>{t("empty")}</p>
            <Link href="/esplora" className="ca-heading-action" onClick={go}>
              {t("explore")} <IconArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <ol className="ca-drawer-list">
              {list.map((p, i) => (
                <li key={p.slug}>
                  <span className="ca-drawer-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  {p.image && <img src={p.image} alt="" width={56} height={42} />}
                  <Link href={`/luoghi/${p.slug}`} className="ca-drawer-name" onClick={go}>
                    {tr(p.name, locale).split(" – ")[0]}
                  </Link>
                  <span className="ca-drawer-tools">
                    <button type="button" aria-label={`${t("up")}: ${tr(p.name, locale)}`} disabled={i === 0} onClick={() => moveSaved(p.slug, -1)}>
                      ↑
                    </button>
                    <button type="button" aria-label={`${t("down")}: ${tr(p.name, locale)}`} disabled={i === list.length - 1} onClick={() => moveSaved(p.slug, 1)}>
                      ↓
                    </button>
                    <button type="button" aria-label={`${t("remove")}: ${tr(p.name, locale)}`} onClick={() => toggleSaved(p.slug)}>
                      ×
                    </button>
                  </span>
                </li>
              ))}
            </ol>
            <div className="ca-drawer-actions">
              <Link href="/mio-itinerario" className="ca-drawer-primary" onClick={go}>
                {t("see")}
              </Link>
              <a href={whatsappHref(shareText, shareUrl)} target="_blank" rel="noopener noreferrer" className="ca-drawer-whatsapp">
                {t("share")}
              </a>
              <button type="button" className="ca-drawer-clear" onClick={clearSaved}>
                {t("clear")}
              </button>
            </div>
            <p className="ca-demo-note">{t("localNote")}</p>
          </>
        )}
      </div>
    </dialog>
  );
}
