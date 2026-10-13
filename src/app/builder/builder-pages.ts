import { fetchEntries } from '@builder.io/sdk-angular';
import { BUILDER_API_KEY, BUILDER_PAGE_MODEL } from './builder.config';

/**
 * Lists the URL paths of all published Builder pages (without the leading
 * slash, excluding the homepage) so they can be prerendered at build time.
 */
export async function getBuilderPagePaths(): Promise<string[]> {
  const pageSize = 100;
  const paths = new Set<string>();

  for (let offset = 0; ; offset += pageSize) {
    const entries = await fetchEntries({
      apiKey: BUILDER_API_KEY,
      model: BUILDER_PAGE_MODEL,
      limit: pageSize,
      offset,
      fields: 'data.url',
      options: { noTraverse: true },
    });
    for (const entry of entries ?? []) {
      const url = entry.data?.['url'];
      // Skip entries with no static URL (e.g. targeted by other attributes).
      if (typeof url === 'string' && url.startsWith('/') && !url.includes('*')) {
        const path = url.replace(/^\/+|\/+$/g, '');
        if (path && path !== 'editor') paths.add(path);
      }
    }
    if (!entries || entries.length < pageSize) break;
  }
  return [...paths];
}
