import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface User {
  user_id: number;
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
  private usersUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ user: User; token: string } | null> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      map((users: User[]) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          const token = 'mock-token-' + Math.random().toString(36).substring(2);
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
    localStorage.setItem('user_id', user.user_id.toString());
    localStorage.setItem('token', token);
    localStorage.setItem('user_name', user.name);
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? Number(userId) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
  }
}
