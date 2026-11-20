"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { IconClose } from "@/components/ui/icons";

/** Dialog a tutto schermo per le esperienze immersive (focus trap via <dialog> nativo). */
export function FullscreenModal({
  title,
  onClose,
  children,
  dark = true,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  dark?: boolean;
}) {
  const t = useTranslations("immersive");
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className={`fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none p-0 ${dark ? "bg-neutro-950 text-white" : "bg-neutro-50"} backdrop:bg-black/70`}
    >
      <div className="relative size-full">
        {children}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent p-3 pt-[max(.75rem,env(safe-area-inset-top))]">
          <h2 className="truncate pl-2 font-display text-lg text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto grid size-11 shrink-0 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
            aria-label={t("close")}
          >
            <IconClose />
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
