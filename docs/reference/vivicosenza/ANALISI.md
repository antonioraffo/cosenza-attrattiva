# Analisi del sito di riferimento – vivi-cosenza.netlify.app/home/

Rilevato il 2026-11-20 con `make reference` (Playwright, Chromium) a 375, 768 e 1440 px.
Fonti: HTML, 39 CSS e 17 moduli JS scaricati in `raw/` (non versionata), stili calcolati
(`raw/computed-*.json`), stato degli elementi animati lungo lo scroll (`raw/scroll-*.json`).
Screenshot: `home-{375,768,1440}.jpg` (pagina intera con `prefers-reduced-motion: reduce`, cioè
layout statico) e `frames-{375,768,1440}/` (viewport ogni 60 % di altezza, effetti attivi).

Il sito è una SPA "vanilla": l'HTML contiene header e hero; `home.js` scarica
`/home-content.json` e genera in `#contenuti` le sezioni successive e il footer. Tutti gli effetti
sono JS + variabili CSS (nessuna libreria: niente GSAP/Lenis/Swiper), sincronizzati con lo scroll
nativo tramite `requestAnimationFrame`.

## 1. Sezioni della home (in ordine)

Altezze misurate (px) a 375 / 768 / 1440; altezza documento 10 490 / 9 589 / 10 373.

| # | Sezione | Selettore | Altezza | Contenuto | Sorgenti |
|---|---|---|---|---|---|
| 1 | Header fisso | `header#site-header.site-header` | 72 / 76 / 80 | logo, nav (Luoghi, Pianifica ▾, Consigli di viaggio ▾, Eventi), ricerca, CTA "Crea il tuo itinerario", hamburger ≤960 | `home.css`, `brand.css`, `site-navigation.css`, `home-megamenu.css/js`, `hero-search.css/js`, `home.js` |
| 2 | Hero "silhouette" | `section.cs-silhouette-intro` (dentro `.hero.hero-slider.hero-scroll`) | 2 039 / 2 264 / 2 402 (stage sticky + runway 160svh) | disegno al tratto del Duomo che si "disegna" allo scroll, logo grande al centro, poi titolo "Duomo di Cosenza" + testo + "Scopri di più"; 3 curiosità (card rosse con pallino pulsante); selettore a pillola **Duomo / Ponte Calatrava** | `silhouette-intro.css/js` |
| 3 | Pannelli MAB / Duomo / San Domenico | `article.cs-scroll-panel[data-hero-panel=0..2]` + `div.cs-scroll-runway` | pannelli 740/692/644 (375), 820/756/692 (1440) + runway 341–378 ciascuno | linguetta-titolo a destra, eyebrow, titolo (h1 sul primo), descrizione, pill "Scopri di più", foto che da riquadro arrotondato si espande a tutto pannello | `hero-slider.css/js`, `scroll-typewriter.js` |
| 4 | "Crea il tuo itinerario" | `section#esplora.explore-stage.journey-promo` > `.explore-sheet` | dentro `.home-explore-transition` 1 846 / 1 546 / 1 812 (insieme agli itinerari) | foglio bianco che entra inclinato sopra l'ultimo pannello; h2, "Una città, tanti modi di scoprirla", lead "Tu metti la curiosità. / Noi le tappe.", 3 passi con icona, board con 3 polaroid e tratteggio, barra "Il tuo itinerario prende forma" + bottone "Componi" | `explore-view.js`, `explore-scroll.css`, `home-scroll-effects.css/js` |
| 5 | Itinerari | `section#itinerari.section.home-itineraries` (sticky dietro al foglio) | ~640 (1440) | h2 "Itinerari", intro "Ogni percorso, un nuovo sguardo su Cosenza.", link "Scopri di più", carosello orizzontale di card foto (max 4; ne esistono 3: musei 4–5 ore, centro storico 2 ore, chiese 1–2 ore), frecce prev/next | `home.js`, `home.css`, `itinerary-scroll-reveal.css`, `home-itinerary-scroll.js` |
| 6 | Approfondimenti (**non citata nel brief**) | `section#landmark-feature.lf-editorial-feature` | 983 / 876 / 1 644 | colonna di foto che scorre + accordion sticky a destra (Il Rendano, San Domenico, Cosa fare con la pioggia) | `landmark-feature.css/js` |
| 7 | Eventi | `section#eventi.section.light` | 1 725 / 997 / 662 | h2 "Eventi", intro "Musica e spettacoli, nel cuore di Cosenza.", 4 card senza foto (data grande, titolo, luogo, categoria, "Scopri di più") | `home.css`, `event-cards.css/js`, `event-dates.js` |
| 8 | Footer | `footer#site-footer` | 726 / 392 / 371 | logo bianco, indirizzo Comune di Cosenza, social, gruppi "Pianifica" e "Vivi Cosenza", © + link legali | `home.css` (blocco `#site-footer`), `footer-scroll-reveal.css` |
| – | Navigatore di sezione | `div.home-section-nav` (fixed, in basso) | 54 | pillola rossa "In evidenza ▴" con anello di avanzamento; menu "Vai alla sezione" | `home-section-nav.css/js` |

