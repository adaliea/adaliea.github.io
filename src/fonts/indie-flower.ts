import localFont from "next/font/local";

// Used for margin notes, which only some posts have. next/font can only preload per route, not per
// post, so preloading would waste a download (and log an unused-preload warning) on posts without
// notes. Imported from the post route so the @font-face only ships there. Keeps the family name that
// globals.css and _ts/src/notes.ts (document.fonts.load) look for; `variable` exposes the
// metric-matched fallback font for the inline note text shown before the notes render.
export const indieFlower = localFont({
  src: "../../node_modules/@fontsource/indie-flower/files/indie-flower-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: false,
  variable: "--font-indie-flower",
  declarations: [{ prop: "font-family", value: "Indie Flower" }],
});
