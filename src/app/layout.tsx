import type { Metadata } from "next";
import "@fontsource-variable/noto-sans/wght.css";
import "@fontsource-variable/noto-sans/wght-italic.css";
import "@fontsource-variable/dancing-script/wght.css";
import "@fontsource/indie-flower/latin.css";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  metadataBase: new URL("https://dacubeking.com"),
  title: { default: "Adalie’s Blog", template: "%s | Adalie’s Blog" },
  description: "College Student from California that loves tech and programming.",
  alternates: { types: { "application/atom+xml": "/feed.xml" } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="page-content flex-1" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
