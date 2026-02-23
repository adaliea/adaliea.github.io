import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Adalie's Blog",
  description: "College Student from California that loves tech and programming.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Indie+Flower&display=swap" rel="stylesheet" />
        <link id="fa-stylesheet" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.0.0/css/all.min.css" />
        <link href="/js/highlightjs/styles/github-dark.css" media="(prefers-color-scheme: dark)" rel="stylesheet" />
        <link href="/js/highlightjs/styles/github.css" media="not (prefers-color-scheme: dark)" rel="stylesheet" />
        <script src="/js/highlightjs/highlight.min.js" async></script>
      </head>
      <body>
        <Header />
        {children}
        <footer className="site-footer h-card py-12 mt-12">
          <div className="wrapper flex flex-col md:flex-row justify-between gap-8">
            <div className="footer-col">
              <ul className="contact-list list-none p-0">
                <li className="p-name font-bold">Adalie</li>
                <li><a className="u-email text-blue-600 underline" href="mailto:hi@adalie.me">hi@adalie.me</a></li>
              </ul>
            </div>
            <div className="footer-col max-w-md">
              <p>College Student from California that loves tech and programming.</p>
            </div>
            <div className="social-links flex gap-4">
              <a href="https://github.com/adaliea" title="Github"><i className="fab fa-github text-2xl"></i></a>
              <a href="https://bsky.app/profile/adalie.me" title="Bluesky"><i className="fa-brands fa-bluesky text-2xl"></i></a>
              <a href="https://twitter.com/dacubeking" title="Twitter"><i className="fab fa-twitter text-2xl"></i></a>
              <a href="https://www.linkedin.com/in/adaliea/" title="LinkedIn"><i className="fab fa-linkedin text-2xl"></i></a>
              <a href="https://www.instagram.com/dacubeking/" title="Instagram"><i className="fab fa-instagram text-2xl"></i></a>
              <a href="https://youtube.com/DaCubeKing" title="Youtube"><i className="fab fa-youtube text-2xl"></i></a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
