# Builder.io + Angular 22: SSG without FOUC

Angular 22 + `@builder.io/sdk-angular`, prerendered so the first HTML already has the content and styles.

**Live:** https://jasonyangcis.github.io/builder-angular-gen-2/

## Rendering

- `/` and every published Builder page: SSG at build time (`app.routes.server.ts`, `builder-pages.ts`)
- `/__editor`: client-only, for the Builder visual editor
- Anything else: client-rendered via the `404.html` fallback

Output is static because GitHub Pages can't run a server. For per-request SSR, use a Node host: set `outputMode: "server"` with an SSR entry, use `RenderMode.Server`, and add your domain to `security.allowedHosts`.

## FOUC fixes

- Content is fetched in a route resolver, so prerender waits for it.
- The entry is passed to the browser via `TransferState`: no second fetch or re-render.
- Styles are inlined in the HTML.
- No entrance animations starting at `opacity: 0`; they replay after load and flicker.
- The build fails if Builder returns nothing for `/`, instead of deploying a blank page.

## Visual editing

In Builder, set the `page` model's preview URL to `https://jasonyangcis.github.io/builder-angular-gen-2/__editor` (or `http://localhost:4200/__editor`). Editing inside Builder's UI is unverified.

## Develop

```bash
nvm install && nvm use   # version from .nvmrc
npm ci
npm start                # http://localhost:4200
npm test
```

## Deploy

Pushes to `main` build and deploy via `.github/workflows/deploy.yml` (Pages source: GitHub Actions). Publishing in Builder doesn't rebuild the site; re-run the workflow, or send a `repository_dispatch` event of type `builder-publish`.
