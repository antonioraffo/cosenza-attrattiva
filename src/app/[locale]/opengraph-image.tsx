import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Cosenza attrattiva";

/** Anteprima social: marchio ufficiale, payoff della mission e i quattro colori del logo. */
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mission" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const svg = await readFile(path.join(process.cwd(), "public/brand/logo-h.svg"));
  const logo = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#ffffff" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={520} height={164} alt="" />
          <div style={{ marginTop: 48, fontSize: 64, fontWeight: 700, color: "#211e1c", letterSpacing: -2 }}>{t("title")}</div>
          <div style={{ marginTop: 16, fontSize: 30, color: "#665f55", maxWidth: 900 }}>{tm("description")}</div>
        </div>
        <div style={{ display: "flex", height: 24 }}>
          {["#128771", "#9c37b5", "#1a98c4", "#dd7b19"].map((c) => (
            <div key={c} style={{ flex: 1, background: c }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
