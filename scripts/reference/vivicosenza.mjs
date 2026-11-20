// Analisi del sito di riferimento vivi-cosenza.netlify.app/home/ (fase 1 dell'evoluzione home).
// Uso: docker compose --profile tests run --rm e2e node scripts/reference/vivicosenza.mjs
// Produce screenshot a pagina intera in docs/reference/vivicosenza/ e, in raw/ (non versionato),
// HTML, CSS, script e un JSON con struttura, stili calcolati, font, keyframe e media query.
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const URL = process.env.REF_URL ?? "https://vivi-cosenza.netlify.app/home/";
const out = "docs/reference/vivicosenza";
const raw = `${out}/raw`;
await mkdir(raw, { recursive: true });

const browser = await chromium.launch();
const assets = new Map();

for (const width of [375, 768, 1440]) {
  const ctx = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 900 }, deviceScaleFactor: 1 });
  // sessione del browser dell'utente (cookie copiato da DevTools in REF_COOKIE="nome=valore"), mai stampata
  if (process.env.REF_COOKIE) {
    const [name, ...v] = process.env.REF_COOKIE.split("=");
    await ctx.addCookies([{ name: name.trim(), value: v.join("=").trim(), domain: new globalThis.URL(URL).hostname, path: "/", secure: true }]);
  }
  const page = await ctx.newPage();
  page.on("response", async (r) => {
    const type = r.request().resourceType();
    if (!["stylesheet", "script", "document", "font"].includes(type) || assets.has(r.url())) return;
    try {
      assets.set(r.url(), { type, status: r.status(), body: type === "font" ? null : await r.text() });
    } catch {}
  });
  const res = await page.goto(URL, { waitUntil: "networkidle" });
  if (res?.status() === 401) {
    // sito protetto da password Netlify: la password arriva da REF_PASSWORD (.env), mai stampata
    if (!process.env.REF_PASSWORD) throw new Error("Sito protetto: impostare REF_PASSWORD in .env");
    await page.fill('input[name="password"]', process.env.REF_PASSWORD);
    await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.click("form button")]);
    if (/Password Protection/.test(await page.title())) throw new Error("REF_PASSWORD non valida");
    await page.goto(URL, { waitUntil: "networkidle" });
  }
  // scorrimento lento per attivare lazy-load e animazioni allo scroll
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  // sequenza di schermate (una ogni ~60% di viewport): rende leggibili gli effetti sticky/scroll
  const vh = page.viewportSize().height;
  const step = Math.round(vh * 0.6);
  await mkdir(`${out}/frames-${width}`, { recursive: true });
  for (let y = 0, n = 0; y < h; y += step, n++) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${out}/frames-${width}/${String(n).padStart(3, "0")}-y${y}.jpg`, type: "jpeg", quality: 60 });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  // pagina intera "statica": con prefers-reduced-motion il sito disattiva gli effetti di scroll
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  for (let y = 0; y < h * 1.2; y += 400) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/home-${width}.jpg`, type: "jpeg", quality: 70, fullPage: true });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload({ waitUntil: "networkidle" });

  const data = await page.evaluate(() => {
    const pick = (el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || undefined,
        cls: typeof el.className === "string" ? el.className.slice(0, 160) : undefined,
        text: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 90),
        box: { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) },
        font: `${s.fontWeight} ${s.fontSize}/${s.lineHeight} ${s.fontFamily}`,
        ls: s.letterSpacing,
        tt: s.textTransform,
        color: s.color,
        bg: s.backgroundColor !== "rgba(0, 0, 0, 0)" ? s.backgroundColor : undefined,
        bgImg: s.backgroundImage !== "none" ? s.backgroundImage.slice(0, 120) : undefined,
        pad: s.padding,
        mar: s.margin,
        gap: s.gap !== "normal" ? s.gap : undefined,
        maxW: s.maxWidth !== "none" ? s.maxWidth : undefined,
        disp: s.display,
        pos: s.position !== "static" ? s.position : undefined,
        radius: s.borderRadius !== "0px" ? s.borderRadius : undefined,
        shadow: s.boxShadow !== "none" ? s.boxShadow : undefined,
        border: s.borderBottomWidth !== "0px" ? `${s.borderBottomWidth} ${s.borderBottomStyle} ${s.borderBottomColor}` : undefined,
        transition: s.transitionProperty !== "all" || s.transitionDuration !== "0s" ? `${s.transitionProperty} ${s.transitionDuration} ${s.transitionTimingFunction}` : undefined,
        anim: s.animationName !== "none" ? `${s.animationName} ${s.animationDuration} ${s.animationTimingFunction}` : undefined,
        transform: s.transform !== "none" ? s.transform : undefined,
        opacity: s.opacity !== "1" ? s.opacity : undefined,
        sticky: s.position === "sticky" ? s.top : undefined,
        gridCols: s.gridTemplateColumns !== "none" ? s.gridTemplateColumns : undefined,
      };
    };
    // albero fino a profondità 5 dal body, solo elementi visibili e "strutturali"
    const tree = [];
    const walk = (el, d) => {
      if (d > 6) return;
      for (const c of el.children) {
        if (["SCRIPT", "STYLE", "LINK", "META", "NOSCRIPT", "svg", "PATH"].includes(c.tagName)) continue;
        const r = c.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        tree.push({ d, ...pick(c) });
        walk(c, d + 1);
      }
    };
    walk(document.body, 0);
    const typo = {};
    for (const sel of ["h1", "h2", "h3", "h4", "p", "a", "button", "nav a", "header", "footer", "li", "small", "span"]) {
      typo[sel] = [...document.querySelectorAll(sel)].slice(0, 6).map(pick);
    }
    const rootVars = {};
    const keyframes = [];
    const media = new Set();
    const fontFaces = [];
    for (const sh of document.styleSheets) {
      let rules;
      try { rules = sh.cssRules; } catch { continue; }
      const visit = (rs) => {
        for (const r of rs) {
          if (r instanceof CSSStyleRule && /^(:root|html|body)$/.test(r.selectorText)) {
            for (const p of r.style) if (p.startsWith("--")) rootVars[p] = r.style.getPropertyValue(p).trim();
          }
          if (r instanceof CSSKeyframesRule) keyframes.push(r.cssText.slice(0, 600));
          if (r instanceof CSSMediaRule) { media.add(r.conditionText); visit(r.cssRules); }
          if (r instanceof CSSFontFaceRule) fontFaces.push(r.cssText.slice(0, 300));
        }
      };
      visit(rules);
    }
    return {
      title: document.title,
      metas: [...document.querySelectorAll("meta,link[rel]")].map((m) => m.outerHTML.slice(0, 200)),
      scripts: [...document.scripts].map((s) => s.src || `inline:${s.textContent.length}`),
      globals: Object.keys(window).filter((k) => /gsap|ScrollTrigger|Lenis|AOS|Swiper|lottie|anime|barba|jQuery|\$/i.test(k)),
      fontsLoaded: [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight} ${f.style}`),
      fontFaces,
      rootVars,
      keyframes,
      media: [...media],
      typo,
      tree,
      docH: document.documentElement.scrollHeight,
    };
  });
  await writeFile(`${raw}/computed-${width}.json`, JSON.stringify(data, null, 1));

  // effetti allo scroll: stato (transform/opacity) degli elementi animati a varie posizioni
  if (width !== 768) {
    const frames = [];
    const total = data.docH;
    for (let y = 0; y < total; y += 100) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(60);
      frames.push(
        await page.evaluate((y) => {
          const res = [];
          for (const el of document.querySelectorAll("body *")) {
            const s = getComputedStyle(el);
            if (s.transform === "none" && s.opacity === "1" && s.position !== "sticky" && !s.clipPath.includes("(")) continue;
            const r = el.getBoundingClientRect();
            if (r.bottom < 0 || r.top > innerHeight || r.width < 40) continue;
            res.push({
              sel: el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : ""),
              top: Math.round(r.top), h: Math.round(r.height),
              t: s.transform === "none" ? undefined : s.transform, o: s.opacity === "1" ? undefined : s.opacity,
              pos: s.position === "sticky" ? `sticky top:${s.top}` : undefined,
              clip: s.clipPath !== "none" ? s.clipPath : undefined,
            });
          }
          return { y, els: res.slice(0, 40) };
        }, y),
      );
    }
    await writeFile(`${raw}/scroll-${width}.json`, JSON.stringify(frames, null, 1));
  }
  console.log(`✔ ${width}px`);
  await ctx.close();
}

let i = 0;
const index = [];
for (const [url, a] of assets) {
  index.push({ url, type: a.type, status: a.status });
  if (!a.body) continue;
  const ext = a.type === "stylesheet" ? "css" : a.type === "script" ? "js" : "html";
  await writeFile(`${raw}/asset-${String(i++).padStart(2, "0")}.${ext}`, `/* ${url} */\n${a.body}`);
}
await writeFile(`${raw}/assets.json`, JSON.stringify(index, null, 1));
await browser.close();
