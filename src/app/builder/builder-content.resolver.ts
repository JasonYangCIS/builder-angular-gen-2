import { PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ResolveFn, RouterStateSnapshot } from '@angular/router';
import {
  fetchOneEntry,
  getBuilderSearchParams,
  type BuilderContent,
} from '@builder.io/sdk-angular';
import { BUILDER_API_KEY, BUILDER_PAGE_MODEL } from './builder.config';

const stateKey = (urlPath: string) => makeStateKey<BuilderContent | null>(`builder:${urlPath}`);

/**
 * Fetches the Builder entry before the route activates, so prerender waits for
 * it and the content is part of the generated HTML (no client-only flash).
 *
 * The entry is handed from the server to the browser through TransferState, so
 * the first client navigation reuses it instead of fetching (and re-rendering)
 * again.
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
  const transferState = inject(TransferState);
  const urlPath = state.url.split(/[?#]/)[0] || '/';
  const key = stateKey(urlPath);

  if (!isServer && transferState.hasKey(key)) {
    const transferred = transferState.get(key, null);
    // One-shot: later in-app navigations should fetch fresh content.
    transferState.remove(key);
    return transferred;
  }

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

  if (isServer) {
    if (!entry && urlPath === '/') {
      throw new Error('Builder returned no published "page" entry for "/".');
    }
    transferState.set(key, entry);
  }
  return entry;
};

/**
 * Client-only resolver for the visual editor / preview route. It forwards the
 * `builder.*` query params Builder adds, so draft and in-progress content loads.
 */
export const builderEditorResolver: ResolveFn<BuilderContent | null> = async () => {
  const params = new URLSearchParams(window.location.search);
  try {
    return (
      (await fetchOneEntry({
        apiKey: BUILDER_API_KEY,
        model: params.get('builder.preview') || BUILDER_PAGE_MODEL,
        options: getBuilderSearchParams(params),
        userAttributes: { urlPath: '/' },
      })) ?? null
    );
  } catch (err) {
    console.error('Builder editor fetch failed', err);
    return null;
  }
};
