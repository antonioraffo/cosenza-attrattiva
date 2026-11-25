# Blocco «La mission» (rimosso dalla home il 25/11/2026)

Il blocco presentava la mission del masterplan e i tre pilastri (Vive, Connect, Crea) in blocchi
immagine + testo alternati. È stato tolto dalla home, ma **il codice è ancora nel progetto, inutilizzato**:
per rimetterlo basta riaggiungere `<PillarBlocks />` in `src/app/[locale]/page.tsx` (era subito dopo
`<HeroDrawing />`). Ultimo commit con il blocco in home: `a29e24d`.

## File

| Cosa | Dove |
| --- | --- |
| Componente della sezione | `src/components/home/PillarBlocks.tsx` (`PillarBlocks`, componente server) |
| Foto con forma organica e macchie di colore | `src/components/home/BlobImage.tsx` (`BlobImage`, riusabile) |
| CSS | `src/app/home-sections.css`, sezione «Pilastri in home» (copiata qui sotto) |
| Testi | `src/messages/it.json` → `mission.*` (titoli e testi) e `home.pillarImages.*` (testi alternativi) |

## Struttura

```
section#mission.ca-section.ca-section--white.ca-pillars  (aria-labelledby="mission-title")
└─ .site-container
   ├─ .ca-section-heading
   │  ├─ p.eyebrow.ca-section-eyebrow   «La mission»
   │  ├─ h2#mission-title               «Accoglie, crea, connette»
   │  └─ p.ca-section-intro             testo della mission
   └─ .ca-pillar-blocks                 (griglia, gap 56–112 px)
      └─ article#vive|#connect|#crea.ca-pillar-block  [data-pillar] [data-side=right|left|right]
         ├─ .ca-pillar-block-media → BlobImage (foto + 3 macchie)
         └─ .ca-pillar-block-copy
            ├─ p.ca-pillar-block-kicker   «Commercio · Genera economia»
            ├─ h3#pillar-<id>             «Cosenza Vive»
            ├─ p.ca-pillar-block-text
            └─ a.ca-pill-action.ca-pillar-block-cta  (freccia SVG)
```

Gli `id` dei blocchi (`#vive`, `#connect`, `#crea`) erano le ancore del megamenu «Scopri» e del footer;
dopo la rimozione quei link puntano alle pagine dei pilastri (`/eventi`, `/itinerari`, `/fatto-a-cosenza`).

## Layout

- **Desktop (≥ 900 px):** due colonne, immagine e testo affiancati, **alternati**: immagine a **destra**
  (Vive), a **sinistra** (Connect), a **destra** (Crea). Lo decide `data-side` (`i % 2 ? "left" : "right"`).
- **Mobile (< 900 px):** una colonna, immagine sopra e testo sotto.
- Ogni blocco ha il colore del suo pilastro (`--pillar-color`): viola per Vive, azzurro per Connect,
  arancio per Crea, usato nel kicker.

## Immagini

| Pilastro | File | `object-position` | Variante `BlobImage` | Testo alternativo |
| --- | --- | --- | --- | --- |
| Vive | `/media/corso-mazzini-1.jpg` | `40% 50%` | 0 | Corso Mazzini, la via dello shopping di Cosenza, con una scultura del Museo all'Aperto Bilotti e i passanti tra i negozi |
| Connect | `/media/confluenza-crati-busento-1.jpg` | `55% 50%` | 1 | Cosenza vecchia sul colle e la cupola di San Domenico lungo il fiume, dove si incontrano Crati e Busento |
| Crea | `/media/corso-telesio-3.jpg` | `50% 45%` | 2 | Una piccola bottega con le merci esposte sull'ingresso, in una strada del centro storico |

`BlobImage` (dalla demo «Città da vivere» di Stefano): la foto è ritagliata in una forma organica con
`border-radius` a otto valori, diversa per ogni variante; intorno ci sono tre macchie di colore (arancio,
viola, azzurro) in posizioni diverse per variante, che fluttuano piano (animazioni di 9, 8 e 10 s). Con
`prefers-reduced-motion` restano ferme.

## Testi

- **Eyebrow:** La mission
- **Titolo:** Accoglie, crea, connette
- **Testo:** Cosenza non è solo una città da visitare: è una città da vivere, che accoglie, crea e connette. Il masterplan «Cosenza Città Attrattiva» integra commercio, turismo, cultura e artigianato per rafforzare l'identità della città, sostenere le imprese locali e attrarre visitatori, investimenti e nuove opportunità.

