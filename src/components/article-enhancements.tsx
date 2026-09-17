"use client";

import { useEffect, useRef } from "react";

export function ArticleNotes() {
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    let removeClick: (() => void) | undefined;
    import("../../_ts/src/notes").then(({ initializeNotes, toggleShowBoundingBoxes }) => {
      if (disposed) return;
      cleanup = initializeNotes();
      const button = document.querySelector<HTMLButtonElement>("[data-toggle-bounds]");
      const onClick = () => {
        toggleShowBoundingBoxes();
        button?.setAttribute(
          "aria-pressed",
          String(button.getAttribute("aria-pressed") !== "true"),
        );
      };
      button?.addEventListener("click", onClick);
      removeClick = () => button?.removeEventListener("click", onClick);
    });
    return () => {
      disposed = true;
      cleanup?.();
      removeClick?.();
    };
  }, []);
  return null;
}

export function Comments() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    const settings = {
      repo: "adaliea/adaliea.github.io",
      "repo-id": "R_kgDOHM_MZg",
      category: "Comments",
      "category-id": "DIC_kwDOHM_MZs4ClgCB",
      mapping: "og:title",
      strict: "0",
      "reactions-enabled": "0",
      "emit-metadata": "0",
      "input-position": "top",
      theme: "preferred_color_scheme",
      lang: "en",
      loading: "lazy",
    };
    for (const [key, value] of Object.entries(settings)) script.setAttribute(`data-${key}`, value);
    element.appendChild(script);
    return () => element.replaceChildren();
  }, []);
  return <section className="mt-10" ref={container} aria-label="Comments" />;
}
