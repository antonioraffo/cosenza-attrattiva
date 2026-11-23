# Design token – Cosenza attrattiva

Fonte dei colori: i file SVG del marchio in `materiale/svg export/` (tutti i 16 lockup usano solo
`#128771`, `#dd7b19`, `#9c37b5`, `#1a98c4` più il bianco). Ruoli, neutri, tipografia e misure seguono
l'impianto di vivicosenza (`docs/reference/vivicosenza/ANALISI.md`).
I token sono definiti in `src/app/globals.css`: scale Tailwind in `@theme` (classi `bg-primario-600`,
`text-neutro-500`, …) e token semantici `--ca-*` su `:root` per chiaro e scuro.

## Mappatura dei ruoli (vivicosenza → Cosenza attrattiva)

| Ruolo | vivicosenza | Cosenza attrattiva | Note |
|---|---|---|---|
| Primario (CTA, header, pulsanti, link) | `#962d30` | **primario-600 `#0f7663`** | variante più scura del verde del logo `#128771`, che su bianco arriva a 4,44:1 e non basta per il testo normale |
| Primario hover / scuro | — | primario-700 `#0c6455` | |
| Colore del marchio | — | primario-500 `#128771` | logo, decori, testo ≥ 24 px |
| Pannello 1 (MAB) | `#962d30` | primario-600 `#0f7663`, testo bianco | |
| Pannello 2 (Duomo) | `#99515d` | viola-500 `#9c37b5`, testo bianco | il viola del logo regge già il bianco |
| Pannello 3 (San Domenico) | `#c8a08d`, testo `#2d2d2d` | arancio-700 `#a3570c`, testo bianco | scostamento: nel riferimento l'eyebrow bianco cade sul fondo chiaro prima che la foto si espanda (axe: contrasto insufficiente); con il tono scuro il testo bianco resta AA (5,35:1) in ogni fase |
| Pilastro Vive | — | viola-500 `#9c37b5` | badge "VIVE" del logo |
| Pilastro Connect | — | azzurro-700 `#137396` (decoro: azzurro-500 `#1a98c4`) | badge "CONNECT" |
| Pilastro Crea | — | arancio-700 `#a3570c` per testo, arancio-500 `#dd7b19` come fondo con testo scuro | badge "CREA" |
| Accento / focus | — | arancio-500 `#dd7b19` | anello di focus 3 px (3,03:1, soglia UI 3:1) |
| Sfondo pagina | `#f5f3ef` | neutro-50 `#f5f3ef` | |
| Superfici / card / header | `#ffffff` | bianco | |
| Testo | `#211e1c` | neutro-900 `#211e1c` | |
| Testo secondario | `#665f55` | neutro-500 `#665f55` | |
| Bordi | `#e1dcd4` | neutro-200 `#e1dcd4` | decorativi; per i controlli neutro-400 |
| Footer | `#211e1c` | neutro-900 | |

## Varianti create per il contrasto

| Colore del logo | Problema | Variante | Uso |
|---|---|---|---|
| verde `#128771` | 4,44:1 su bianco | `#0f7663` (5,54:1), `#0c6455` (7,07:1) | testo, pulsanti, hover |
| arancio `#dd7b19` | 3,03:1 su bianco | `#a3570c` (5,35:1) | testo arancio su chiaro; il 500 resta come fondo con testo scuro (6,1:1) |
| azzurro `#1a98c4` | 3,32:1 su bianco | `#137396` (5,36:1) | testo e fondi con testo bianco |
| viola `#9c37b5` | — (5,79:1) | — | usato così com'è |

Scale complete (50 → 950): `neutro`, `primario`, `arancio`, `viola`, `azzurro` in `globals.css`.

## Token semantici

| Token | Chiaro | Scuro |
|---|---|---|
| `--ca-bg` | neutro-50 `#f5f3ef` | neutro-950 `#151311` |
| `--ca-surface` | `#ffffff` | neutro-900 `#211e1c` |
| `--ca-ink` | neutro-900 `#211e1c` | neutro-100 `#ece8e1` |
| `--ca-ink-muted` | neutro-500 `#665f55` | `#b3aa9d` |
| `--ca-border` | neutro-200 `#e1dcd4` | neutro-700 `#433d36` |
| `--ca-primary` | primario-600 `#0f7663` | primario-400 `#4fb39b` |
| `--ca-on-primary` | `#ffffff` | neutro-950 |
| `--ca-accent` | arancio-700 `#a3570c` | arancio-300 `#f3b46c` |
| `--ca-focus` | arancio-500 `#dd7b19` | arancio-300 |
| `--ca-header-h` | 80 px (76 ≤ 1200, 72 ≤ 640) | idem |

L'app usa il tema **chiaro**, come vivicosenza. Il tema scuro è definito e verificato ma si attiva solo con
`data-theme="dark"` su `<html>`: le pagine usano ancora molte classi di scala (`bg-neutro-50`) e un dark mode
completo richiede di convertirle ai token semantici.

## Contrasti verificati (WCAG 2.1 AA)

Calcolati con la formula di luminanza relativa WCAG; soglie 4,5:1 testo normale, 3:1 testo grande ed elementi UI.

