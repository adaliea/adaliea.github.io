import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { load } from "cheerio";
import { parsePost, renderMarkdown } from "../scripts/content.mjs";
import { fillTemplate, templateKeys } from "../src/lib/template.ts";

test("all existing posts retain Jekyll's exact case-sensitive URLs", async () => {
  const expected = [
    "/2023/01/21/The-Automation-Timesink.html",
    "/2023/12/05/Astrophotography-On-Your-iPhone.html",
    "/2024/02/28/Proxying-Minecraft.html",
    "/2024/12/10/Making-Notes.html",
    "/2025/10/16/I-Dont-Talk-About-Being-Trans.html",
  ];
  const posts = await Promise.all(
    (await readdir("_posts"))
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => parsePost(file, await readFile(`_posts/${file}`, "utf8"))),
  );
  for (const url of expected) assert.ok(posts.some((post) => post.url === url));
  assert.equal(
    posts.find((post) => post.url.includes("Being-Trans")).title,
    "I don’t talk about being trans",
  );
  for (const post of posts) {
    const $ = load(post.html);
    assert.ok($("p").length > 0);
    for (const image of $("img[src^='/assets/']").toArray())
      await access(`.${$(image).attr("src")}`);
  }
});

test("handwritten notes, heading anchors, and the bounding-box demo survive rendering", async () => {
  const post = parsePost(
    "2024-12-10-Making-Notes.md",
    await readFile("_posts/2024-12-10-Making-Notes.md", "utf8"),
  );
  const $ = load(post.html);
  assert.ok($(".note").length > 8);
  assert.equal($(".note").first().attr("data-note-text"), "That look like this!");
  assert.equal($(".note-fallback").first().text(), "That look like this!");
  assert.equal($("#using-the-bounding-boxes").length, 1);
  assert.equal($("button[data-toggle-bounds]").text(), "Toggle Bounding Boxes!");
  assert.equal($("button[onclick], script").length, 0);
  assert.ok($("pre code .hljs-keyword").length > 0);
});

test("notes preserve inline HTML and images keep their public paths", () => {
  const $ = load(
    renderMarkdown(
      "Words %$A note<b>:</b> with detail$%.\n\n![Project](assets/projects/better-lyrics.png)",
    ),
  );
  assert.equal($(".note").attr("data-note-text"), "A note<b>:</b> with detail");
  assert.equal($("img").attr("src"), "/assets/projects/better-lyrics.png");
});

test("templates share case-insensitive fields, capitalize, and preserve escaped brackets", () => {
  const template = "Hello [Name], [name] chose [item]. \\[literal]";
  assert.deepEqual(templateKeys(template), ["name", "item"]);
  assert.equal(
    fillTemplate(template, { name: "adalie", item: "tea" }),
    "Hello Adalie, adalie chose tea. [literal]",
  );
  assert.equal(fillTemplate("[missing] and [Name]", {}), " and ");
});
