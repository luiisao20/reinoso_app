import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { InfoService } from '../service/info-service';

export const verifyRegisterGuard: CanMatchFn = async () => {
  const id = localStorage.getItem('reinoso-registered');

  if (id) {
    const infoService = inject(InfoService);

    const res = await infoService.getInfoById(parseInt(id));

    if (res) return false;
  }

  return true;
};
