'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  // Hide header on home page
  if (pathname === '/') return null;

  return (
    <header className="site-header" role="banner">
      <div className="wrapper">
        <Link className="site-title" rel="author" href="/">
          Adalie&apos;s Blog
        </Link>
        <nav className="site-nav">
          <div className="trigger">
            <Link className="page-link" href="/reading">Reading Log</Link>
            <Link className="page-link" href="/projects">Projects</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
