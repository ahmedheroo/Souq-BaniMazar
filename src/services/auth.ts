// src/app/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { UserDto } from '../interfaces/user-dto';
import { environment } from '../environment/environment.prod';
import { toSignal } from '@angular/core/rxjs-interop';
 
@Injectable({
  providedIn: 'root',
})
export class Auth {
  // in-memory token (fast) + persistent storage fallback
  private accessToken: string | null = null;

  // BehaviorSubject for imperative consumption & older code
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

    // userSignal reflects currentUser$
  userSignal = toSignal(this.currentUser$, { initialValue: null });

  // Observable boolean derived from currentUser$
  public isLoggedIn$ = this.currentUser$.pipe(map(u => !!u));

  // Lightweight signal for templates (fast, works with @if)
  public isLoggedIn = signal<boolean>(false);

  private apiUrl = environment.apiUrl;
  private api = `${this.apiUrl}/auth`;
  private readonly ACCESS_TOKEN_KEY = 'accessToken';

  constructor(private http: HttpClient) {
    // restore token and user on service bootstrap (page refresh)
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (token) {
      this.accessToken = token;
      // Optionally attempt to hydrate user from server
      // but don't block construction — call me() to populate user if desired
      // this.me().subscribe({ /* handle errors silently */ });
    }
    // keep signal in sync with currentUserSubject initial value
    this.isLoggedIn.set(!!this.currentUserSubject.value || !!this.accessToken);
  }

  // JWT decode helper (safe)
  private decodeJwt(token: string | null) {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      // atob is safe for base64; decodeURIComponent(escape(...)) is legacy but works cross-browser
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(json)));
    } catch {
      return null;
    }
  }

  // Always return the authoritative token (in-memory first, then localStorage)
  getAccessToken(): string | null {
    return this.accessToken ?? localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Setter keeps memory and storage in sync
  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    }
    // update signal based on token presence
    this.isLoggedIn.set(!!token || !!this.currentUserSubject.value);
  }

// In auth.service.ts
register(payload: {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  nationalId?: File | null;
}) {
  const formData = new FormData();
  formData.append('Name', payload.name);
  formData.append('Email', payload.email);
  formData.append('Password', payload.password);
  formData.append('PhoneNumber', payload.phoneNumber ?? '');

  if (payload.nationalId) {
    // "NationalId" must match the property name in RegisterDto
    formData.append('NationalId', payload.nationalId);
  }

  return this.http.post(`${this.api}/register`, formData, {
    withCredentials: true,
  });
}


  login(payload: { email: string; password: string }) {
    return this.http.post<{ accessToken: string; user: UserDto; role?: string }>(
      `${this.api}/login`,
      payload,
      { withCredentials: true }
    ).pipe(
      tap(resp => {
        // persist token
        this.setAccessToken(resp.accessToken);

        // include role if backend returned it
        const user = { ...resp.user, role: resp.role } as UserDto;
        this.currentUserSubject.next(user);

        // update the signal
        this.isLoggedIn.set(true);
      })
    );
  }

  logout() {
    return this.http.post(`${this.api}/revoke`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.setAccessToken(null);
          this.currentUserSubject.next(null);
          this.isLoggedIn.set(false);
        }),
        catchError(err => {
          // Even on error, clear client state
          this.setAccessToken(null);
          this.currentUserSubject.next(null);
          this.isLoggedIn.set(false);
          return throwError(() => err);
        })
      );
  }

  // Populate current user from backend (call at app startup if you want to hydrate)
  me() {
    return this.http.get<UserDto>(`${this.api}/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.isLoggedIn.set(true);
      }),
      catchError(err => {
        this.currentUserSubject.next(null);
        this.isLoggedIn.set(false);
        return throwError(() => err);
      })
    );
  }

  // Refresh endpoint (returns new token or null on failure)
  refresh(): Observable<{ accessToken: string } | null> {
    return this.http.post<{ accessToken: string; role?: string }>(
      `${this.api}/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(resp => {
        if (resp?.accessToken) {
          this.setAccessToken(resp.accessToken);

          // update role if provided and user exists
          const existing = this.currentUserSubject.value;
          if (existing && resp.role) {
            this.currentUserSubject.next({ ...existing, role: resp.role });
          }
        }
      }),
      map(resp => resp ? { accessToken: resp.accessToken } : null),
      catchError(() => {
        // on refresh failure, clear client state but don't throw (caller can act)
        this.setAccessToken(null);
        this.currentUserSubject.next(null);
        this.isLoggedIn.set(false);
        return of(null);
      })
    );
  }

  accessTokenExpiresAt(): number | null {
    const p = this.decodeJwt(this.getAccessToken());
    return p?.exp ? p.exp * 1000 : null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }
}
