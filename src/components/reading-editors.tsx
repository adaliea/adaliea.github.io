"use client";

import { useState } from "react";
import { type Book, booksApi } from "@/lib/books";
import { BookCover, ReadingError } from "./reading-log";

export type TitleData = {
  workId: string;
  cover: string;
  book: Record<string, unknown> & { name: string };
};

export function TitleEditor({ data }: { data: TitleData }) {
  const [title, setTitle] = useState(data.book.name);
  return (
    <form action={`${booksApi}/bestedition/edit`} method="get">
      <input type="hidden" name="workId" value={data.workId} />
      <input type="hidden" name="cover" value={data.cover} />
      <input
        type="hidden"
        name="overrideData"
        value={JSON.stringify({ ...data.book, name: title })}
      />
      <label htmlFor="book-title" className="field-label">
        Title
      </label>
      <input
        id="book-title"
        className="field mb-5"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <button className="button" type="submit">
        Save title
      </button>
    </form>
  );
}

function ProgressForm({ book }: { book: Book }) {
  const [total, setTotal] = useState(Number(book.pages) || 1);
  const [read, setRead] = useState(
    Math.round((Number(book.percentComplete) || 0) * (Number(book.pages) || 1)),
  );
  return (
    <form
      className="rounded-xl border border-[var(--border)] p-5 sm:p-6"
      action={`${booksApi}/updateProgress`}
      method="get"
    >
      <input type="hidden" name="workId" value={book.workId} />
      <input type="hidden" name="percent" value={total > 0 ? read / total : 0} />
      <div className="mb-5 flex items-center gap-5">
        <div className="h-28 w-20 shrink-0">
          <BookCover book={book} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{book.name}</h2>
          <p className="text-sm text-[var(--muted)]">{book.authors.join(", ")}</p>
        </div>
      </div>
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <label className="block">
          Pages read
          <input
            className="field mt-1"
            type="number"
            min="0"
            max={total}
            value={read}
            onChange={(event) => setRead(Number(event.target.value))}
            required
          />
        </label>
        <label className="block">
          Total pages
          <input
            className="field mt-1"
            type="number"
            name="totalPages"
            min="1"
            max="100000"
            value={total}
            onChange={(event) => setTotal(Number(event.target.value))}
            required
          />
        </label>
        <label className="block">
          Percent complete
          <input
            className="field mt-1"
            type="number"
            min="0"
            max="100"
            value={total > 0 ? Math.round((read / total) * 100) : 0}
            onChange={(event) => setRead(Math.round((Number(event.target.value) * total) / 100))}
            required
          />
        </label>
      </div>
      <button className="button" type="submit">
        Save progress
      </button>
    </form>
  );
}

export function ProgressEditor({ books }: { books: Book[] | null }) {
  if (!books) return <ReadingError />;
  const current = books.filter((book) => book.list === "Currently Reading");
  return (
    <div className="space-y-6">
      {current.length ? (
        current.map((book) => <ProgressForm key={book.workId} book={book} />)
      ) : (
        <p>No books are currently marked as reading.</p>
      )}
    </div>
  );
}
