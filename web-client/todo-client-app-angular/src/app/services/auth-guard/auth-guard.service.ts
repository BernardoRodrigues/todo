import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private authService: AuthService,
    // private jwtHelper: JwtHelperService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const token = this.authService.token
    // || this.jwtHelper.isTokenExpired(token)
    const user = this.authService.user
    if (token == null || user == null) {
      this.router.navigate(['/home'])
      return true;
    }

    return true;
  }
}
