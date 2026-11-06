import type { Metadata } from "next";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "My Programming Projects",
  description:
    "Software projects by Adalie Ahuja, including Better Lyrics for YouTube Music, robotics code, and other open-source work.",
  alternates: { canonical: "/projects" },
};
export default function ProjectsPage() {
  return (
    <article className="content-shell page-shell">
      <h1 className="page-title">{projects.title}</h1>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted repository Markdown compiled at build time. */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: projects.html }} />
    </article>
  );
}