Nota: i "blocchi MAB/Duomo/San Domenico" sono il **secondo tempo dell'hero**, non una sezione
separata: stanno nello stesso `<section class="hero">` dopo l'intro silhouette.

## 2. Token di stile

### Palette (`brand.css`, override dei vecchi token di `home.css`)

| Token | Valore | Ruolo |
|---|---|---|
| `--brand-primary` | `#962d30` | primario: CTA, link attivi, pannello MAB, sfondo hero, card curiosità, focus |
| `--brand-header-dark` | `#5c171c` | hover CTA (`#7f2228`/`#7b2528`/`#7d2528` usati come hover intermedi) |
| `--brand-deep` | `#211e1c` | testo titoli, sfondo footer |
| `--brand-muted` | `#665f55` | testo secondario |
| `--brand-neutral` | `#8c877c` | neutro |
| `--brand-light` | `#f5f3ef` | sfondi chiari (itinerari, eventi, board) |
| `--brand-line` | `#e1dcd4` | bordi/divisori (`#d6d0c7` per controlli) |
| testo header | `#2d2d2d` | voci nav, icone |
| pannello Duomo | `#99515d` | sfondo, inchiostro `#fff` |
| pannello San Domenico | `#c8a08d` | sfondo, inchiostro `#2d2d2d` |
| superfici card evento | `#fffdfb`, bordo `#962d301a` | |
| testo descrizione silhouette | `#514943` | |
| `theme-color` | `#962d30` | |

Ombre: card `0 3px 8px #211e1c08, 0 12px 28px #211e1c17` (hover `0 5px 12px #211e1c0d, 0 18px 34px #211e1c24`);
header `0 3px 18px #211e1c20`; foto board `0 12px 30px #211e1c17`; card curiosità `0 12px 36px #251b1624`;
pillola sezione `0 4px 14px #211e1c1a, 0 12px 36px …`; selettore silhouette `0 8px 28px #211e1c1a`.

Raggi: card 20 px (16 px ≤640), foto pannello 24 px (18 ≤640) che va a 0, board 28 px, polaroid 12/6 px,
card curiosità 16 px, pill/CTA 40 px (o 28–30 px), controlli tondi 50 %, foto approfondimenti 16 px.

### Font (`assets/fonts/cosenza-jakarta/fonts.css`, `typography.css`)

- **Plus Jakarta Sans 600** (`--font-title`): h1–h6, titoli card, linguette. File woff2 latin + latin-ext,
  `font-display: swap`, preload.
