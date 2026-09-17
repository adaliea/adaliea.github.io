import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const books = [
  {
    name: "A Cup of Tea",
    authors: ["A. Writer"],
    authorLinks: [],
    link: "https://example.com/tea",
    coverLink: "",
    workId: "tea",
    published: "2026",
    list: "Currently Reading",
    pages: 200,
    percentComplete: 0.25,
  },
  {
    name: "Other Stories",
    authors: ["B. Author"],
    authorLinks: [],
    link: "https://example.com/stories",
    coverLink: "",
    workId: "stories",
    published: "2025",
    list: "Already Read",
    pages: 100,
    percentComplete: 1,
  },
];

test.beforeEach(async ({ page }) => {
  await page.route("https://books.api.dacubeking.com/**", (route) =>
    route.fulfill({
      json: route.request().url().includes("homepageinfo")
        ? { readingBooks: [], favoriteTrack: null }
        : books,
    }),
  );
  await page.route("https://giscus.app/**", (route) => route.abort());
});

async function fitsViewport(page: import("@playwright/test").Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
}

async function openNavigation(page: import("@playwright/test").Page) {
  const toggle = page.getByRole("button", { name: "Open navigation menu" });
  if (await toggle.isVisible()) await toggle.click();
}

test("homepage overlays navigation on the photo and mobile menus stay accessible", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Adalie");
  await expect(page.getByRole("banner")).toHaveCSS("position", "absolute");
  await expect(page.getByRole("link", { name: "Adalie’s Blog home" })).toHaveCount(0);
  expect((await page.getByRole("main").boundingBox())?.y).toBe(0);
  await fitsViewport(page);
  await openNavigation(page);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "My Programming Projects", exact: true }),
  ).toBeVisible();
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  const toggle = page.getByRole("button", { name: "Open navigation menu" });
  if (await toggle.isVisible()) {
    await expect(nav.getByRole("link", { name: "Projects", exact: true })).toBeHidden();
    await toggle.click();
    await expect(page.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  }
  await openNavigation(page);
  for (const link of await nav.getByRole("link").all()) {
    await expect(link).toBeVisible();
    expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }
  await fitsViewport(page);
  await nav.getByRole("link", { name: "Reading Log", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Reading Log", exact: true }),
  ).toBeVisible();
  if (await toggle.isVisible()) await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await fitsViewport(page);
});

test("posts preserve notes, comments mapping, deep links, and clean up on navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/2024/12/10/Making-Notes.html");
  await expect(page.locator(".note-text-rendered, .note-text-wide-rendered").first()).toBeVisible();
  await expect(page.locator("#using-the-bounding-boxes")).toBeAttached();
  await page.getByRole("button", { name: "Toggle Bounding Boxes!" }).click();
  await expect(page.getByRole("button", { name: "Toggle Bounding Boxes!" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await fitsViewport(page);
  const originalViewport = page.viewportSize();
  await page.setViewportSize({ width: 320, height: 800 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true);
  if (originalViewport) await page.setViewportSize(originalViewport);
  await openNavigation(page);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Blog Archive" })
    .click();
  await expect(page.locator(".note-text-rendered, .note-text-wide-rendered")).toHaveCount(0);
  await page.getByRole("link", { name: "I don’t talk about being trans" }).click();
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "I don’t talk about being trans",
  );
  await expect(page.locator(".note-text-rendered, .note-text-wide-rendered").first()).toBeVisible();
  await fitsViewport(page);
  expect(errors).toEqual([]);
});

test("template persistence and field edits generate the right output", async ({ page }) => {
  await page.goto("/blankfiller");
  await page
    .getByLabel("Template", { exact: true })
    .fill("Hello [Name], [name] wants [item]. \\[literal]");
  await page.getByLabel("name", { exact: true }).fill("adalie");
  await page.getByLabel("item", { exact: true }).fill("tea");
  await expect(page.getByLabel("Output", { exact: true })).toHaveValue(
    "Hello Adalie, adalie wants tea. [literal]",
  );
  await page.reload();
  await expect(page.getByLabel("Template", { exact: true })).toHaveValue(
    "Hello [Name], [name] wants [item]. \\[literal]",
  );
  await fitsViewport(page);
});

test("reading log supports search, filters, and retry after API failure", async ({
  page,
  request,
}) => {
  await request.post("http://127.0.0.1:4010/__fail-next");
  await page.goto("/reading");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("couldn’t load");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("status")).toHaveText("2 books on the shelf");
  await page.getByLabel("Reading status").selectOption("Currently Reading");
  await expect(page.getByRole("heading", { name: "A Cup of Tea" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Other Stories" })).toHaveCount(0);
  await page.getByLabel("Find a book").fill("no match");
  await expect(page.getByText("No books found.", { exact: false })).toBeVisible();
  await fitsViewport(page);
});

test("book data and image dimensions are present before JavaScript runs", async ({
  request,
  browser,
}) => {
  const response = await request.get("/reading");
  const html = await response.text();
  expect(html).toContain("A Cup of Tea");
  expect(html).toContain('width="320" height="480"');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(response.url());
  await expect(page.getByRole("heading", { name: "A Cup of Tea" })).toBeVisible();
  await context.close();
  expect(await (await request.get("/")).text()).toContain("An artist");
});

test("legacy routes, feeds, and missing pages respond correctly", async ({ request }) => {
  const content = JSON.parse(await readFile("src/generated/content.json", "utf8"));
  for (const post of content.posts) expect((await request.get(post.url)).status()).toBe(200);
  for (const path of [
    "projects",
    "reading",
    "archive",
    "blankfiller",
    "readingedit/editTitle",
    "readingedit/updateProgress",
  ]) {
    const response = await request.get(`/${path}.html`, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(`/${path}`);
  }
  for (const path of ["resume", "linkedin", "yt"]) {
    const response = await request.get(`/${path}.html`, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toMatch(/^https:\/\//);
  }
  for (const path of [
    "/feed.xml",
    "/sitemap.xml",
    "/robots.txt",
    "/scratch/tag.html",
    "/assets/home/IMG_8116.jpg",
  ])
    expect((await request.get(path)).status()).toBe(200);
  expect((await request.get("/this-page-does-not-exist")).status()).toBe(404);
});

test("book editor validates progress and preserves API callback parameters", async ({ page }) => {
  await page.goto(
    "/readingedit/editTitle?workId=tea&cover=cover%26id&overrideData=%7B%22name%22%3A%22A%20Cup%20of%20Tea%22%7D",
  );
  await page.getByLabel("Title", { exact: true }).fill("Tea & Biscuits");
  const titleRequest = page.waitForRequest((request) =>
    request.url().includes("/bestedition/edit?"),
  );
  await page.getByRole("button", { name: "Save title" }).click();
  const params = new URL((await titleRequest).url()).searchParams;
  expect(params.get("cover")).toBe("cover&id");
  expect(JSON.parse(params.get("overrideData") || "null").name).toBe("Tea & Biscuits");
  await page.goto(
    "/readingedit/updateProgress?overrideJson=%7B%22workId%22%3A%22tea%22%2C%22percent%22%3A0.5%2C%22totalPages%22%3A200%7D",
  );
  await expect(page.getByLabel("Pages read")).toHaveValue("100");
  await page.getByLabel("Total pages").fill("0");
  await page.getByRole("button", { name: "Save progress" }).click();
  expect(page.url()).toContain("/readingedit/updateProgress");
  await fitsViewport(page);
});
