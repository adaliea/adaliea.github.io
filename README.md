# My Personal Website

See the live version:
[dacubeking.com](https://dacubeking.com)

## Previewing the site locally

### With Docker (Recommended)

```bash
docker compose up --build
```

### Without Docker

1. You will need ruby installed on your machine.
2. You may also need to install bundler which can be done with `gem install bundler`.
3. The rest of the ruby dependencies can be installed with `bundle install`.
4. With node.js installed, run `npm install` to install the node dependencies.
5. Preview the site with `bundle exec jekyll serve`.

Note: When running the site locally you may notice that some preloads will fail. This is expected and the resulting errors can be ignored. I'm using Cloudflare Fonts which automatically replaces Google Fonts with proxied version from Cloudfare on the production website. 
## Tech stack

- Using Jekyll, with the minima theme.
- Typescript so that some of the JS on the site can be written with types

