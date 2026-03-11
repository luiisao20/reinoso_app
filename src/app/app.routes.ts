import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Success } from './features/success/success';
import { Error } from './features/error/error';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'success', component: Success },
  { path: 'error', component: Error },
];
