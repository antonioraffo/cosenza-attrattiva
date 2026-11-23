/**
 * Icone dei tre pilastri del masterplan, ricavate dalle forme del simbolo "Cosenza attrattiva"
 * (public/brand/mark.svg): ellisse viola = Vive, forma arancio = Crea, goccia azzurra = Connect.
 * Sempre decorative: l'etichetta testuale accanto porta il significato.
 */
export type Pillar = "vive" | "connect" | "crea";

export const PILLAR_COLOR: Record<Pillar, string> = {
  vive: "#9c37b5",
  connect: "#1a98c4",
  crea: "#dd7b19",
};

const SHAPES: Record<Pillar, { viewBox: string; shape: React.ReactNode }> = {
  vive: {
    viewBox: "308 436 126 124",
    shape: <ellipse cx="370.75" cy="497.43" rx="49.34" ry="57.15" transform="translate(-245.41 569.79) rotate(-60)" />,
  },
  connect: {
    viewBox: "640 580 128 128",
    shape: <path d="M760.85,653.01c7.1,193.37-213.5-41.9-65.85-65.86,36.37,0,64.52,29.52,65.85,65.86Z" />,
  },
  crea: {
    viewBox: "520 340 210 200",
    shape: <path d="M714.75,374.31c48.9,54.94-80.62,215.24-153.38,114.95-84.89-117.49,78.53-199.05,153.38-114.95Z" />,
  },
};

export function PillarIcon({ pillar, size = 22, className = "" }: { pillar: Pillar; size?: number; className?: string }) {
  const { viewBox, shape } = SHAPES[pillar];
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      fill={PILLAR_COLOR[pillar]}
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    >
      {shape}
    </svg>
  );
}
