import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Content, type BuilderContent } from '@builder.io/sdk-angular';
import { BUILDER_API_KEY, BUILDER_PAGE_MODEL } from './builder.config';
import { CUSTOM_COMPONENTS } from './custom-components';

@Component({
  selector: 'app-builder-page',
  imports: [Content],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (content(); as entry) {
      <builder-content
        [model]="model"
        [content]="entry"
        [apiKey]="apiKey"
        [customComponents]="customComponents"
      ></builder-content>
    } @else {
      <h1>404 - Content not found</h1>
    }
  `,
})
export class BuilderPage {
  readonly apiKey = BUILDER_API_KEY;
  readonly model = BUILDER_PAGE_MODEL;
  readonly customComponents = CUSTOM_COMPONENTS;

  readonly content = toSignal(
    inject(ActivatedRoute).data.pipe(map((d) => d['content'] as BuilderContent | null)),
    { initialValue: null },
  );

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  constructor() {
    effect(() => {
      const data = this.content()?.data;
      if (data?.['title']) this.title.setTitle(data['title']);
      if (data?.['description']) {
        this.meta.updateTag({ name: 'description', content: data['description'] });
      }
    });
  }
}
