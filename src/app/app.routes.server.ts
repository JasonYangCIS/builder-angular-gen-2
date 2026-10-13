import { RenderMode, ServerRoute } from '@angular/ssr';

// GitHub Pages is static hosting: the homepage is prerendered (SSG) at build
// time and every other URL falls back to client-side rendering via 404.html.
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
