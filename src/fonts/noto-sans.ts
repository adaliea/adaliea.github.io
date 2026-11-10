import localFont from "next/font/local";

// Same family name, faces and unicode-ranges as the Fontsource CSS this replaces, so existing
// `font-family: "Noto Sans Variable"` rules keep working. Splitting into separate calls lets the
// regular Latin face preload on every page without also preloading italic and latin-ext.
// next/font only accepts literal arguments, so the unicode-ranges are repeated rather than shared.
//
// `variable` exposes the generated metric-matched fallback font (Arial adjusted to Noto's metrics,
// which cuts layout shift while the real font loads); globals.css appends it to the font stack.

export const notoSans = localFont({
  src: "../../node_modules/@fontsource-variable/noto-sans/files/noto-sans-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  preload: true,
  variable: "--font-noto-sans",
  declarations: [
    { prop: "font-family", value: "Noto Sans Variable" },
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    },
  ],
});

export const notoSansItalic = localFont({
  src: "../../node_modules/@fontsource-variable/noto-sans/files/noto-sans-latin-wght-italic.woff2",
  weight: "100 900",
  style: "italic",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Noto Sans Variable" },
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    },
  ],
});

export const notoSansLatinExt = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/noto-sans/files/noto-sans-latin-ext-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/noto-sans/files/noto-sans-latin-ext-wght-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Noto Sans Variable" },
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
    },
  ],
});
