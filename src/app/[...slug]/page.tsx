/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: Only trusted build-generated Markdown and escaped JSON-LD are rendered. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleNotes, Comments } from "@/components/article-enhancements";
import { formatDate, posts, siteUrl } from "@/lib/content";

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string[] }> };
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.url.slice(1).split("/") }));
}

async function getPost({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((post) => post.url === `/${slug.join("/")}`);
  if (!post) notFound();
  return post;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const post = await getPost(props);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: post.url },
    // Keep the exact old og:title: Giscus uses this as its discussion key.
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: `${post.date}T00:00:00Z`,
      url: post.url,
    },
  };
}

export default async function BlogPost(props: Props) {
  const post = await getPost(props);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Person", name: "Adalie" },
    url: `${siteUrl}${post.url}`,
  };
  return (
    <article className="content-shell page-shell" key={post.url}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <header className="mb-8">
        <h1 className="page-title">{post.title}</h1>
        <p className="text-sm text-[var(--muted)]">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          {post.readingMinutes} min read
        </p>
      </header>
      <div className="prose post-content" dangerouslySetInnerHTML={{ __html: post.html }} />
      {post.hasNotes && <ArticleNotes key={`notes-${post.url}`} />}
      <p className="mt-12 border-t border-[var(--border)] pt-6 italic">
        Thanks for reading! If you liked this, or found it helpful, maybe consider{" "}
        <a href="https://github.com/sponsors/adaliea">buying me a coffee</a>?
      </p>
      <Comments key={post.url} />
    </article>
  );
}
