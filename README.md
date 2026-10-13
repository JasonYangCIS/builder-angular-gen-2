# Builder.io + Angular 22: SSG without FOUC

Renders [Builder.io](https://www.builder.io) Content with Angular 22 and `@builder.io/sdk-angular` so
the first HTML already contains the content and its styles.

**Live site:** https://jasonyangcis.github.io/builder-angular-gen-2/

## Rendering

| Route | Mode |
| --- | --- |
| `/` | SSG (prerendered at build time) |
| everything else | Client-side, via the `404.html` fallback |

Set in `src/app/app.routes.server.ts`. The build is `outputMode: "static"` because GitHub Pages only
serves static files. Per-request SSR also worked in this repo but was removed for static hosting
(see [Enabling SSR](#enabling-ssr)).

## Avoiding FOUC

1. **Fetch before the route activates.** `builder-content.resolver.ts` is a route resolver, so
   prerender waits for the Builder entry. Fetching in `ngOnInit` or an `effect` leaves the HTML empty.
2. **Inline styles.** Component styles and critical CSS ship in the HTML. Check with `curl` on a built
   `index.html`.
3. **No entrance animations starting at `opacity: 0`.** The server HTML plays them and they replay
   after load, which looked like a flicker. Hover effects and looping animations are fine.
4. **Hydration** is on (`provideClientHydration()`), so the browser reuses the server DOM.
5. **Failed builds, not blank pages.** In prerender, a failed fetch or a missing published `/` entry
   throws. In the browser the resolver falls back to a "not found" view.

## Custom components

Registered in `src/app/builder/custom-components.ts`, built in `src/app/builder/components/`:

- **`AuroraHero`**: `eyebrow`, `heading`, `subheading`, `ctaLabel`, `ctaUrl`, `headingLevel`
- **`FeatureShowcase`**: `title`, `features` (`icon`, `title`, `description`)

The homepage content lives in Builder (model `page`, URL `/`). The public API key and model name are
in `src/app/builder/builder.config.ts`.

## Development

Needs the Node version in `.nvmrc`.

```bash
nvm install && nvm use
npm ci
npm start       # http://localhost:4200
npm test
npm run build   # prerenders `/`
```

## Deploying

`.github/workflows/deploy.yml` runs on every push to `main`: tests, build with the repo's base href,
copy `index.csr.html` to `404.html`, deploy to GitHub Pages. Pages is set to the **GitHub Actions**
source.

Content is baked in at build time, so publishing in Builder doesn't update the site on its own.
Re-run the workflow from the Actions tab, or send a `repository_dispatch` event of type
`builder-publish` (for example from a Builder webhook, using a GitHub token).

## Enabling SSR

Needs a host that runs Node. Set `outputMode` to `"server"` with an `ssr.entry` in `angular.json`,
add a server entry (`ng add @angular/ssr`) and `express`, switch `'**'` to `RenderMode.Server` in
`app.routes.server.ts`, and add your domain to `security.allowedHosts`.

## Limitations

- Only `/` is prerendered. Other URLs show "404 - Content not found" in the browser (HTTP 404 from
  the Pages fallback).
- Whether the custom components appear in Builder's visual editor insert menu is unverified.
