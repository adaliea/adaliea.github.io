import type { Metadata } from "next";
import { ReadingCredits, ReadingLog } from "@/components/reading-log";
import { getBooks } from "@/lib/books-server";

export const metadata: Metadata = { title: "Reading Log", alternates: { canonical: "/reading" } };
export const dynamic = "force-dynamic";
export default async function ReadingPage() {
  const books = await getBooks();
  return (
    <div className="page-shell mx-auto max-w-6xl px-5 sm:px-8">
      <h1 className="page-title">Reading Log</h1>
      <ReadingLog books={books} />
      <ReadingCredits />
    </div>
  );
}
