import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {environment} from '../../../environments/environment';
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  profile_picture: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersUrl = environment.serverBaseUrl + environment.usersEndpointPath; // Adjust the URL as needed

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<{ user: User; token: string } | null> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      map((users: User[]) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          const token = 'mock-token-' + Math.random().toString(36).substring(2);
          this.setUser(user, token);
          // Redirect based on role
          if (user.role === 'Contractor') {
            this.router.navigate(['/contractor/projects']);
          } else if (user.role === 'Supervisor') {
            this.router.navigate(['/projects']);
          }
          return { user, token };
        }
        throw new Error('Invalid credentials');
      }),
      catchError((err) => {
        console.error('Login error:', err);
        return of(null);
      })
    );
  }

  setUser(user: User, token: string): void {
    localStorage.setItem('id', user.id.toString());
    localStorage.setItem('token', token);
    localStorage.setItem('user_name', user.name);
    localStorage.setItem('user_role', user.role);
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('id');
    return userId ? Number(userId) : null;
  }

  getUserRole(): string {
    return localStorage.getItem('user_role') || '';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    this.router.navigate(['/login']);
  }
}
