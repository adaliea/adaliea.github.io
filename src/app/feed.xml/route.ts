import { posts, siteUrl } from "@/lib/content";

export const dynamic = "force-static";
function xml(value: string) {
  return value.replace(
    /[<>&"']/g,
    (char) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char] || char,
  );
}

export function GET() {
  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
<title>Adalie's Blog</title><subtitle>College Student from California that loves tech and programming.</subtitle>
<link href="${siteUrl}/feed.xml" rel="self" type="application/atom+xml"/><link href="${siteUrl}/" rel="alternate" type="text/html"/>
<id>${siteUrl}/feed.xml</id><updated>${posts[0]?.date || "2026-01-01"}T00:00:00Z</updated><author><name>Adalie</name></author>
${posts.map((post) => `<entry><title>${xml(post.title)}</title><id>${siteUrl}${post.url.replace(/\.html$/, "")}</id><link href="${siteUrl}${post.url}" rel="alternate" type="text/html"/><published>${post.date}T00:00:00Z</published><updated>${post.date}T00:00:00Z</updated><summary type="html">${xml(post.excerpt)}</summary><content type="html" xml:base="${siteUrl}${post.url}">${xml(post.html)}</content></entry>`).join("\n")}
</feed>`;
  return new Response(feed, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
