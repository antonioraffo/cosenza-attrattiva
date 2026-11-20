"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { IconCheck, IconDownload } from "@/components/ui/icons";
import { downloadItinerary, isItineraryOffline, removeItinerary } from "@/lib/offline";

type State = "idle" | "loading" | "done" | "error" | "unsupported";

export function OfflineButton({ slug }: { slug: string }) {
  const t = useTranslations("itinerary");
  const [state, setState] = useState<State>("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!("caches" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- capacità del browser nota solo lato client
      setState("unsupported");
      return;
    }
    isItineraryOffline(slug).then((ok) => ok && setState("done"));
  }, [slug]);

  if (state === "unsupported") return null;

  const onClick = async () => {
    if (state === "done") {
      await removeItinerary(slug);
      setState("idle");
      return;
    }
    setState("loading");
    setProgress(0);
    try {
      await downloadItinerary(slug, (p) => setProgress(Math.round(p * 100)));
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "loading"}
      aria-live="polite"
      className="inline-flex min-h-12 items-center gap-2 rounded-full border border-pietra-300 bg-white px-5 text-sm font-semibold text-pietra-800 transition hover:border-pietra-500 disabled:opacity-70"
      title={state === "done" ? t("removeOffline") : undefined}
    >
      {state === "done" ? <IconCheck size={18} className="text-sila-600" /> : <IconDownload size={18} />}
      {state === "loading"
        ? t("downloading", { progress })
        : state === "done"
          ? t("downloaded")
          : state === "error"
            ? t("downloadError")
            : t("downloadOffline")}
    </button>
  );
}
