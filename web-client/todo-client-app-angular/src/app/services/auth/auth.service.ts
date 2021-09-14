import { UserModel } from './../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  private _user: UserModel | undefined | null;

  private readonly tokenKey = '2do_jwt_token';

  private readonly userKey = '2do_user';

  constructor(
  ) { }

  public get token(): string | null {
    
    const token = sessionStorage.getItem(this.tokenKey)
    return token;
  }

  public set token(value: string | null) {
    if (value == null) {
      sessionStorage.removeItem(this.tokenKey);
    }
    else {
      sessionStorage.setItem(this.tokenKey, value)
    }
  }

  public set user(value: UserModel | null | undefined) {
    this._user = value;
    if (value == null) {
      localStorage.removeItem(this.userKey)
    }
    else {
      localStorage.setItem(this.userKey, JSON.stringify(value))
    }
  }

  public get user(): UserModel | null | undefined {
    // POR AGORA
    const userString = localStorage.getItem(this.userKey)
    if (userString == null) return null;
    return JSON.parse(userString) as UserModel
  }

}
