import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { InfoService } from '../service/info-service';
import { AuthService } from '../auth-service';

export const verifyRegisterGuard: CanMatchFn = async () => {
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) return true;

  const id = localStorage.getItem('reinoso-registered');

  if (id) {
    const infoService = inject(InfoService);

    const res = await infoService.getInfoById(id);

    if (res) return false;
  }

  return true;
};
