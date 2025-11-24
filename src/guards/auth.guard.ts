// src/app/guards/auth.guard.ts
import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { Auth } from '../services/auth';

 
export const AuthGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.userSignal()) return true;

  router.navigate(['/login'], { queryParams: { returnUrl: location.pathname }});
  return false;
};
