import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { UserDto } from '../interfaces/user-dto';
import { environment } from '../environment/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private accessToken: string | null = null;
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.currentUser$.pipe(map(u => !!u));
  private apiUrl = environment.apiUrl;
  private api = `${this.apiUrl}/auth`;

    constructor(private http: HttpClient) {}

  private decodeJwt(token: string | null) {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(json)));
    } catch {
      return null;
    }
  }

    getAccessToken() {
    return this.accessToken;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  register(payload: { email: string; password: string; name: string; phoneNumber?: string }) {
    return this.http.post(`${this.api}/register`, payload, { withCredentials: true });
  }

    login(payload: { email: string; password: string }) {

    return this.http.post<{ accessToken: string; user: UserDto; role?: string }>(`${this.api}/login`, payload, { withCredentials: true })
      .pipe(
        tap(resp => {
          this.accessToken = resp.accessToken;
          const user = { ...resp.user, role: resp.role };
          this.currentUserSubject.next(user);
        })
      );
  }
    logout() {

    return this.http.post(`${this.api}/revoke`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.accessToken = null;
          this.currentUserSubject.next(null);
        }),
        catchError(err => {
          this.accessToken = null;
          this.currentUserSubject.next(null);
          return throwError(() => err);
        })
      );
  }
    me() {
    return this.http.get<UserDto>(`${this.api}/me`).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(err => {
        this.currentUserSubject.next(null);
        return throwError(() => err);
      })
    );
  }

  refresh(): Observable<{ accessToken: string } | null> {

    return this.http.post<{ accessToken: string; role?: string }>(`${this.api}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap(resp => {
          if (resp?.accessToken) {
            this.accessToken = resp.accessToken;
            const existing = this.currentUserSubject.value;
            if (existing && resp.role) {
              this.currentUserSubject.next({ ...existing, role: resp.role });
            }
          }
        }),
        map(resp => resp ? { accessToken: resp.accessToken } : null),
        catchError(() => {
          this.accessToken = null;
          this.currentUserSubject.next(null);
          return of(null);
        })
      );
  }

  accessTokenExpiresAt(): number | null {
    const p = this.decodeJwt(this.accessToken);
    return p?.exp ? p.exp * 1000 : null;
  }
    hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }
}
