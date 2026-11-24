"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Origine del sito per i link da condividere: vuota nel render del server, così l'idratazione combacia. */
export const useOrigin = () => useSyncExternalStore(noop, () => window.location.origin, () => "");
