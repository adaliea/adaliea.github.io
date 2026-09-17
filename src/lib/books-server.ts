import "server-only";
import { cache } from "react";
import { type Book, booksApi, type HomepageInfo } from "./books";

function withCoverDimensions(book: Book): Book {
  // Reserve the same 2:3 cover box in the server HTML and CSS. object-contain
  // preserves each original cover's proportions without a browser measurement.
  return { ...book, coverWidth: 320, coverHeight: 480 };
}

async function getJson(path: string): Promise<unknown> {
  const response = await fetch(`${process.env.BOOKS_API_URL || booksApi}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Books API returned ${response.status}`);
  return response.json();
}

function isBook(book: unknown): book is Book {
  if (!book || typeof book !== "object") return false;
  return (
    "name" in book &&
    typeof book.name === "string" &&
    "workId" in book &&
    typeof book.workId === "string" &&
    "authors" in book &&
    Array.isArray(book.authors)
  );
}

export const getBooks = cache(async (bypassCache = false): Promise<Book[] | null> => {
  try {
    const data = await getJson(`/read${bypassCache ? "?bypassCache=true" : ""}`);
    if (!Array.isArray(data)) throw new Error("Invalid reading log response");
    return data.filter(isBook).map(withCoverDimensions);
  } catch (error) {
    console.error(
      "Reading log unavailable:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return null;
  }
});

export const getHomepageInfo = cache(async (): Promise<HomepageInfo | null> => {
  try {
    const data = (await getJson("/homepageinfo")) as HomepageInfo;
    if (!data || !Array.isArray(data.readingBooks)) return null;
    return { ...data, readingBooks: data.readingBooks.filter(isBook).map(withCoverDimensions) };
  } catch (error) {
    console.error(
      "Homepage activity unavailable:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return null;
  }
});
