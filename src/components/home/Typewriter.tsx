/**
 * Testo predisposto per l'effetto "macchina da scrivere" allo scroll (vedi effects/panels.ts):
 * una copia integra per le tecnologie assistive e una visiva, nascosta, spezzata in caratteri.
 * Senza JavaScript o con movimento ridotto il testo è semplicemente visibile.
 */
export function Typewriter({ text }: { text: string }) {
  return (
    <>
      <span className="home-typewriter-accessible">{text}</span>
      <span className="home-scroll-title-mask" aria-hidden="true">
        <span className="home-scroll-title-inner">
          {text.split(/(\s+)/).map((token, i) =>
            !token ? null : /^\s+$/.test(token) ? (
              token
            ) : (
              <span key={i} className="home-typewriter-word">
                {Array.from(token).map((ch, j) => (
                  <span key={j} className="home-typewriter-character">
                    {ch}
                  </span>
                ))}
              </span>
            ),
          )}
        </span>
      </span>
    </>
  );
}
