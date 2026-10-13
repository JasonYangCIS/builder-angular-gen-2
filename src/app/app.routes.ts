import { Routes } from '@angular/router';
import { BuilderPage } from './builder/builder-page';
import { builderContentResolver } from './builder/builder-content.resolver';

const builderRoute = {
  component: BuilderPage,
  resolve: { content: builderContentResolver },
};

export const routes: Routes = [
  // Explicit homepage route so it can be prerendered (SSG).
  { path: '', ...builderRoute },
  { path: '**', ...builderRoute },
];
