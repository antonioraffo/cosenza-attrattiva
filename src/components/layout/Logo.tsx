/** Wordmark "Vivi Cosenza · Attrattiva": monogramma ad arco (Ponte, Duomo) + logotipo serif. */
export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill={light ? "#f7f3ed" : "#6e1b33"} />
        <path d="M6 23c3-9 7-13 10-13s7 4 10 13" fill="none" stroke={light ? "#6e1b33" : "#e3c58f"} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M16 10V6" stroke={light ? "#6e1b33" : "#e3c58f"} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M5 26h22" stroke={light ? "#2f6244" : "#8fb59b"} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="leading-none">
        <span className={`block text-[10px] font-semibold tracking-[0.22em] uppercase ${light ? "text-oro-300" : "text-magliocco-600"}`}>
          Vivi Cosenza
        </span>
        <span className={`block font-serif text-[17px] ${light ? "text-white" : "text-pietra-900"}`}>Attrattiva</span>
      </span>
    </span>
  );
}
