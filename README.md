# Builder.io + Angular 22: SSG

Angular 22 + `@builder.io/sdk-angular`, prerendered so the first HTML already has the content and styles.

**Live:** https://jasonyangcis.github.io/builder-angular-gen-2/

## Rendering

- `/` and every published Builder page: SSG at build time (`app.routes.server.ts`, `builder-pages.ts`)
- `/__editor`: client-only, for the Builder visual editor
- Anything else: client-rendered via the `404.html` fallback

Output is static because GitHub Pages can't run a server. For per-request SSR, use a Node host: set `outputMode: "server"` with an SSR entry, use `RenderMode.Server`, and add your domain to `security.allowedHosts`.

## Visual editing

The `page` model's preview URL is `https://jasonyangcis.github.io/builder-angular-gen-2/__editor` (use `http://localhost:4200/__editor` for local development). Editing inside Builder's UI is unverified.

## Develop

```bash
nvm install && nvm use   # version from .nvmrc
npm ci
npm start                # http://localhost:4200
npm test
```

## Deploy

Pushes to `main` build and deploy via `.github/workflows/deploy.yml` (Pages source: GitHub Actions). Publishing in Builder doesn't rebuild the site; re-run the workflow, or send a `repository_dispatch` event of type `builder-publish`.
