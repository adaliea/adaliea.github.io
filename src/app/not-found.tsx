import Link from "next/link";

export default function NotFound() {
  return (
    <div className="content-shell page-shell">
      <p className="mb-3 text-sm text-[var(--muted)]">404</p>
      <h1 className="page-title">This page wandered off.</h1>
      <p className="mb-6">Try the blog archive, or head back home.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="button">
          Back home
        </Link>
        <Link href="/archive" className="button button-secondary">
          Blog archive
        </Link>
      </div>
    </div>
  );
}
