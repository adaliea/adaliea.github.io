import { type Book, type HomepageInfo, percentage, safeUrl } from "@/lib/books";

export function CurrentlyReading({ books }: { books: Book[] }) {
  if (!books.length) return null;
  return (
    <span aria-live="polite">
      Currently, I’m reading{" "}
      {books.map((book, index) => (
        <span key={book.workId}>
          {index > 0 ? (index === books.length - 1 ? " & " : ", ") : ""}
          <a href={safeUrl(book.link)}>{book.name}</a> by{" "}
          {new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(book.authors)}{" "}
          <span className="reading-percentage">({percentage(book.percentComplete)}% done!)</span>
        </span>
      ))}
      .{" "}
    </span>
  );
}

export function FavoriteSong({ track }: { track: HomepageInfo["favoriteTrack"] }) {
  if (!track?.artist) return null;
  return (
    <span aria-live="polite">
      My current favorite is <a href={safeUrl(track.url)}>{track.name}</a> by{" "}
      <a href={safeUrl(track.artist.url)}>{track.artist.name}</a>.
    </span>
  );
}