- **Manrope 400–600** variabile (`--font-text`): body 400; nav, bottoni, CTA, eyebrow 600.
- Il CSS stesso dichiara "SIL Open Font License": entrambi sono Google Fonts OFL → **self-hostabili**
  (già solo pesi 600 e 400–600). Nessun font proprietario.
- `font-synthesis: none`; `letter-spacing` negativo sui titoli (−.025/−.05em); `text-wrap: balance`.

### Scala tipografica (desktop → ≤960 → ≤640)

| Elemento | Valori |
|---|---|
| h1 pannello MAB | `clamp(40px,4.3vw,64px)`/1.08 → `clamp(34px,4.9vw,46px)` → `clamp(28px,8.1vw,34px)`/1.12; ls −.05em (−.045 mobile) |
| h2 pannelli | `clamp(44px,5.2vw,76px)`/1.04 → `clamp(36px,5.2vw,50px)`/1.08 → `clamp(30px,8.5vw,36px)` |
| h2 silhouette | `clamp(34px,4vw,54px)`/1.12, −.045em (1000–1440: `clamp(34px,3.3vw,46px)`; ≤700 `clamp(26px,7.5vw,34px)`) |
| h2 "Crea il tuo itinerario" | `clamp(36px,4.15vw,56px)`/1.1, −.045em → 32 → 28 (≤360) |
| h2 sezioni (`.section h2`) | 48/1.08 → 42 → 36/1.1; Approfondimenti 42 → 32 |
| lead journey | `clamp(26px,2.6vw,36px)`/1.22 → 28 → 25 |
| h3 card itinerario | `clamp(25px,2vw,32px)`/1.2; card generiche 21/1.25 |
| h3 evento | 21/1.23; data 28 px |
| titolo accordion | 24/1.25 → 22 → 21 |
| intro sezione | 21/1.65 → 19 → 17/1.7 |
| descrizione pannello | 16/1.65 → 15/1.6 → 14/1.55 |
| eyebrow | Manrope 600 12/1.55, `letter-spacing:.07em` (.035 mobile), maiuscolo |
| body | 16/1.6 |
| nav desktop | Manrope 600 14 (13 tra 961–1200) |
| bottoni/CTA | Manrope 600 13–14; CTA pannello 13 (12 mobile) |
| linguetta pannello | Jakarta 600 `clamp(16px,1.4vw,21px)`, −.025em → 15 → 14 |

### Layout e spaziature

- `.container`: `max-width:1280px; padding-inline:24px` (20 ≤640, 16 ≤360). Contenuto utile 1 232 px;
  gli elementi a tutta larghezza usano `padding-inline: max(24px, calc((100vw - 1232px)/2))`.
- Sezioni: `padding-block` 80 → 64 (≤960) → 56 (≤640); Approfondimenti 80 → 48; foglio esplora 80/88 → 64/72 → 44/48.
- `section-heading`: flex space-between, `gap:28px`, `margin-bottom:44px` (30 mobile; 32 itinerari; 50 esplora; 40 approfondimenti).
- Gap griglie: 24 px (16–20 mobile); eventi 4 colonne → 2 (≤1199) → 1 (≤640); footer `1.5fr 1fr 1.2fr`, gap 52.
- Breakpoint principali: **1199/1200, 960/961, 760, 700/701, 640/641, 360**; più varianti per altezza
  (`max-height` 740, 700, 650, 500 landscape) e `hover:hover and pointer:fine`.
- `html { scroll-behavior:smooth; scroll-padding-top:100px }` (85 ≤640).

## 3. Header

- `position:fixed; inset:0 0 auto; z-index:50`, sfondo `#fff`, ombra `0 3px 18px #211e1c20` **sempre**
  (la classe `.scrolled` oltre 50 px resta per compatibilità ma non cambia aspetto); non si nasconde allo scroll.
