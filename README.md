# Builder.io + Angular 22: SSG/SSR without FOUC

A test bed for rendering [Builder.io](https://www.builder.io) Content with Angular 22 so that the
first HTML response already contains the content **and** its styles. The goal is no flash of
unstyled content (FOUC) and no content flash on load.

It uses `@builder.io/sdk-angular` (Gen 2), two CSS-heavy custom components and the Angular
application builder with prerendering.

**Live site:** https://jasonyangcis.github.io/builder-angular-gen-2/

## How it renders

| Route | Mode | Where the HTML comes from |
| --- | --- | --- |
| `/` | SSG (prerender) | Generated at build time |
| everything else | Client-side | `404.html` SPA fallback, rendered in the browser |

Render modes are set in `src/app/app.routes.server.ts`. The project builds with `outputMode: "static"`
(see `angular.json`) because it deploys to GitHub Pages, which only serves static files.

> **SSR:** the app was also run with per-request SSR (`path: '**'` → `RenderMode.Server`) and
> rendered correctly. It was removed to deploy to static hosting. To bring it back, see
> [Enabling SSR](#enabling-ssr).

## How FOUC is avoided

1. **Content is fetched before the route activates.** `builder-content.resolver.ts` is a route
   resolver, so prerender waits for the Builder entry. Fetching in `ngOnInit` or an `effect` would
   leave the server HTML empty.
2. **Styles ship inside the HTML.** Component styles are emitted as inline `<style>` tags and the
   global stylesheet's critical CSS is inlined, so the first paint is styled. You can check this with
   `curl` on a built `index.html` (look for `<style` tags and the hero text).
3. **No entrance animations that start at `opacity: 0`.** An animation like `fade-in … both` is
   played by the server HTML and then replayed after load, which looks like a flicker. The hero and
   cards had this; removing it fixed the flicker. Hover effects and looping ambient animations are
   fine. If you need entrance animations, start them from the client only, after hydration.
4. **Hydration is enabled** (`provideClientHydration()`), so the browser reuses the server DOM.
5. **The build fails instead of shipping a blank page.** During prerender, a failed Builder fetch or a
   missing published entry for `/` throws. In the browser the resolver degrades to a "not found" view.

## Custom components

Registered in `src/app/builder/custom-components.ts`, implemented in `src/app/builder/components/`:

- **`AuroraHero`**: animated gradient blobs, masked grid, gradient text, glass pill and glowing
  button. Inputs: `eyebrow`, `heading`, `subheading`, `ctaLabel`, `ctaUrl`, `headingLevel`.
- **`FeatureShowcase`**: responsive grid of glass cards with hover effects. Inputs: `title`, `features`
  (list of `icon`, `title`, `description`).

Both use signal `input()`, `OnPush` and shared design tokens from `src/styles.css`. The decorative
elements are `aria-hidden` and animations respect `prefers-reduced-motion`.

The homepage content itself lives in Builder (model `page`, URL `/`), not in this repo.

## Getting started

Requires the Node version in `.nvmrc` (Angular 22 needs `^22.22.3`, `^24.15.0` or 26+).

```bash
nvm install && nvm use
npm ci
npm start          # dev server at http://localhost:4200
npm test           # unit tests (Vitest)
npm run build      # production build, prerenders `/`
```

The Builder public API key and model name are in `src/app/builder/builder.config.ts`.

To test with a base path like GitHub Pages uses:

```bash
npx ng build --base-href /builder-angular-gen-2/
```

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` runs on every push to `main`:

1. `npm ci`, tests, then `ng build` with the base href set from the repo name.
2. Copies `index.csr.html` to `404.html` so deep links fall back to client rendering.
3. Uploads and deploys the `browser` output to Pages.

One-time setup: in **Settings → Pages**, set **Source** to **GitHub Actions**. The site is then served
at https://jasonyangcis.github.io/builder-angular-gen-2/.

Builder content is baked in at build time, so publishing in Builder does not update the site by
itself. Rebuild from the Actions tab (**Run workflow**), or have a Builder webhook send a
`repository_dispatch` event of type `builder-publish` to the GitHub API (needs a GitHub token).

## Enabling SSR

Not currently set up. To render non-homepage routes per request you need a host that runs Node:

1. In `angular.json`, set `outputMode` to `"server"` and add `"ssr": { "entry": "src/server.ts" }`.
2. Add a server entry (`ng add @angular/ssr` generates an Express one) and install `express`.
3. In `app.routes.server.ts`, change `{ path: '**' }` to `RenderMode.Server`.
4. Add your domain to `security.allowedHosts` in `angular.json`. An empty list makes the server
   return 400.

## Known limits

- Unknown URLs show a "404 - Content not found" message but return HTTP 200 (GitHub Pages fallback).
- Only `/` is prerendered. Other Builder pages are not in the static output.
- Custom components are registered with the SDK for rendering. Registering them with the visual
  editor (so they appear in its insert menu) has not been verified.
