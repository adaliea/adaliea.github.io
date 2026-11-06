import content from "@/generated/content.json";

export const posts = content.posts;
export const projects = content.projects;
export const siteUrl = "https://adalie.me";
// Atom IDs must never change, or feed readers show every post as new.
export const feedIdBase = "https://dacubeking.com";
export const authorName = "Adalie Ahuja";
export const siteName = "Adalie’s Blog";
export const siteDescription =
  "Adalie Ahuja is a Computer Science and Math student at Penn State from Los Angeles, writing about programming, robotics, photography, and books.";
export const defaultOgImage = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "Pink clouds at sunset",
};
export const socialProfiles = {
  GitHub: "https://github.com/adaliea",
  Bluesky: "https://bsky.app/profile/adalie.me",
  Twitter: "https://twitter.com/dacubeking",
  LinkedIn: "https://www.linkedin.com/in/adaliea/",
  Instagram: "https://www.instagram.com/adalie.me/",
  YouTube: "https://youtube.com/DaCubeKing",
};
export type Post = (typeof posts)[number];

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