- `.header-inner`: flex, `min-height` 80 / 76 (≤960) / 72 (≤640), `padding-block:16px` (14), gap 24.
- Logo: SVG `logo-dark.svg` 252×50, larghezza 252 → 224 (≤1199) → 190 (961–1200) → 200 (≤960) → 154 (≤640) → 130 (≤360).
- Nav desktop centrata a destra (`margin-left:auto`), gap `clamp(16px,1.8vw,28px)`, sottolineatura animata:
  `::after` 2 px che cresce da sinistra (`right:100%→0`, `.2s`). Voce attiva `aria-current=page` in rosso.
- Megamenu: voci con sottomenu = link + bottone chevron 28×44 (`aria-expanded`, chevron ruota 180°, .2s);
  pannello assoluto 270 px, raggio 16, bordo `--brand-line`, ombra `0 12px 32px #211e1c1f`.
- Azioni: ricerca (icon-button 44×44, apre `<dialog>` con suggerimenti), CTA pill rossa
  "Crea il tuo itinerario" (icona aereo, 44 px, raggio 30; nascosta ≤960, ridotta a 112 px ≤640).
- Mobile ≤960: hamburger 44×44 → `nav#mobile-nav` sotto la barra (toggle dell'attributo `hidden`,
  **nessuna animazione**), voci 52 px Manrope 600 16, divisori `--brand-line`, sottomenu indentati con
  bordo sinistro, CTA pill in fondo; `max-height: calc(100dvh - 76px)` scrollabile. L'icona diventa X,
  `aria-label` Apri/Chiudi menu; chiude con Esc, click fuori o click su un link.

## 4. Effetti e animazioni

Funzione ricorrente: `smooth(t) = t²(3−2t)` (smoothstep), `clamp` 0–1. Tutto è guidato dalla posizione di
scroll (reversibile), aggiornato in rAF, misure ricalcolate su `resize`/`ResizeObserver`/`fonts.ready`.

### (a) Intro silhouette (Duomo / Ponte Calatrava)

- Struttura: `.cs-silhouette-stage` sticky (`top: header`, altezza `max(100svh − header, 100vw·1025/1535)`)
  + `.cs-silhouette-runway` alta **160svh** = distanza di scroll dell'animazione.
- Il disegno è un SVG esterno (`duomo-silhouette-lines.svg`, 1535×1025) caricato via `fetch` e inserito inline.
  Ogni tratto `[data-silhouette-stroke]` ha `data-start/data-end`; disegno con
  **`stroke-dashoffset = 1 − clamp((p − start)·1/(end−start))`** (path con `pathLength=1`). Un livello
  `[data-silhouette-ghost]` (opacità .2 → .1) mostra il disegno grigio completo; `[data-silhouette-finish]`
  compare a fine corsa (`smooth((p−.94)/.06)`).
- Progresso: `scrollP = clamp((scrollY − start)/runway)`; il valore disegnato insegue il target con smorzamento
  esponenziale `drawn += (target − drawn)·(1 − e^(−dt/0.1s))`. Su desktop anche **il movimento del mouse**
  fa avanzare il disegno (`mouseP += distanza / max(0.8·larghezza, 420)`).
- Coreografia (desktop / mobile, frazioni di scrollP): logo scala 1 → 0.945 e sale/esce `.12–.24` (`.04–.13`
  mobile), traslando verso il centro della copy; copia del luogo `.18–.37`, titolo `.20–.30`
  (opacity + translateY 16px + clip), sottotitolo `.23–.34` (12px), CTA `.27–.37`; una maschera SVG sfumata
  (`feGaussianBlur` 7) "buca" le linee dietro al testo da `.10–.18`.
- Curiosità: 3 card rosse (`#962d30`, raggio 16, larghe `clamp(230px,22vw,290px)`) compaiono a
  `start` .16 / .44 / .72 con fade di 0.08; su mobile/tablet sono sequenziali (la precedente sfuma quando
  arriva la successiva) e stanno in basso centrate. Ogni card ha un pallino 16 px con due anelli che
  pulsano (`cs-silhouette-marker-pulse` 2.4s ease-out infinite, scale .6→1.4, sfasati di −1.2s), in pausa
  se fuori vista. Posizionamento calcolato con `getScreenCTM()` per evitare logo, testo e selettore.
