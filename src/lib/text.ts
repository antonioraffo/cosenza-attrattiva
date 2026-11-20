/** Markdown → testo semplice (per TTS e anteprime). */
export function stripMarkdown(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>~]+/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/** Divide il testo in frasi (max ~220 caratteri) per una sintesi vocale robusta. */
export function splitSentences(text: string, max = 220): string[] {
  const raw = text.replace(/\s+/g, " ").match(/[^.!?…;:]+[.!?…;:]*["»”’)]*\s*/g) ?? [text];
  const out: string[] = [];
  for (const s of raw.map((x) => x.trim()).filter(Boolean)) {
    if (s.length <= max) {
      out.push(s);
      continue;
    }
    let rest = s;
    while (rest.length > max) {
      const cut = rest.lastIndexOf(",", max) > 40 ? rest.lastIndexOf(",", max) + 1 : rest.lastIndexOf(" ", max);
      out.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    if (rest) out.push(rest);
  }
  return out;
}

export function excerpt(md: string, words = 28): string {
  const plain = stripMarkdown(md).split(/\s+/);
  return plain.length <= words ? plain.join(" ") : `${plain.slice(0, words).join(" ")}…`;
}
