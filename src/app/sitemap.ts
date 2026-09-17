import type { MetadataRoute } from "next";
import { posts, siteUrl } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["/", "/projects", "/archive", "/reading", "/blankfiller"].map((path) => ({
      url: `${siteUrl}${path}`,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}${post.url}`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
    })),
  ];
}
