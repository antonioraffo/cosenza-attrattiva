"use client";

import { SerwistProvider } from "@serwist/turbopack/react";

/** Registra il service worker (solo in produzione: in dev l'HMR non convive con la cache). */
export function PwaProvider({ children }: { children: React.ReactNode }) {
  return (
    <SerwistProvider swUrl="/serwist/sw.js" disable={process.env.NODE_ENV !== "production"} options={{ scope: "/" }}>
      {children}
    </SerwistProvider>
  );
}
