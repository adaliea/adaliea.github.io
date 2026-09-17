import Link from "next/link";
import { formatDate, type Post } from "@/lib/content";

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="divide-y divide-[var(--border)]">
      {posts.map((post) => (
        <li key={post.url} className="py-8 first:pt-4">
          <div className="mb-2 flex flex-wrap gap-x-3 text-sm text-[var(--muted)]">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h3 className="mb-3 text-2xl leading-snug font-semibold sm:text-[1.75rem]">
            <Link href={post.url}>{post.title}</Link>
          </h3>
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted repository Markdown compiled at build time. */}
          <div className="prose excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          <Link
            href={post.url}
            className="read-link mt-4 inline-flex min-h-11 items-center gap-2 font-medium"
            aria-label={`Read ${post.title}`}
          >
            Read post <span aria-hidden="true">↗</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
