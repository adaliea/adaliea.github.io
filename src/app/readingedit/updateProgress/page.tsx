import type { Metadata } from "next";
import { ProgressEditor } from "@/components/reading-editors";
import { getBooks } from "@/lib/books-server";

export const metadata: Metadata = { title: "Update Reading Progress" };
export const dynamic = "force-dynamic";
export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [params, books] = await Promise.all([searchParams, getBooks(true)]);
  let updatedBooks = books;
  if (typeof params.overrideJson === "string") {
    try {
      let override: { workId?: string; percent?: number; totalPages?: number };
      try {
        override = JSON.parse(params.overrideJson);
      } catch {
        override = JSON.parse(decodeURIComponent(params.overrideJson));
      }
      const pages = Number(override.totalPages),
        percent = Number(override.percent);
      if (
        Number.isFinite(pages) &&
        pages > 0 &&
        Number.isFinite(percent) &&
        percent >= 0 &&
        percent <= 1
      )
        updatedBooks =
          books?.map((book) =>
            book.workId === override.workId ? { ...book, pages, percentComplete: percent } : book,
          ) || null;
    } catch {
      /* Invalid optional overrides do not prevent editing the book. */
    }
  }
  return (
    <div className="content-shell page-shell">
      <h1 className="page-title">Update Reading Progress</h1>
      <ProgressEditor books={updatedBooks} />
    </div>
  );
}
