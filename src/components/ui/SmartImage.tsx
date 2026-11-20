import Image from "next/image";
import type { MediaItem } from "@/server/queries";
import { tr } from "@/lib/i18n";

/**
 * Immagine da DB con fallback illustrato (SVG generato) se il media manca.
 * `fill` richiede un contenitore posizionato.
 */
export function SmartImage({
  media,
  locale,
  sizes,
  priority = false,
  className = "object-cover",
  fallbackColor = "#6e1b33",
  fallbackLabel,
}: {
  media: MediaItem | null | undefined;
  locale: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  fallbackColor?: string;
  fallbackLabel?: string;
}) {
  if (!media) return <PlaceholderArt color={fallbackColor} label={fallbackLabel} />;
  return (
    <Image
      src={media.url}
      alt={tr(media.alt, locale)}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}

/** Illustrazione astratta: colline della Sila, il fiume, l'arco del ponte. */
export function PlaceholderArt({ color, label }: { color: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`sky-${color.slice(1)}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor="#1f1a16" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#sky-${color.slice(1)})`} />
      <circle cx="300" cy="90" r="34" fill="#e3c58f" opacity=".85" />
      <path d="M0 210 Q80 150 160 190 T320 170 T400 180 V300 H0Z" fill="#244c35" opacity=".9" />
      <path d="M0 240 Q100 200 200 235 T400 225 V300 H0Z" fill="#122a1c" />
      <path d="M40 300 C120 255 260 270 360 300" stroke="#8fb59b" strokeWidth="3" fill="none" opacity=".6" />
    </svg>
  );
}
