import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserRole } from '../models/user.model';
import { BehaviorSubject, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // in-memory only
  private accessToken = '';

  // optional stored role (keeps a quick check if no full user object)
  private role = '';

  // Angular signals + observable for UI
  currentUser = signal<User | null>(null);
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  // Call on app start to attempt restoring session
  init() {
    // Try to call /api/auth/me. If refresh cookie exists server should issue new access token.
    return this.fetchCurrentUser().pipe(
      catchError(() => {
        // no session
        this.clearLocalAuth();
        return of(null);
      })
    ).subscribe();
  }

  login(email: string, password: string) {
    // server sets refresh cookie; returns access token & optionally role
    return this.http.post<{ accessToken: string, role?: string }>('/api/auth/login', { email, password })
      .pipe(
        tap(res => {
          this.accessToken = res.accessToken ?? '';
          if (res.role) this.role = res.role;
        }),
        // after receiving access token, fetch user profile to populate UI
        tap(() => this.fetchCurrentUser().subscribe({
          error: () => {
            // If fetch fails, clear token to avoid partial state
            this.clearLocalAuth();
          }
        }))
      );
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  hasRole(role: UserRole | string): boolean {
    const cu = this.currentUser();
    if (cu && cu.role) return cu.role === role;
    // fallback to stored role string (if any)
    return this.role === role;
  }

  logout() {
    // tell server to revoke refresh token (server should clear cookie)
    this.http.post('/api/auth/revoke', {}).subscribe({
      next: () => this.clearLocalAuth(),
      error: () => this.clearLocalAuth()
    });
  }

  refresh() {
    // server reads refresh cookie, returns new access token (and optionally role)
    return this.http.post<{ accessToken: string, role?: string }>('/api/auth/refresh', {})
      .pipe(tap(res => {
        this.accessToken = res.accessToken ?? '';
        if (res.role) this.role = res.role;
      }));
  }

  fetchCurrentUser() {
    // call protected endpoint; interceptor should add access token
    return this.http.get<User>('/api/auth/me').pipe(
      tap(user => {
        this.currentUser.set(user);
        this.user$.next(user);
        if (user.role) this.role = user.role;
      })
    );
  }

  private clearLocalAuth() {
    this.accessToken = '';
    this.role = '';
    this.currentUser.set(null);
    this.user$.next(null);
  }
}
