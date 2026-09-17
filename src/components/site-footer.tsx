export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-5 py-10 sm:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <p className="font-semibold">Adalie</p>
            <a href="mailto:hi@adalie.com">hi@adalie.com</a>
          </div>
          <p className="max-w-xs text-sm text-[var(--muted)]">
            College Student from California that loves tech and programming.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-label="Social links">
          {[
            ["GitHub", "https://github.com/adaliea"],
            ["Bluesky", "https://bsky.app/profile/adalie.me"],
            ["Twitter", "https://twitter.com/dacubeking"],
            ["LinkedIn", "https://www.linkedin.com/in/adaliea/"],
            ["Instagram", "https://www.instagram.com/dacubeking/"],
            ["YouTube", "https://youtube.com/DaCubeKing"],
            ["RSS", "/feed.xml"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="inline-flex min-h-11 items-center">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
