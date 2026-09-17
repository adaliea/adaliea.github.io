"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { type Book, booksApi, percentage, safeUrl } from "@/lib/books";

export function ReadingError() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div role="alert" className="rounded-xl border border-[var(--border)] p-6">
      <p className="mb-4">The reading log couldn’t load. Please try again.</p>
      <button
        type="button"
        className="button"
        disabled={pending}
        onClick={() => startTransition(() => router.refresh())}
      >
        {pending ? "Loading…" : "Try again"}
      </button>
    </div>
  );
}

export function BookCover({ book }: { book: Book }) {
  const [failed, setFailed] = useState(false);
  const src = safeUrl(book.coverLink);
  return src && !failed ? (
    <Image
      src={src}
      alt={`Cover of ${book.name}`}
      width={book.coverWidth}
      height={book.coverHeight}
      className="h-full w-full object-contain"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="flex h-full items-center justify-center p-4 text-center text-sm text-[var(--muted)]">
      {book.name}
    </span>
  );
}

export function ReadingLog({ books, edit = false }: { books: Book[] | null; edit?: boolean }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = books?.filter(
    (book) =>
      `${book.name} ${book.authors.join(" ")}`.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "all" || book.list === filter),
  );
  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="book-search" className="field-label">
            Find a book
          </label>
          <input
            id="book-search"
            type="search"
            className="field"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or author"
          />
        </div>
        <div>
          <label htmlFor="book-filter" className="field-label">
            Reading status
          </label>
          <select
            id="book-filter"
            className="field"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All books</option>
            <option>Currently Reading</option>
            <option>Already Read</option>
          </select>
        </div>
      </div>
      {!books ? (
        <ReadingError />
      ) : (
        <>
          <p role="status" className="mb-5 text-sm text-[var(--muted)]">
            {filtered?.length} {filtered?.length === 1 ? "book" : "books"}
            {query ? ` matching “${query}”` : " on the shelf"}
          </p>
          {filtered?.length === 0 && (
            <p className="py-8">No books found. Try another title or author.</p>
          )}
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4">
            {filtered?.map((book) => {
              const href = edit
                ? `${booksApi}/bestedition?${new URLSearchParams({ workId: book.workId, render: "true", bypassCache: "true" })}`
                : safeUrl(book.link);
              return (
                <article key={book.workId} className="min-w-0">
                  <a
                    href={href}
                    className="mb-4 flex aspect-[2/3] overflow-hidden rounded-lg bg-[var(--surface)]"
                  >
                    <BookCover book={book} />
                  </a>
                  <h2 className="text-base leading-snug font-semibold sm:text-lg">
                    <a href={href}>{book.name}</a>
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{book.authors.join(", ")}</p>
                  <p className="text-xs text-[var(--muted)]">{book.published}</p>
                  {book.list === "Currently Reading" && (
                    <div className="mt-3">
                      <p className="text-xs font-medium">
                        Currently reading · {percentage(book.percentComplete)}%
                      </p>
                      <progress
                        className="mt-1 h-1.5 w-full accent-[var(--link)]"
                        max="100"
                        value={percentage(book.percentComplete)}
                        aria-label={`${book.name} reading progress`}
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export function ReadingCredits() {
  return (
    <p className="mt-14 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
      Thanks to <a href="https://openlibrary.org/">Open Library</a> and{" "}
      <a href="https://books.google.com/">Google Books</a> for providing the data powering this
      page. The backend is run on Cloudflare Workers with the source{" "}
      <a href="https://github.com/adaliea/Workers-Books-Api">on GitHub</a>.
    </p>
  );
}
