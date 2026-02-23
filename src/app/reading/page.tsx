import Link from 'next/link';

interface Book {
  name: string;
  authors: string[];
  published: string;
  coverLink: string;
  workId: string;
  link: string;
  percentComplete?: number;
}

async function getBooks(): Promise<Book[]> {
  const res = await fetch('https://books.api.dacubeking.com/read', {
    next: { revalidate: 3600 }
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ReadingLog() {
  const books = await getBooks();

  return (
    <main className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
            <Link href="/" className="text-blue-600 hover:underline mb-4 block">← Back to home</Link>
            <h1 className="text-4xl font-bold">Reading Log</h1>
        </header>

        <div className="books">
          {books.map((book, i) => {
             const parsedUrl = new URL(book.coverLink);
             if (parsedUrl.host.includes("books.google.com")) {
               parsedUrl.searchParams.set("fife", "w1000");
             }
             
             return (
                <div key={i} className="book">
                    <div className="book-image">
                        <a href={book.link}>
                            <img src={parsedUrl.toString()} alt={book.name} className="shadow-lg rounded" />
                        </a>
                    </div>
                    <div className="book-title">
                        <a href={book.link}>{book.name}</a>
                    </div>
                    <div className="author">
                        {book.authors.join(' & ')}
                    </div>
                    <div className="published">
                        {book.published}
                    </div>
                    {book.percentComplete !== undefined && (
                        <div className="currently-reading text-blue-600">
                            {Math.round(book.percentComplete * 100)}% complete
                        </div>
                    )}
                </div>
             );
          })}
        </div>

        <footer className="books-bottom-material mt-12 text-sm text-gray-600 dark:text-gray-400">
            Thanks to the <a href="https://openlibrary.org/" className="underline">Open Library</a>
            {' '}and <a href="https://books.google.com/" className="underline">Google Books</a> for providing the data powering this page.
            The backend is run on Cloudflare Workers with the source <a href="https://github.com/adaliea/Workers-Books-Api" className="underline">here</a>.
        </footer>
      </div>
    </main>
  );
}
