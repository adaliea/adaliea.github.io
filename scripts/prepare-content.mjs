import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parsePage, parsePost } from "./content.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const posts = await Promise.all(
  (await readdir(path.join(root, "_posts")))
    .filter((file) => file.endsWith(".md"))
    .map(async (filename) =>
      parsePost(filename, await readFile(path.join(root, "_posts", filename), "utf8")),
    ),
);
posts.sort((a, b) => b.date.localeCompare(a.date));
await mkdir(path.join(root, "src/generated"), { recursive: true });
await writeFile(
  path.join(root, "src/generated/content.json"),
  `${JSON.stringify(
    {
      posts,
      projects: parsePage(await readFile(path.join(root, "projects.md"), "utf8")),
    },
    null,
    2,
  )}\n`,
);

// Keep source images where existing posts expect them; only copy public assets.
for (const directory of ["home", "Proxying-Minecraft", "night_sky_photos", "projects"]) {
  await cp(path.join(root, "assets", directory), path.join(root, "public/assets", directory), {
    recursive: true,
  });
}
await cp(path.join(root, "scratch"), path.join(root, "public/scratch"), { recursive: true });
await cp(path.join(root, "favicon.ico"), path.join(root, "public/favicon.ico"));
console.log(`Prepared ${posts.length} unchanged Markdown posts and public assets.`);