- Selettore Duomo/Ponte: pillola 292 px (raggio 32) con indicatore rosso che scorre (`translateX`) e un
  riflesso animato (`cs-silhouette-nav-light`, background-position); cambiare scena rigenera SVG e testi.
  Su ≤700 diventa barra a tutta larghezza in basso.

### (b) Pannelli MAB / Duomo / San Domenico ("scroll-puzzle")

- Ogni `article.cs-scroll-panel` è **`position:sticky`** con
  `top = header + i·barHeight` e `height = 100svh − header − i·barHeight`, `z-index = i+1`;
  `barHeight` = 64 / 56 (≤960) / 48 (≤640). Dopo ogni pannello una `cs-scroll-runway` alta
  `clamp(180px, 42svh, 460px)`. Risultato: il pannello successivo sale e copre il precedente lasciando
  visibile solo la sua **linguetta** (bottone di 64 px col titolo allineato a destra e chevron): in alto
  si impilano MAB, Duomo, San Domenico, ciascuno col proprio colore di sfondo.
- JS (`hero-slider.js`) calcola per ogni pannello `start` (top nel documento) e
  `target = start − header − i·bar` (scroll a cui il pannello si aggancia), poi:
  ```
  zoom    = clamp((y − target_i) / runway_i)          // 0→1 durante la runway
  e       = smooth(zoom); rest = 1 − e
  inset   = (14%·rest orizzontale, 11.5%·rest verticale), radius = 24px·rest (18 mobile)
  scale   = 1.04 − .04·e + .01·covered;  shift = (1−enter)·8 − covered·12  px
  covered = clamp((h − start_{i+1} + y) / (h − header − (i+1)·bar))  // quanto il successivo lo copre
  content opacity = 1 − .8·covered
  writing = clamp((y − target_i + .22h) / .36h)       // "macchina da scrivere" su titolo e descrizione
  ```
  Quindi: la foto parte come riquadro arrotondato centrato (inset 11.5 %/14 %) e si espande a tutto
  pannello mentre si scorre la runway; poi il pannello seguente entra e il testo sbiadisce.
  La foto ha un velo `linear-gradient(90deg, rgba(0,0,0,.56) → .3 → .08)` + `0deg rgba(0,0,0,.22)`.
- Typewriter (`scroll-typewriter.js`): il titolo è spezzato in caratteri; `count = floor(p·(n+1))`
  caratteri a opacità 1; la descrizione parte al 20 % del titolo. Copia accessibile in uno span
  visually-hidden, la parte visiva è `aria-hidden`. Il primo pannello è sempre scritto per intero.
- Linguette: click → `scrollTo(target_i, smooth)`; tastiera ↑/↓/Home/End sposta tra le linguette;
  `aria-expanded=false` e corpo `inert` + `aria-hidden` quando il pannello è coperto (`covered ≥ .998`);
  annuncio del titolo in `p.cs-scroll-status[role=status][aria-live=polite]`. Focus dentro un corpo già
  superato riporta su il pannello.
- Pill CTA: bianca, 52 px, raggio 40, padding `8px 9px 8px 21px`, cerchio rosso 34 px con freccia.

### (c) Foglio "Crea il tuo itinerario"

- `#contenuti` risale di `--explore-overlap: clamp(360px,72svh,740px)` (margin-top negativo, z-index 8)
  così il foglio bianco **entra sopra l'ultimo pannello** (San Domenico).
