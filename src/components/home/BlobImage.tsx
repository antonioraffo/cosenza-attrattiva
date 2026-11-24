/* eslint-disable @next/next/no-img-element -- foto già ridimensionate in public/media */

/**
 * Foto nella forma organica del marchio con tre macchie di colore intorno (arancio, viola, azzurro),
 * dalla demo «Città da vivere» di Stefano. Le macchie fluttuano piano (8–10 s, come nella demo);
 * con prefers-reduced-motion restano ferme. `variant` cambia forma della foto e posizione delle macchie.
 */
const VARIANTS = [
  {
    shape: "41% 59% 46% 54% / 47% 42% 58% 53%",
    blobs: [
      { color: "arancio", style: { right: "1%", top: 0, width: "27%", aspectRatio: "1.1", borderRadius: "55% 45% 52% 48% / 48% 56% 44% 52%" }, motion: "a" },
      { color: "viola", style: { left: 0, top: "30%", width: "17%", aspectRatio: "1.1", borderRadius: "45% 55% 42% 58% / 55% 45% 55% 45%" }, motion: "b" },
      { color: "azzurro", style: { right: "4%", bottom: 0, width: "21%", aspectRatio: "0.9", borderRadius: "46% 54% 60% 40% / 50% 44% 56% 50%" }, motion: "c" },
    ],
  },
  {
    shape: "56% 44% 40% 60% / 42% 56% 44% 58%",
    blobs: [
      { color: "viola", style: { left: "2%", top: "2%", width: "24%", aspectRatio: "1", borderRadius: "48% 52% 58% 42% / 52% 46% 54% 48%" }, motion: "b" },
      { color: "azzurro", style: { right: 0, top: "38%", width: "16%", aspectRatio: "1.1", borderRadius: "52% 48% 44% 56% / 46% 54% 46% 54%" }, motion: "a" },
      { color: "arancio", style: { left: "8%", bottom: "1%", width: "20%", aspectRatio: "0.95", borderRadius: "58% 42% 50% 50% / 44% 52% 48% 56%" }, motion: "c" },
    ],
  },
  {
    shape: "48% 52% 58% 42% / 55% 46% 54% 45%",
    blobs: [
      { color: "azzurro", style: { right: "6%", top: "1%", width: "22%", aspectRatio: "1.05", borderRadius: "46% 54% 50% 50% / 56% 44% 56% 44%" }, motion: "c" },
      { color: "arancio", style: { left: "1%", bottom: "12%", width: "19%", aspectRatio: "1.1", borderRadius: "55% 45% 52% 48% / 48% 56% 44% 52%" }, motion: "a" },
      { color: "viola", style: { right: "1%", bottom: "4%", width: "15%", aspectRatio: "0.9", borderRadius: "45% 55% 42% 58% / 55% 45% 55% 45%" }, motion: "b" },
    ],
  },
] as const;

export function BlobImage({
  src,
  alt,
  position = "50% 50%",
  variant = 0,
}: {
  src: string;
  alt: string;
  position?: string;
  variant?: 0 | 1 | 2;
}) {
  const v = VARIANTS[variant];
  return (
    <div className="ca-blob">
      {v.blobs.map((b, i) => (
        <span key={i} aria-hidden="true" className={`ca-blob-spot ca-blob-spot--${b.color} ca-blob-float-${b.motion}`} style={b.style} />
      ))}
      <div className="ca-blob-photo" style={{ borderRadius: v.shape }}>
        <img src={src} alt={alt} loading="lazy" decoding="async" style={{ objectPosition: position }} />
      </div>
    </div>
  );
}
