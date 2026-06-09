import { ImageResponse } from "next/og";

export const alt = "Palm Inversiones — Tu asesor financiero personal en Argentina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#101B3B",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            height: "10px",
            width: "220px",
            borderRadius: "999px",
            background: "linear-gradient(90deg,#26428B,#9747FF,#F0C14D)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: "92px", fontWeight: 700, color: "#FFFCF5", lineHeight: 1.05 }}>
            De ahorrista a inversor.
          </div>
          <div style={{ fontSize: "40px", color: "#F0C14D", fontWeight: 500 }}>
            Tu asesor financiero personal. Sin letra chica.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "44px", fontWeight: 700, color: "#FFFCF5" }}>Palm Inversiones</div>
          <div style={{ fontSize: "28px", color: "rgba(255,252,245,0.6)" }}>Regulado por CNV · Hecho en Argentina</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
