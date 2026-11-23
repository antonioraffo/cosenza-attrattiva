"use client";

import { useLayoutEffect } from "react";

/*
 * Next riporta in alto la nuova pagina solo se il suo primo elemento è fuori dalla vista: il primo
 * elemento è l'header, sticky e quindi sempre visibile, e la pagina restava alla vecchia posizione
 * (es. dalla card di un itinerario in fondo alla home). Qui si riporta in cima a ogni nuova pagina,
 * tranne al primo caricamento (il browser ripristina la posizione), con un'ancora (#…) e con
 * avanti/indietro (Next ripristina la posizione salvata).
 */
let firstMount = true;
let historyNavigation = false;
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    historyNavigation = true;
  });
}

export function ScrollReset() {
  useLayoutEffect(() => {
    if (firstMount) {
      firstMount = false;
      return;
    }
    if (historyNavigation) {
      historyNavigation = false;
      return;
    }
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  return null;
}
