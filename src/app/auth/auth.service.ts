import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const API_BASE = environment.apiBase;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'fd_token';
  token$ = new BehaviorSubject<string | null>(this.getToken());

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ access_token: string; token_type: string }>(`${API_BASE}/auth/login`, { username, password })
      .pipe(
        tap((res: { access_token: string; token_type: string }) => {
          localStorage.setItem(this.tokenKey, res.access_token);
          this.token$.next(res.access_token);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.token$.next(null);
    window.location.href = '/login';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
