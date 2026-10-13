import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ResolveFn, RouterStateSnapshot } from '@angular/router';
import { fetchOneEntry, type BuilderContent } from '@builder.io/sdk-angular';
import { BUILDER_API_KEY, BUILDER_PAGE_MODEL } from './builder.config';

/**
 * Fetches the Builder entry before the route activates, so SSR/prerender waits
 * for it and the content is part of the generated HTML (no client-only flash).
 *
 * On the server (build-time prerender), failures throw so a Builder outage or a
 * missing/unpublished homepage fails the build instead of deploying a 404 page.
 * In the browser they degrade to the "not found" view.
 */
export const builderContentResolver: ResolveFn<BuilderContent | null> = async (
  _route,
  state: RouterStateSnapshot,
) => {
  const isServer = isPlatformServer(inject(PLATFORM_ID));
  const urlPath = state.url.split(/[?#]/)[0] || '/';

  let entry: BuilderContent | null;
  try {
    entry =
      (await fetchOneEntry({
        apiKey: BUILDER_API_KEY,
        model: BUILDER_PAGE_MODEL,
        userAttributes: { urlPath },
      })) ?? null;
  } catch (err) {
    if (isServer) throw err;
    console.error('Builder fetch failed', err);
    return null;
  }

  if (isServer && !entry && urlPath === '/') {
    throw new Error('Builder returned no published "page" entry for "/".');
  }
  return entry;
};
