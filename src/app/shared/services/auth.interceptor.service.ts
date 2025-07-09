import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      const cloned = req.clone({

        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log('Sending request to', req.url, 'with token:', token);
      console.log('Authorization header:', req.headers.get('Authorization'));
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
