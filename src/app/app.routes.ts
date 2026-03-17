import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Success } from './features/success/success';
import { Error } from './features/error/error';
import { Login } from './features/login/login';
import { Info } from './features/info/info';
import { authGuard } from './guards/auth-guard';
import { verifyRegisterGuard } from './guards/verify-register-guard';
import { DrawPage } from './features/draw-page/draw-page';

export const routes: Routes = [
  { path: '', component: Home, canMatch: [verifyRegisterGuard] },
  { path: '', component: Error },
  { path: 'login', component: Login },
  { path: 'success', component: Success },
  { path: 'info', component: Info, canActivate: [authGuard] },
  { path: 'draw', component: DrawPage, canActivate: [authGuard] },
];