| Pilastro | Kicker · tagline | Titolo | Testo | Pulsante → destinazione |
| --- | --- | --- | --- | --- |
| Vive | Commercio · Genera economia | Cosenza Vive | Il commercio urbano diventa esperienza: piazze del commercio, percorsi tematici come la Via del Gusto, la Via dell'Arte e la Via dei Mestieri, eventi che rendono la città viva tutto l'anno. | Scopri gli eventi → `/eventi` |
| Connect | Turismo · Porta persone | Cosenza Connect | Una destinazione turistica organizzata ed esperienziale: turismo culturale, delle radici e di prossimità, con itinerari ed esperienze per scoprire la città e tornarci. | Scopri gli itinerari → `/itinerari` |
| Crea | Artigianato · Dà identità | Cosenza Crea | L'artigianato come leva economica e identitaria: botteghe diffuse nel centro storico, laboratori ed esperienze, il marchio «Fatto a Cosenza». | Scopri Fatto a Cosenza → `/fatto-a-cosenza` |

## CSS (com'era in `src/app/home-sections.css`)

```css
/* ---------------------------------------------------------------------------------------------
   Pilastri in home: blocchi immagine + testo alternati (immagine a destra, sinistra, destra);
   sotto 900 px immagine sopra e testo sotto
   --------------------------------------------------------------------------------------------- */
.ca-pillar-blocks {
  display: grid;
  gap: clamp(56px, 8vw, 112px);
  margin-top: 48px;
}
.ca-pillar-block {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-areas: "copy media";
  align-items: center;
  gap: clamp(32px, 5vw, 80px);
  scroll-margin-top: 96px;
}
.ca-pillar-block[data-side="left"] {
  grid-template-areas: "media copy";
}
.ca-pillar-block-media {
  grid-area: media;
}
.ca-pillar-block-copy {
  grid-area: copy;
  display: grid;
  justify-items: start;
  gap: 14px;
}
.ca-pillar-block[data-pillar="vive"] {
  --pillar-accent: #9c37b5;
  --pillar-ink: #7a2a8e;
}
.ca-pillar-block[data-pillar="connect"] {
  --pillar-accent: #137396;
  --pillar-ink: #137396;
}
.ca-pillar-block[data-pillar="crea"] {
  --pillar-accent: #a3570c;
  --pillar-ink: #a3570c;
}
.ca-pillar-block-kicker {
  margin: 0;
  color: var(--pillar-ink);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ca-pillar-block h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(32px, 3.6vw, 52px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
}
.ca-pillar-block-text {
  max-width: 34em;
  margin: 0;
  color: var(--color-neutro-700);
  font-size: 17px;
  line-height: 1.65;
}
.ca-pillar-block-cta {
  margin-top: 8px;
  border: 1.5px solid var(--color-neutro-300);
}
@media (max-width: 899px) {
  .ca-pillar-block,
  .ca-pillar-block[data-side="left"] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "media" "copy";
    gap: 24px;
  }
  .ca-pillar-block-text {
    font-size: 16px;
  }
}

/* Foto nella forma organica con le macchie di colore (BlobImage) */
.ca-blob {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin-inline: auto;
  aspect-ratio: 1;
}
.ca-blob-spot {
  position: absolute;
  display: block;
}
.ca-blob-spot--arancio {
  background: var(--color-arancio-500);
}
.ca-blob-spot--viola {
  background: var(--color-viola-500);
}
.ca-blob-spot--azzurro {
  background: var(--color-azzurro-500);
}
.ca-blob-photo {
  position: absolute;
  inset: 4% 3% 3% 5%;
  overflow: hidden;
  background: var(--color-neutro-50);
}
.ca-blob-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.03);
}
/* fluttuazione delle macchie, come nella demo (y e rotazione, 8–10 s, avanti e indietro) */
@keyframes ca-blob-float-a {
  50% {
    transform: translateY(-14px) rotate(4deg);
  }
}
@keyframes ca-blob-float-b {
  50% {
    transform: translateY(12px);
  }
}
@keyframes ca-blob-float-c {
  50% {
    transform: translateY(-10px) rotate(-5deg);
  }
}
.ca-blob-float-a {
  animation: ca-blob-float-a 9s ease-in-out infinite;
}
.ca-blob-float-b {
  animation: ca-blob-float-b 8s ease-in-out infinite;
}
.ca-blob-float-c {
  animation: ca-blob-float-c 10s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .ca-blob-float-a,
  .ca-blob-float-b,
  .ca-blob-float-c {
    animation: none;
  }
}
```
