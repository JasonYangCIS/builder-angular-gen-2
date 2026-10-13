import { RenderMode, ServerRoute } from '@angular/ssr';
import { getBuilderPagePaths } from './builder/builder-pages';

// GitHub Pages is static hosting, so every published Builder page is
// prerendered (SSG) at build time. URLs that aren't prerendered fall back to
// client-side rendering via 404.html.
export const serverRoutes: ServerRoute[] = [
  // Visual editor preview: needs live query params, so it is never prerendered.
  { path: 'editor', renderMode: RenderMode.Client },
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => (await getBuilderPagePaths()).map((path) => ({ '**': path })),
  },
];
