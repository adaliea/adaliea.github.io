import content from "@/generated/content.json";

export const posts = content.posts;
export const projects = content.projects;
export const siteUrl = "https://dacubeking.com";
export type Post = (typeof posts)[number];

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
