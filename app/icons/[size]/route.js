import { ImageResponse } from "next/og";
export const runtime = "edge";
export async function GET(req, { params }) {
  const s = Math.min(512, Math.max(48, +params.size || 192));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b4f3a", color: "#ffffff", fontSize: s * 0.45, fontWeight: 800 }}>HI</div>,
    { width: s, height: s });
}
