/* eslint-disable @next/next/no-img-element -- SVG vettoriale statico: next/image non porta benefici */

/** Marchio ufficiale "Cosenza attrattiva" (versione orizzontale, positivo o negativo). */
export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <img
      src={light ? "/brand/logo-h-white.svg" : "/brand/logo-h.svg"}
      alt="Cosenza attrattiva"
      width={130}
      height={41}
      className={`h-10 w-auto ${className}`}
    />
  );
}

/** Variante verticale con il pilastro turistico "Connect". */
export function LogoConnect({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <img
      src={light ? "/brand/logo-connect-white.svg" : "/brand/logo-connect.svg"}
      alt="Cosenza attrattiva Connect"
      width={120}
      height={139}
      loading="lazy"
      className={className}
    />
  );
}
