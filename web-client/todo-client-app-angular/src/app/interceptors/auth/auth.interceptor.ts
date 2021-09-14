import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    @Inject('BASE_API_URL') private apiUrl: string,
    @Inject('ENV_TYPE') private env: string,
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // if (this.env === "DEV") {
    //   const aux = request.clone()
    //   aux.headers.set("re")
    // }

    if (request.url === `${this.apiUrl}/user/signup` || request.url === `${this.apiUrl}/user/login`) {
      return next.handle(request);
    }
    const token = this.authService.token
    if (token === "" || token == null) {
      this.router.navigate(['login'])
      return next.handle(request)
    }

    const clone = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    })
    return next.handle(clone);
  }
}
