import { ImageResponse } from "next/og";

export const dynamic = "force-static";

const SIZES = new Set([180, 192, 512]);

/** Icone PWA generate: arco del ponte su fondo rosso Magliocco. */
export async function GET(req: Request, ctx: { params: Promise<{ size: string }> }) {
  const size = Number((await ctx.params).size);
  if (!SIZES.has(size)) return new Response("Not found", { status: 404 });
  const maskable = new URL(req.url).searchParams.has("maskable");
  const pad = maskable ? size * 0.2 : size * 0.12;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6e1b33",
          borderRadius: maskable ? 0 : size * 0.22,
        }}
      >
        <svg width={size - pad * 2} height={size - pad * 2} viewBox="0 0 32 32">
          <path d="M6 23c3-9 7-13 10-13s7 4 10 13" fill="none" stroke="#e3c58f" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M16 10V5.5" stroke="#e3c58f" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M5 26.5h22" stroke="#8fb59b" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
