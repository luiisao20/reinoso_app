import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { verifyRegisterGuard } from './verify-register-guard';

describe('verifyRegisterGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => verifyRegisterGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
