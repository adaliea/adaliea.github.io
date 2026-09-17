import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, posts } from "@/lib/content";

export const metadata: Metadata = { title: "Blog Archive", alternates: { canonical: "/archive" } };
export default function ArchivePage() {
  const tags = [...new Set(posts.flatMap((post) => post.tags))];
  return (
    <div className="content-shell page-shell">
      <h1 className="page-title">Blog Archive</h1>
      {tags.map((tag) => (
        <section key={tag} className="mt-8">
          <h2 className="mb-2 text-2xl font-semibold">{tag}</h2>
          <ul className="divide-y divide-[var(--border)]">
            {posts
              .filter((post) => post.tags.includes(tag))
              .map((post) => (
                <li key={post.url} className="py-5">
                  <time dateTime={post.date} className="mb-1 block text-sm text-[var(--muted)]">
                    {formatDate(post.date)}
                  </time>
                  <Link className="inline-flex min-h-11 items-center text-lg" href={post.url}>
                    {post.title}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