- Con `rect` della sezione e `h = innerHeight`:
  `progress = clamp((1.06h − top)/(.84h))`, `e = smooth(progress)`,
  `closing = smooth(clamp((.94h − bottom)/(.72h)))`;
  transform del foglio: `translateY((1−e)·min(140,.14h) − closing·min(160,.17h))`,
  `rotate((1−e)·4° − closing·4°)` (2.7° ≤640), `scale(.92 + .08e − .06·closing)`,
  `border-radius: ((1−e)+closing)·24px`, `transform-origin` 50% 0 (entrata) / 50% 100% (uscita).
  Il foglio quindi arriva inclinato di 4°, si raddrizza, e in uscita si inclina e rimpicciolisce
  scoprendo gli itinerari che stanno **sticky sotto** (`#itinerari` sticky, `margin-top` negativo
  `clamp(320px,72svh,740px)`).
- Hover desktop sulle righe: leggero tilt 3D (±1.6°/±2.2°) seguendo il puntatore.

### (d) Ingressi delle sezioni successive

- Itinerari: tutto deriva da `--itinerary-reveal = closing` del foglio. Heading opacità .2→1 e
  `translate 46px`; intro e controlli in ritardo; card con soglie scalate (.16/.27/.38/.49),
  `translate 80px` (58 mobile), `rotate` −2°/1.6°/−1.6°/2°, `scale .92→1`, origine 50% 100%.
- Carosello itinerari: `grid-auto-flow:column`, colonne `clamp(360px,35vw,620px)` (≤960 `clamp(320px,46vw,460px)`,
  ≤640 `100vw − 88px` con `scroll-snap x proximity`), card alte `clamp(400px,58svh,600px)`. Frecce 44 px
  (scroll di una card, disabilitate agli estremi), trascinamento col mouse, ←/→/Home/End sulla traccia
  (`role=region`, `tabindex=0`), e **rotella verticale convertita in scroll orizzontale** quando la sezione
  è centrata nel viewport (scroll-jacking).
- Titoli h2 di sezione: stessa macchina da scrivere, `amount = smooth((.94h − top)/(.32h))`.
- `home-motion.js` (IntersectionObserver threshold .15, rootMargin −60px): intro, card di griglie,
  testo approfondimenti e colonne footer da `opacity 0; translate 0 36px` a visibili in
  **.9s cubic-bezier(.2,.7,.1,1)**, stagger 100 ms (max 4); h2 con WAAPI 900 ms (28px); foto approfondimenti
  `scale 1.06→1` in 1 300 ms. Esclude `#esplora` e `#itinerari`. Focus da tastiera mostra subito.
- Approfondimenti (desktop): la foto più vicina al centro del viewport attiva la voce corrispondente
  dell'accordion sticky (`top: header + 40px`); click su una voce scrolla alla foto (blocco 1.8 s).
  Su mobile la foto si sposta dentro il pannello aperto.
- Eventi: card fisse 352 px; hover/click aggiunge `.ec-is-open` → superficie rossa, testo bianco,
  descrizione visibile (opacity/translateY 8px, .25–.3s).
