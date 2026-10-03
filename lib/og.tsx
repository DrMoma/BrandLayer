import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/**
 * OG card: the mark, drawn from the same coordinates as the real logo, on
 * the deep neutral ground the site's footer uses. Generated rather than
 * exported, so it never falls out of sync with the site's own wordmark.
 */
export function ogCard({ headline, sub }: { headline: string; sub: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#141414",
          padding: 72,
        }}
      >
        <svg viewBox="0 0 138 133" width={104} height={100} fill="#fafafa">
          <path d="M0 45 L90 0 L138 24 L48 69 Z" />
          <path d="M0 109 L90 64 L138 88 L48 133 Z" />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 84,
              lineHeight: 0.9,
              letterSpacing: -3,
              color: "#fafafa",
              fontWeight: 600,
              display: "flex",
            }}
          >
            {headline}
          </div>
          <div style={{ fontSize: 28, color: "#a3a3a3", display: "flex" }}>{sub}</div>
        </div>
      </div>
    ),
    ogSize
  );
}
