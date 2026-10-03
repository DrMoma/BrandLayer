import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141414",
        }}
      >
        <svg viewBox="0 0 138 133" width={112} height={108} fill="#fafafa">
          <path d="M0 45 L90 0 L138 24 L48 69 Z" />
          <path d="M0 109 L90 64 L138 88 L48 133 Z" />
        </svg>
      </div>
    ),
    size
  );
}
