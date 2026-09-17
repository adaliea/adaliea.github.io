import { load } from "cheerio";
import matter from "gray-matter";
import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";

// Match Jekyll/Kramdown's heading anchors, including existing deep links.
export function headingSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

const markdown = new MarkdownIt({
  html: true,
  typographer: true,
  highlight(code, language) {
    return language && hljs.getLanguage(language) ? hljs.highlight(code, { language }).value : "";
  },
}).use(anchor, { slugify: headingSlug });

export function renderMarkdown(source) {
  // These are trusted, repository-authored documents, never user/API input.
  const $ = load(markdown.render(source.replace(/<head>[\s\S]*?<\/head>/g, "")), null, false);
  let noteIndex = 0;
  // Preserve the existing notation, including inline HTML inside notes.
  const withNotes = $.html().replace(/%\$([\s\S]*?)\$%/g, (_, note) => {
    const marker = $("<span class='note'></span>");
    marker.attr("id", `note-${noteIndex++}`).attr("data-note-text", note);
    marker.append($("<span class='note-fallback'></span>").html(note));
    return $.html(marker);
  });
  const document = load(withNotes, null, false);
  document("p, li, h1, h2, h3, h4, h5, h6").wrapInner("<span></span>");
  document("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]").each((_, element) => {
    const heading = document(element);
    heading.append(
      document("<a class='heading-link'>#</a>")
        .attr("href", `#${heading.attr("id")}`)
        .attr("aria-label", `Link to ${heading.text()}`),
    );
  });
  document("img").attr("loading", "lazy").attr("decoding", "async");
  document("img[src^='assets/']").each((_, element) => {
    document(element).attr("src", `/${document(element).attr("src")}`);
  });
  document("iframe").attr("loading", "lazy");
  document("button[onclick='toggleShowBoundingBoxes()']")
    .removeAttr("onclick")
    .attr("data-toggle-bounds", "")
    .attr("aria-pressed", "false");
  return document.html();
}

export function parsePost(filename, source) {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})-(.+)\.md$/.exec(filename);
  if (!match) throw new Error(`Invalid post filename: ${filename}`);
  const [, year, month, day, slug] = match;
  const { data, content } = matter(source);
  if (!data.title) throw new Error(`Missing title: ${filename}`);
  const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const html = renderMarkdown(content);
  const text = load(html).text().replace(/\s+/g, " ").trim();
  const excerpt = data.excerpt ? markdown.render(data.excerpt) : load(html)("p").first().toString();
  return {
    filename,
    title: load(markdown.renderInline(data.title)).text(),
    date,
    url:
      data.permalink || `/${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")}/${slug}.html`,
    tags: data.tags ? (Array.isArray(data.tags) ? data.tags : data.tags.split(/\s+/)) : ["Other"],
    description: load(excerpt).text().trim(),
    excerpt,
    html,
    readingMinutes: Math.max(1, Math.ceil(text.split(/\s+/).length / 200)),
    hasNotes: html.includes('class="note"'),
  };
}

export function parsePage(source) {
  const { data, content } = matter(source);
  return { title: data.title, html: renderMarkdown(content) };
}
