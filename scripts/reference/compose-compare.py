"""Compone le tavole di confronto vivicosenza | Cosenza attrattiva in docs/reference/compare/.
Uso: python3 scripts/reference/compose-compare.py (dopo make reference e make compare)."""
from PIL import Image, ImageDraw, ImageFont
import glob, os

REF, OURS, OUT = "docs/reference/vivicosenza", "docs/reference/compare/cosenza", "docs/reference/compare"
try:
    FONT = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 22)
except OSError:
    FONT = ImageFont.load_default()

def frame(base, w, n):
    return glob.glob(f"{base}/frames-{w}/{n:03d}-*.jpg")[0]

def pair(left, right, col_w, label=None):
    a, b = Image.open(left), Image.open(right)
    a = a.resize((col_w, round(a.height * col_w / a.width)))
    b = b.resize((col_w, round(b.height * col_w / b.width)))
    top = 40
    img = Image.new("RGB", (col_w * 2 + 24, max(a.height, b.height) + top), "#ffffff")
    d = ImageDraw.Draw(img)
    d.text((8, 8), f"vivicosenza{' · ' + label if label else ''}", fill="#962d30", font=FONT)
    d.text((col_w + 32, 8), f"Cosenza attrattiva{' · ' + label if label else ''}", fill="#0f7663", font=FONT)
    img.paste(a, (0, top)); img.paste(b, (col_w + 24, top))
    return img

def stack(images, out):
    W = max(i.width for i in images)
    H = sum(i.height for i in images) + 16 * (len(images) - 1)
    S = Image.new("RGB", (W, H), "#d9d4cc"); y = 0
    for i in images:
        S.paste(i, (0, y)); y += i.height + 16
    S.save(out, quality=72, optimize=True)
    print("✔", out)

for w, cw in ((375, 375), (768, 480), (1440, 640)):
    pair(f"{REF}/home-{w}.jpg", f"{OURS}/home-{w}.jpg", cw, "pagina intera, movimento ridotto").save(f"{OUT}/home-{w}-affiancate.jpg", quality=70, optimize=True)
    print("✔", f"{OUT}/home-{w}-affiancate.jpg")

SECTIONS = {
    1440: [("header e hero", 0, 0), ("hero: titolo e curiosità", 3, 3), ("pannelli impilati e foglio in entrata", 10, 12),
           ("foglio (Crea il tuo itinerario → Tre modi)", 11, 13), ("itinerari", 12, 15), ("eventi", 17, 16), ("footer", 18, 18)],
    375: [("header e hero", 0, 0), ("hero: titolo e curiosità", 1, 1), ("pannello MAB", 5, 7), ("pannello Duomo", 7, 9),
          ("pannello San Domenico", 9, 11), ("foglio in entrata", 10, 12), ("itinerari", 13, 16), ("eventi", 16, 17), ("footer", 20, 21)],
}
for w, rows in SECTIONS.items():
    cw = 720 if w == 1440 else 375
    stack([pair(frame(REF, w, r), frame(OURS, w, o), cw, name) for name, r, o in rows], f"{OUT}/sezioni-{w}.jpg")
