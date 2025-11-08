import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = !!auth.currentUser();

  // optional role restriction defined on route: data: { roles: ['Admin','Seller'] }
  const requiredRoles: string[] | undefined = route.data?.['roles'];

  if (!isLoggedIn) {
    // not authenticated -> redirect to login (or home)
    return router.parseUrl('/login');
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasAny = requiredRoles.some(r => auth.hasRole(r));
    if (!hasAny) {
      // user logged in but not authorized for this route
      return router.parseUrl('/forbidden'); // create a ForbiddenComponent or redirect to home
    }
  }

  return true;
};
