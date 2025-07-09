import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {environment} from '../../../environments/environment';
export interface AuthenticatedUser  {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<AuthenticatedUser | null> {
    const loginUrl = `${environment.serverBaseUrl}/authentication/sign-in`;
    return this.http.post<AuthenticatedUser>(loginUrl, { email, password }).pipe(
      map((response) => {
        if (!response || !response.token || !response.email || !response.role) {
          throw new Error('Invalid response structure');
        }

        this.setUser(response);

        this.redirectByRole(response.role);

        return response;
      }),
      catchError((err) => {
        console.error('Login error:', err);
        return of(null);
      })
    );

  }
  private  redirectByRole(role: string): void {
    if (role === 'SUPERVISOR') {
      console.log('Navigating to /projects');
      this.router.navigate(['/projects']);
    } else if (role === 'CONTRACTOR') {
      console.log('Navigating to /contractor/projects');
      this.router.navigate(['/contractor/projects']);
    }
  }

  setUser(user: AuthenticatedUser): void {
    localStorage.setItem('token', user.token);
    localStorage.setItem('email', user.email);
    localStorage.setItem('role', user.role);
    localStorage.setItem('user_id', user.id.toString());
    localStorage.setItem('name', user.name);
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? Number(userId) : null;
  }

  getUserRole(): string {
    return localStorage.getItem('role') || '';
  }
  getUserName(): string {
    return localStorage.getItem('name') || '';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('name');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token ? token : null;
  }
}
