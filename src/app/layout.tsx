import type { Metadata } from "next";
import { notoSans } from "@/fonts/noto-sans";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { authorName, defaultOgImage, siteDescription, siteName, siteUrl } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${authorName} | ${siteName}`, template: `%s | ${authorName}` },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: authorName, url: siteUrl }],
  creator: authorName,
  alternates: { types: { "application/atom+xml": "/feed.xml" } },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_US",
    description: siteDescription,
    images: [defaultOgImage],
  },
  twitter: { card: "summary_large_image", creator: "@dacubeking" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={notoSans.variable} data-scroll-behavior="smooth">
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
