# Adalie’s website

Next.js App Router, React, TypeScript, and Tailwind CSS, deployed to Cloudflare Workers with OpenNext. The site keeps the original photo, fonts, color scheme, and Markdown blog posts.

## Development

Use Node.js 24 and npm 11 (or `nvm use`).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Docker is also available with `docker compose up --build`.

The dev server listens on all interfaces. For Tailscale or another remote hostname, add a comma-separated `DEV_ALLOWED_ORIGINS` value to a local `.env.development.local` file so Next.js permits dev assets and hot reload from that hostname. This local file is ignored by Git. Use `npm run dev -- --port 3101` to select a different port.

`npm run dev` and builds prepare content automatically. After changing Markdown or adding images while the dev server is running, run `npm run prepare:content` again.

## Cloudflare Workers

The deployment configuration is in `wrangler.jsonc` and `open-next.config.ts`. This uses Workers, not Cloudflare Pages or the old `next-on-pages` adapter.

```sh
npm run preview     # Build and run locally in the Workers runtime
npm run deploy      # Build and deploy using your Cloudflare login
```

For an existing Cloudflare Worker, set `name` in `wrangler.jsonc` to that Worker’s name. For a new Worker, the configured name is `adalie-website`. Attach `dacubeking.com` under the Worker’s **Settings → Domains & Routes** after deployment. The old `CNAME` file does not configure Workers domains.

For Cloudflare Workers Builds connected to this repository:

- Build command: `npm run build:worker`
- Deploy command: `npx opennextjs-cloudflare deploy`
- Root directory: the repository root
- Node.js version: 24

No R2 bucket, D1 database, or Cloudflare Images subscription is required. Local fonts and original image assets are included in the deployment. `public/_headers` gives hashed Next.js assets immutable caching.

## Content and rendering

- `_posts/*.md` remains the source of truth. Posts are read without modifying them and prerendered at build time. Their original case-sensitive `.html` URLs, heading anchors, handwritten notes, Atom feed IDs, and Giscus discussion titles are retained.
- `projects.md` supplies the projects page. `scripts/prepare-content.mjs` writes ignored build data to `src/generated/` and copies original media into ignored `public/assets/` and `public/scratch/` directories. It does not publish source files.
- The homepage activity, reading log, and reading editors fetch the existing books API **on the server for each request**. Complete book markup and explicit `width="320" height="480"` image attributes are sent in the HTML. Covers use a stable 2:3 box with `object-contain` to retain their original proportions. There is no browser measurement or client fetch to populate the initial log.
- Client components handle search, filters, image-error fallbacks, template storage, and editor forms. The log has a retry button for upstream failures; the homepage remains readable if its activity API is unavailable. Upstream requests time out after 12 seconds. Prerendered pages use OpenNext’s read-only static-assets cache; book requests do not use an ISR cache.
- The existing API endpoints handle reading edits. No credentials or changes to that backend are introduced.
- `next.config.ts` redirects legacy page `.html` aliases and the resume, LinkedIn, and YouTube shortcuts. Blog URLs remain unchanged.
- Existing Jekyll templates and styles are retained as historical references; they are no longer part of the build. Ruby and Bundler are not required.

The optional server-only `BOOKS_API_URL` environment variable overrides the public API for local tests. Production defaults to `https://books.api.dacubeking.com`. Tests use a local fixture server and never submit changes to the live books API.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build:worker
npx playwright install chromium
npm run test:e2e
npm run test:worker
```

Browser tests run against both the Node production build and the actual Workers runtime on desktop and mobile, covering navigation, old URLs, note cleanup, template persistence, API failure/retry, editor parameters, and book content with JavaScript disabled. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use an existing Chrome installation. CI runs these checks without publishing the site.

Biome handles linting and formatting (`npm run format`), including TypeScript 7 syntax. The `sharp` override pins the patched compatible release used by Wrangler/Miniflare; retain it until the upstream dependency is updated.
