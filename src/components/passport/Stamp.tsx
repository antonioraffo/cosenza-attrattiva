/** Timbro circolare in stile postale, generato in SVG (testo curvo con il nome del luogo). */
export function Stamp({
  name,
  date,
  color = "#0f7663",
  size = 120,
  animate = false,
  muted = false,
}: {
  name: string;
  date?: string;
  color?: string;
  size?: number;
  animate?: boolean;
  muted?: boolean;
}) {
  const id = `arc-${name.replace(/[^a-z0-9]/gi, "").slice(0, 24)}-${size}`;
  const label = name.length > 30 ? `${name.slice(0, 28)}…` : name;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={name}
      className={`${animate ? "motion-safe:animate-[stamp-in_.6s_cubic-bezier(.2,.8,.2,1)_both]" : ""} ${muted ? "opacity-25 grayscale" : ""}`}
      style={{ transform: "rotate(-8deg)" }}
    >
      <defs>
        <path id={id} d="M60 60 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0" />
        <filter id={`${id}-rough`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
        </filter>
      </defs>
      <g filter={`url(#${id}-rough)`} fill="none" stroke={color} opacity="0.92">
        <circle cx="60" cy="60" r="56" strokeWidth="3" />
        <circle cx="60" cy="60" r="50" strokeWidth="1.2" />
        <circle cx="60" cy="60" r="31" strokeWidth="1.2" />
        <text fill={color} stroke="none" fontSize="10.5" fontWeight="700" letterSpacing="1.6" style={{ fontFamily: "var(--font-sans)" }}>
          <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
            {label.toUpperCase()}
          </textPath>
        </text>
        <path d="M44 66c4.5-9 9.5-13 16-13s11.5 4 16 13" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M60 53v-6M42 70h36" strokeWidth="2.2" strokeLinecap="round" />
        <text x="60" y="84" fill={color} stroke="none" fontSize="7.5" fontWeight="600" textAnchor="middle" letterSpacing="1.2" style={{ fontFamily: "var(--font-sans)" }}>
          {date ?? "COSENZA"}
        </text>
      </g>
    </svg>
  );
}
