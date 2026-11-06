/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: Only escaped JSON-LD is rendered. */
import type { Metadata } from "next";
import Link from "next/link";
import { Introduction } from "@/components/introduction";
import { PostList } from "@/components/post-list";
import { getHomepageInfo } from "@/lib/books-server";
import {
  authorName,
  defaultOgImage,
  posts,
  siteDescription,
  siteName,
  siteUrl,
  socialProfiles,
} from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName,
    locale: "en_US",
    title: authorName,
    images: [defaultOgImage],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: siteName,
      description: siteDescription,
      inLanguage: "en-US",
      author: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: `${siteUrl}/`,
      name: authorName,
      isPartOf: { "@id": `${siteUrl}/#website` },
      mainEntity: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: authorName,
      alternateName: ["Adalie", "DaCubeKing", "adaliea"],
      url: `${siteUrl}/`,
      image: `${siteUrl}${defaultOgImage.url}`,
      description: siteDescription,
      homeLocation: { "@type": "Place", name: "Los Angeles, California" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "The Pennsylvania State University" },
      knowsAbout: ["Computer Science", "Mathematics", "Programming", "Robotics", "Photography"],
      sameAs: Object.values(socialProfiles),
    },
  ],
};
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const info = await getHomepageInfo();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="intro-bg" aria-label="About Adalie">
        <div className="intro">
          <Introduction info={info} />
        </div>
        <svg
          viewBox="0 0 500 62"
          className="intro-border"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="var(--background)"
            d="M 446.349 44.811 C 470.785 44.262 496.544 41.664 518.252 30.431 C 529.372 24.677 500.553 51.817 500.553 51.817 L 501.752 78.734 L -5.254 79.103 C -5.254 79.103 -13.948 10.919 -6.084 27.481 C -1.033 38.118 10.642 46.901 22.308 48.498 C 44.472 51.531 64.693 26.197 84.993 24.531 C 119.724 21.68 140.63 62.776 181.969 60.667 C 218.623 58.797 254.41 28.156 290.376 20.844 C 341.923 10.364 393.761 45.992 446.349 44.811 Z"
          />
        </svg>
      </section>
      <section className="content-shell pt-10 sm:pt-14" aria-labelledby="blog-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="blog-heading" className="text-3xl font-semibold sm:text-4xl">
            Blog Posts
          </h2>
          <Link href="/archive" className="button button-secondary">
            View archive <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <PostList posts={posts} />
      </section>
    </>
  );
}
