import { Routes } from '@angular/router';
import { BuilderPage } from './builder/builder-page';
import {
  builderContentResolver,
  builderEditorResolver,
} from './builder/builder-content.resolver';

const builderRoute = {
  component: BuilderPage,
  resolve: { content: builderContentResolver },
};

export const routes: Routes = [
  // Client-only route used as the Builder editor's preview URL (see README).
  { path: 'editor', component: BuilderPage, resolve: { content: builderEditorResolver } },
  // Explicit homepage route so it can be prerendered (SSG).
  { path: '', ...builderRoute },
  { path: '**', ...builderRoute },
];
