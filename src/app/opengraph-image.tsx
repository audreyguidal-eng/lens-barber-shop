import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Len's Barber Shop — Barbier à Saintry-sur-Seine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0B1626 0%, #12233B 60%, #1F6B54 140%)",
          color: "#FAF8F4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              background: "#C9A25A",
              color: "#0E0F12",
              fontSize: 40,
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            L
          </div>
          <div style={{ fontSize: 30, letterSpacing: 2, opacity: 0.85 }}>
            SAINTRY-SUR-SEINE · 91250
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 900, lineHeight: 1 }}>
            LEN&apos;S <span style={{ color: "#C9A25A" }}>BARBER</span> SHOP
          </div>
          <div style={{ fontSize: 34, marginTop: 20, opacity: 0.8 }}>
            Coupes • Dégradés • Barbe • Enfants • Afro • Femmes
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
          <span style={{ color: "#C9A25A" }}>★★★★★</span>
          <span style={{ fontWeight: 700 }}>4,7/5</span>
          <span style={{ opacity: 0.7 }}>· 221 avis Google · Le mieux noté du secteur</span>
        </div>
      </div>
    ),
    size,
  );
}
