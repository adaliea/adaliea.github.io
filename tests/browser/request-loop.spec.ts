import { expect, type Request, test } from "@playwright/test";

// Exercise the protocol directly as well as the browser. The OpenNext cache
// interceptor used to return full-page RSC for /_tree, causing endless retries.
for (const path of ["/projects", "/archive", "/2024/12/10/Making-Notes.html"]) {
  test(`segment prefetch returns the requested route tree for ${path}`, async ({ request }) => {
    const headers = { RSC: "1", "Next-Router-Prefetch": "1" };
    const full = await request.get(`${path}?_rsc=full-regression`, { headers });
    const tree = await request.get(`${path}?_rsc=tree-regression`, {
      headers: { ...headers, "Next-Router-Segment-Prefetch": "/_tree" },
    });
    expect(full.status()).toBe(200);
    expect(tree.status()).toBe(200);
    expect(tree.headers()["content-type"]).toContain("text/x-component");
    expect(tree.headers()["x-nextjs-postponed"]).toBe("2");
    const treeBody = await tree.text();
    expect(treeBody).toContain('"tree":');
    expect(treeBody).not.toBe(await full.text());
  });
}

test("homepage prefetches settle after load, navigation, and going back", async ({ page }) => {
  const prefetches: string[] = [];
  const pending = new Set<Request>();
  let lastActivity = Date.now();
  page.on("request", (request) => {
    if (request.headers()["next-router-prefetch"] !== "1") return;
    prefetches.push(request.url());
    pending.add(request);
    lastActivity = Date.now();
  });
  const finished = (request: Request) => {
    if (pending.delete(request)) lastActivity = Date.now();
  };
  page.on("requestfinished", finished);
  page.on("requestfailed", finished);
  await page.goto("/");
  const openMenu = page.getByRole("button", { name: "Open navigation menu" });
  if (await openMenu.isVisible()) await openMenu.click();
  // Confirm prefetching actually ran, so disabling all prefetches cannot hide a
  // protocol regression. Opening the mobile menu makes its links eligible too.
  await expect.poll(() => prefetches.length).toBeGreaterThan(0);
  async function expectSettled() {
    const observationStarted = Date.now();
    // Measure a fresh quiet window after every navigation. The document's load
    // state can already be idle before client-side prefetches have finished.
    await expect
      .poll(
        () => pending.size === 0 && Date.now() - Math.max(observationStarted, lastActivity) >= 2000,
        { timeout: 10000 },
      )
      .toBe(true);
  }
  await expectSettled();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "My Programming Projects", exact: true }),
  ).toBeVisible();
  await expectSettled();
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Adalie");
  await expectSettled();
});
