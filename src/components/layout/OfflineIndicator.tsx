"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { IconWifiOff } from "@/components/ui/icons";

const subscribe = (cb: () => void) => {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
};

export function OfflineIndicator() {
  const t = useTranslations("footer");
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  if (online) return null;
  return (
    <div role="status" className="fixed inset-x-0 top-0 z-[70] flex items-center justify-center gap-2 bg-primario-700 px-4 py-2 text-sm text-white">
      <IconWifiOff size={16} /> {t("offline")}
    </div>
  );
}
