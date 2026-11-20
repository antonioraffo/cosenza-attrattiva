import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

const SIZES = new Set([180, 192, 512]);

/** Icone PWA generate dal marchio ufficiale su fondo bianco (variante "maskable" con margine di sicurezza). */
export async function GET(req: Request, ctx: { params: Promise<{ size: string }> }) {
  const size = Number((await ctx.params).size);
  if (!SIZES.has(size)) return new Response("Not found", { status: 404 });
  const maskable = new URL(req.url).searchParams.has("maskable");
  const svg = await readFile(path.join(process.cwd(), "public/brand/mark.svg"));
  const src = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  const inner = size * (maskable ? 0.58 : 0.74);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={inner} height={(inner * 416) / 476} alt="" />
      </div>
    ),
    { width: size, height: size },
  );
}
