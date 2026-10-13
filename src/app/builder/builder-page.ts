import { Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { Content, fetchOneEntry, type BuilderContent } from '@builder.io/sdk-angular';
import { BUILDER_API_KEY, BUILDER_PAGE_MODEL } from './builder.config';

@Component({
  selector: 'app-builder-page',
  imports: [Content],
  template: `
    @if (loading()) {
      <p>Loading…</p>
    } @else if (content()) {
      <builder-content
        [model]="model"
        [content]="content()"
        [apiKey]="apiKey"
      ></builder-content>
    } @else {
      <h1>404 - Content not found</h1>
    }
  `,
})
export class BuilderPage {
  readonly apiKey = BUILDER_API_KEY;
  readonly model = BUILDER_PAGE_MODEL;

  readonly content = signal<BuilderContent | null>(null);
  readonly loading = signal(true);

  private readonly router = inject(Router);
  private readonly urlPath = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => window.location.pathname || '/'),
    ),
    { initialValue: '/' },
  );

  constructor() {
    effect((onCleanup) => {
      const urlPath = this.urlPath();
      let cancelled = false;
      onCleanup(() => (cancelled = true));

      this.loading.set(true);
      fetchOneEntry({
        apiKey: this.apiKey,
        model: this.model,
        userAttributes: { urlPath },
      })
        .then((entry) => {
          if (cancelled) return;
          // While editing in Builder, show the editor even with no published entry.
          this.content.set(entry ?? null);
        })
        .catch((err) => {
          console.error('Builder fetch failed', err);
          if (!cancelled) this.content.set(null);
        })
        .finally(() => {
          if (!cancelled) this.loading.set(false);
        });
    });
  }
}
