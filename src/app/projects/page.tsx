import type { Metadata } from "next";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "My Programming Projects",
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
