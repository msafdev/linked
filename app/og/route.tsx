import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const runtime = "edge";
const size = {
  width: 1200,
  height: 630,
};

const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=Besley:wght@600&text=Linked";

const fontDataPromise = fetch(FONT_CSS_URL, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
})
  .then((response) => response.text())
  .then((css) => {
    const fontUrlMatch = css.match(
      /src: url\((https:\/\/[^)]+)\) format\('woff2'\)/,
    );
    if (!fontUrlMatch) {
      throw new Error("Failed to locate Besley font URL for OG image.");
    }
    return fetch(fontUrlMatch[1]);
  })
  .then((fontResponse) => fontResponse.arrayBuffer())
  .catch((error) => {
    console.error("[og][font]", error);
    return null;
  });

export async function GET() {
  const fontData = await fontDataPromise;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a, #1f2937)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            padding: "40px 80px",
            borderRadius: "999px",
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            color: "#f8fafc",
            fontSize: 128,
            fontWeight: 600,
            letterSpacing: "-0.04em",
          }}
        >
          {SITE_NAME}
        </span>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Besley",
              data: fontData,
              weight: 600,
              style: "normal",
            },
          ]
        : [],
    },
  );
}
