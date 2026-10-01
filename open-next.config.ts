import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Blog content is prerendered; book data uses uncached SSR requests.
// No ISR, R2 bucket, or database is needed.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  // The interceptor returns full-page RSC for Next 16 segment prefetches,
  // making the client retry indefinitely. Let Next serve the cached segments.
  // https://github.com/opennextjs/opennextjs-aws/issues/1212
  enableCacheInterception: false,
});
