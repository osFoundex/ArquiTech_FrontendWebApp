import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const userRole = authService.getUserRole();
  const allowedRoles = route.data['roles'] as string[] | undefined;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
