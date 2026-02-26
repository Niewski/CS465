import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authentication } from '../services/authentication';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Authentication);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const user = authService.getCurrentUser();
  if (user.role !== 'admin') {
    window.location.href = 'http://localhost:3000';
    return false;
  }

  return true;
};
