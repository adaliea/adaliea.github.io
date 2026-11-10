import localFont from "next/font/local";

// Only the homepage title uses this, so it's imported from the Introduction component and
// next/font preloads it on that route alone. Keeps the Fontsource family name used in globals.css;
// `variable` exposes the metric-matched fallback font, which globals.css appends to the stack.
export const dancingScript = localFont({
  src: "../../node_modules/@fontsource-variable/dancing-script/files/dancing-script-latin-wght-normal.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  preload: true,
  variable: "--font-dancing-script",
  declarations: [{ prop: "font-family", value: "Dancing Script Variable" }],
});
