import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Success } from './features/success/success';
import { Error } from './features/error/error';
import { Login } from './features/login/login';
import { Info } from './features/info/info';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'success', component: Success },
  { path: 'error', component: Error },
  { path: 'info', component: Info, canActivate: [authGuard] },
];
