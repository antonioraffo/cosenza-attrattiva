/*
 * "Macchina da scrivere" allo scroll (porting di scroll-typewriter.js di vivicosenza): una copia
 * integra del testo resta per le tecnologie assistive, quella visiva (aria-hidden) è spezzata in
 * caratteri la cui opacità segue il progresso. La geometria finale del testo è riservata da subito.
 */
const clamp = (v: number) => Math.max(0, Math.min(1, v));

function split(source: HTMLElement) {
  if (source.dataset.typewriterReady) return;
  source.dataset.typewriterReady = "true";
  const doc = source.ownerDocument;
  const text = source.textContent ?? "";
  const accessible = doc.createElement("span");
  accessible.className = "home-typewriter-accessible";
  accessible.textContent = text;
  const mask = doc.createElement("span");
  mask.className = "home-scroll-title-mask";
  mask.setAttribute("aria-hidden", "true");
  const inner = doc.createElement("span");
  inner.className = "home-scroll-title-inner";
  for (const token of text.split(/(\s+)/)) {
    if (!token) continue;
    if (/^\s+$/.test(token)) {
      inner.append(doc.createTextNode(token));
      continue;
    }
    const word = doc.createElement("span");
    word.className = "home-typewriter-word";
    for (const letter of Array.from(token)) {
      const ch = doc.createElement("span");
      ch.className = "home-typewriter-character";
      ch.textContent = letter;
      word.append(ch);
    }
    inner.append(word);
  }
  mask.append(inner);
  source.replaceChildren(accessible, mask);
}

/** Prepara i testi [data-typewriter] dentro `element` e restituisce l'aggiornamento del progresso. */
export function typewriter(element: Element | null) {
  if (!element) return () => {};
  element.querySelectorAll<HTMLElement>("[data-typewriter]").forEach(split);
  const characters = [...element.querySelectorAll<HTMLElement>(".home-typewriter-character")];
  let last = -1;
  return (progress: number) => {
    const count = Math.min(characters.length, Math.floor(clamp(progress) * (characters.length + 1)));
    if (count === last) return;
    last = count;
    characters.forEach((c, i) => (c.style.opacity = i < count ? "1" : "0"));
  };
}
