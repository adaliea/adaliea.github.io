export const booksApi = "https://books.api.dacubeking.com";

export type Book = {
  name: string;
  link: string;
  authors: string[];
  authorLinks: string[];
  published: string;
  coverLink: string;
  workId: string;
  list: string;
  pages: number;
  percentComplete: number;
  coverWidth: number;
  coverHeight: number;
};

export type HomepageInfo = {
  readingBooks: Book[];
  favoriteTrack?: { name: string; url: string; artist: { name: string; url: string } };
};

export function safeUrl(value: string | undefined) {
  try {
    const url = new URL(value || "");
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function percentage(value: number) {
  return Math.round(Math.max(0, Math.min(1, Number(value) || 0)) * 100);
}