- Footer: nessuna animazione (tutto forzato a `none`).
- Navigatore di sezione: appare quando il primo pannello raggiunge l'header, sparisce vicino al footer o
  con menu/ricerca aperti; la pillola si sposta orizzontalmente in proporzione allo scroll
  (dalla x della CTA dell'hero al lato opposto); anello `stroke-dashoffset = 100 − progress`.

### (e) `prefers-reduced-motion: reduce`

Runway pannelli a 0, foto a pieno pannello senza transform, typewriter disattivato (testi completi),
silhouette mostrata finita e non sticky (runway 0), foglio esplora senza transform, reveal disattivati,
pillola sezione centrata, `scroll-behavior:auto`, durate globali `.01ms`. Il sito resta completo.

## 5. Asset

| Asset | URL | Note |
|---|---|---|
| Logo header/hero | `/assets/cosenza-turismo/logo-dark.svg` | marchio "vivi cosenza" – da sostituire |
| Logo footer/favicon | `/assets/cosenza-turismo/logo.svg` | idem |
| Disegno Duomo | `/assets/cosenza-turismo/duomo-silhouette-lines.svg` (+ `duomo-silhouette-original.png`) | **illustrazione specifica di vivicosenza**, con attributi `data-silhouette-*` |
| Disegno Ponte | `/assets/cosenza-turismo/ponte-calatrava-silhouette-lines.svg` | idem |
| Foto pannelli | `/images/cosenza/home/{mab-bilotti,duomo-cosenza,san-domenico}.jpg` (+ `-960`) | provenienza/licenza non dichiarate nella pagina |
| Foto board/curiosità | `/images/cosenza/home/panorama-cosenza.jpg`, `ponte-calatrava.jpg`, `/images/cosenza/duomo-curiosities/madonna-del-…` | idem |
| Font | `/assets/fonts/cosenza-jakarta/*.woff2`, `/assets/fonts/cosenza/manrope-*.woff2` | OFL |
| Contenuti | `/home-content.json` (itinerari, eventi, approfondimenti, luoghi) | dati statici, eventi Teatro Rendano nov 2026 |

## 6. Accessibilità osservata

- Positivo: `aria-expanded`/`aria-controls` su linguette, megamenu, hamburger; `inert` sui pannelli coperti;
  `role=status` per i cambi di pannello; testo accessibile integro dietro al typewriter; tastiera sulle
  linguette e sul carosello; target ≥44 px quasi ovunque; `:focus-visible` con outline 2–3 px; reduced-motion
  completo; ricerca in `<dialog>`.
- Criticità: rotella che scorre orizzontalmente il carosello (scroll-jacking); il disegno risponde al
  movimento del mouse; `user-scalable` ok ma molti testi 12 px (eyebrow, luoghi evento); contrasto di
  eyebrow/titoli bianchi sulle foto affidato a velo + `text-shadow` (va verificato per foto chiare);
  `#ffffffa8` su `#211e1c` nel footer ≈ 9:1 (ok); testo `#2d2d2d` su `#c8a08d` ≈ 7:1 (ok); bianco su
  `#99515d` ≈ 6:1 (ok). Card evento con `button` che copre la card (`card-link-cover`).
- Il menu mobile non intrappola il focus e non ha animazione.

## 7. Implicazioni per Cosenza attrattiva

- **Replicabile 1:1** (logica e valori): header fisso e menu mobile, pannelli sticky con linguette
  impilate, zoom della foto e typewriter, foglio inclinato in entrata/uscita, reveal delle card itinerario,
  carosello con frecce/drag/tastiera, card evento editoriali, griglia footer, navigatore di sezione,
  scala tipografica e spaziature. Font Plus Jakarta Sans + Manrope: self-host (OFL).
- **Da adattare**:
  - palette: il rosso `#962d30` e i toni dei pannelli vanno sostituiti con i colori del logo Cosenza
    attrattiva (verde `#128771`, arancio `#dd7b19`, viola `#9c37b5`, azzurro `#1a98c4`) con varianti AA;
  - hero silhouette: il disegno al tratto del Duomo (e del ponte) è un asset grafico di vivicosenza; serve
    decidere se riutilizzarlo (se è dello stesso cliente) o sostituirlo con un'apertura diversa;
  - "Crea il tuo itinerario" va rimossa (da brief) e sostituita dai "tre modi di vivere l'itinerario";
  - Approfondimenti non è nel brief: da decidere se tenerla;
  - eventi: dati statici di vivicosenza (`home-content.json`); nel nostro DB non ci sono eventi;
  - scroll-jacking della rotella e interazione col mouse sul disegno: sconsigliati per WCAG/Lighthouse,
    meglio tenerli fuori o disattivabili;
  - la home è renderizzata lato client: in Next.js va resa in RSC (contenuti dal DB) con gli effetti come
    componenti client a "progressive enhancement", per non perdere Lighthouse ≥ 90.