| Uso | Testo | Sfondo | Contrasto | Soglia | Esito |
|---|---|---|---|---|---|
| Testo principale | neutro-900 `#211e1c` | neutro-50 `#f5f3ef` | 14.95:1 | 4.5:1 | ✅ |
| Testo principale su card | neutro-900 | bianco | 16.57:1 | 4.5:1 | ✅ |
| Testo secondario | neutro-500 `#665f55` | bianco | 6.30:1 | 4.5:1 | ✅ |
| Testo secondario | neutro-500 | neutro-50 | 5.69:1 | 4.5:1 | ✅ |
| Bordi di controlli / icone | neutro-400 `#8a8073` | bianco | 3.88:1 | 3:1 | ✅ |
| Link e testo primario | primario-600 `#0f7663` | bianco | 5.54:1 | 4.5:1 | ✅ |
| Link e testo primario | primario-600 | neutro-50 | 5.00:1 | 4.5:1 | ✅ |
| Pulsante primario | bianco | primario-600 | 5.54:1 | 4.5:1 | ✅ |
| Pulsante primario (hover) | bianco | primario-700 `#0c6455` | 7.07:1 | 4.5:1 | ✅ |
| Verde del logo: solo testo grande/UI | primario-500 `#128771` | bianco | 4.44:1 | 3:1 | ✅ |
| Card/pannello Vive | bianco | viola-500 `#9c37b5` | 5.79:1 | 4.5:1 | ✅ |
| Testo viola | viola-500 | neutro-50 | 5.22:1 | 4.5:1 | ✅ |
| Card/pannello Connect | bianco | azzurro-700 `#137396` | 5.36:1 | 4.5:1 | ✅ |
| Testo azzurro | azzurro-700 | bianco | 5.36:1 | 4.5:1 | ✅ |
| Azzurro del logo: solo decoro | azzurro-500 `#1a98c4` | bianco | 3.32:1 | 3:1 | ✅ |
| Card/pannello Crea (chiaro) | neutro-900 | arancio-200 `#f0c9a0` | 10.71:1 | 4.5:1 | ✅ |
| Pulsante arancio | neutro-950 `#151311` | arancio-500 `#dd7b19` | 6.11:1 | 4.5:1 | ✅ |
| Testo arancio | arancio-700 `#a3570c` | bianco | 5.35:1 | 4.5:1 | ✅ |
| Testo arancio | arancio-700 | neutro-50 | 4.83:1 | 4.5:1 | ✅ |
| Arancio del logo: solo decoro | arancio-500 | bianco | 3.03:1 | 3:1 | ✅ |
| Footer: testo secondario | bianco 66% (≈`#b0afad`) | neutro-900 | 7.56:1 | 4.5:1 | ✅ |
| Anello di focus | arancio-500 | bianco | 3.03:1 | 3:1 | ✅ |
| Scuro: testo | neutro-100 `#ece8e1` | neutro-950 | 15.18:1 | 4.5:1 | ✅ |
| Scuro: testo secondario | `#b3aa9d` | neutro-950 | 8.08:1 | 4.5:1 | ✅ |
| Scuro: primario | primario-400 `#4fb39b` | neutro-950 | 7.28:1 | 4.5:1 | ✅ |
| Scuro: pulsante | neutro-950 | primario-400 | 7.28:1 | 4.5:1 | ✅ |
| Scuro: accento | arancio-300 `#f3b46c` | neutro-950 | 10.20:1 | 4.5:1 | ✅ |

## Tipografia

Font self-hosted in `src/fonts/` (SIL Open Font License, scaricati da Google Fonts, sottoinsieme latin, file variabili)
e caricati con `next/font/local`:

| Token | Font | Uso |
|---|---|---|
| `--font-display` (`font-display`) | Plus Jakarta Sans 400–800 | titoli h1–h4 (peso 600, `letter-spacing` −0,025em; titoli grandi −0,045em) |
| `--font-sans` (`font-sans`) | Manrope 400–700 | testo 16/1,6; navigazione, pulsanti, eyebrow (600) |

Scala della home (da vivicosenza): h2 di sezione 48/1,08 → 42 (≤ 960) → 36/1,1 (≤ 640); titoli pannello
`clamp(44px, 5.2vw, 76px)`; eyebrow 12/1,55 maiuscolo, 600, spaziatura .07em (.035em su mobile).

## Spazi, raggi, ombre, movimento

- Contenitore: max 1280 px, padding laterale 24 px (20 ≤ 640, 16 ≤ 360).
- Raggio card/pannelli `--radius-card` 24 px; pill `9999px`.
- Ombre: `--shadow-card`, `--shadow-float`, `--shadow-header` (`0 2px 24px rgb(33 30 28 / .08)`).
- Easing: `--ease-reveal` `cubic-bezier(.2,.7,.1,1)` per gli ingressi (0,9 s, sfasamento 100 ms);
  `--ease-out-expo` per le transizioni dell'interfaccia.
- `prefers-reduced-motion: reduce` azzera animazioni e transizioni e disattiva gli effetti di scorrimento.
