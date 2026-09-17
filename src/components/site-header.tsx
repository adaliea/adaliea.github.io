"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["/projects", "Projects"],
  ["/reading", "Reading Log"],
  ["/archive", "Blog Archive"],
  ["/blankfiller", "Blank Filler"],
];

export function SiteHeader() {
  const pathname = usePathname();
  return <HeaderNavigation key={pathname} pathname={pathname} />;
}

function HeaderNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const navigation = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const home = pathname === "/";

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !navigation.current?.contains(event.target))
        setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <header className={`site-header ${home ? "home-header" : ""}`}>
      <nav
        ref={navigation}
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8"
        aria-label="Main navigation"
      >
        {!home && (
          <Link
            href="/"
            className="site-name inline-flex min-h-11 items-center"
            aria-label="Adalie’s Blog home"
          >
            Adalie’s Blog
            <span aria-hidden="true" className="ml-1 text-[var(--pink)]">
              .
            </span>
          </Link>
        )}
        <button
          ref={toggle}
          type="button"
          className="nav-button menu-toggle min-w-11 px-2.5 lg:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="site-navigation-links"
          onClick={() => setOpen(!open)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <div
          id="site-navigation-links"
          className={`menu-links ${open ? "flex" : "hidden"} w-full flex-col gap-2 lg:flex lg:w-auto lg:flex-row lg:flex-wrap`}
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className="nav-button"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
