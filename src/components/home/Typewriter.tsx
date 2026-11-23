/**
 * Testo predisposto per l'effetto "macchina da scrivere" allo scroll. Il server invia il testo
 * semplice; effects/typewriter.ts lo spezza in caratteri sul client dopo l'idratazione, come
 * scroll-typewriter.js di vivicosenza (centinaia di <span> in meno da idratare).
 * Senza JavaScript o con movimento ridotto il testo resta semplicemente visibile.
 */
export function Typewriter({ text }: { text: string }) {
  return <span data-typewriter>{text}</span>;
}
