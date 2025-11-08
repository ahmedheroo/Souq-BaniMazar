import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, switchMap, filter, take, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.auth.getAccessToken();
    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          // If request was to login/refresh endpoints, just fail
          if (req.url.endsWith('/api/auth/login') || req.url.endsWith('/api/auth/refresh')) {
            // clear local auth and propagate error
            this.auth.logout();
            return throwError(() => err);
          }
          return this.handle401Error(req, next);
        }
        return throwError(() => err);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth.refresh().pipe(
        switchMap(res => {
          // refresh() in service updates the in-memory token
          const newToken = this.auth.getAccessToken();
          this.refreshTokenSubject.next(newToken);
          this.isRefreshing = false;
          return next.handle(request.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          }));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.auth.logout(); // force logout
          return throwError(() => err);
        })
      );
    } else {
      // queue requests until refresh completes
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(request.clone({
            setHeaders: { Authorization: `Bearer ${token as string}` }
          }));
        })
      );
    }
  }
}
