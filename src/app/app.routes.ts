import { Routes } from '@angular/router';
import { BuilderPage } from './builder/builder-page';

export const routes: Routes = [{ path: '**', component: BuilderPage }];
