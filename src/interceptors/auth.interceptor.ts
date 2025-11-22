// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, switchMap, take, finalize } from 'rxjs/operators';
import { Auth } from '../services/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private auth: Auth) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let cloned = req;
    // const token = this.auth.getAccessToken();
    const token = localStorage.getItem('accessToken');
 
    if (token) {
      cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(cloned).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.handle401Error(cloned, next);
        }
        return throwError(() => err);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.refreshing) {
      this.refreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth.refresh().pipe(
        switchMap(resp => {
          this.refreshing = false;
          const newToken = resp?.accessToken ?? null;
          this.refreshTokenSubject.next(newToken);
          if (newToken) {
            const retry = request.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
            return next.handle(retry);
          } else {
            return throwError(() => new Error('Unauthorized'));
          }
        }),
        catchError(error => {
          this.refreshing = false;
          return throwError(() => error);
        }),
        finalize(() => { this.refreshing = false; })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(t => t !== null),
        take(1),
        switchMap(newToken => {
          if (!newToken) return throwError(() => new Error('Unauthorized'));
          const retry = request.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
          return next.handle(retry);
        })
      );
    }
  }
}
