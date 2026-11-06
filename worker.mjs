// Worker entry: send every other hostname routed to this Worker to the canonical
// adalie.me origin before OpenNext runs. Next's host-conditioned redirects are
// not matched correctly by the OpenNext router, so this lives here instead.
// workers.dev and preview URLs are left alone so branch previews still work.
import handler from "./.open-next/worker.js";

export { BucketCachePurge, DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js";

const canonicalHost = "adalie.me";
const legacyHosts = new Set(["dacubeking.com", "www.dacubeking.com", "www.adalie.me"]);

export default {
  fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (legacyHosts.has(url.hostname)) {
      url.protocol = "https:";
      url.hostname = canonicalHost;
      url.port = "";
      return Response.redirect(url.href, 301);
    }
    return handler.fetch(request, env, ctx);
  },
};
