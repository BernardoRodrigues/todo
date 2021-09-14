import { UserModel } from './../../models/user.model';
import { Injectable } from '@angular/core';

@Injectable()
export class UserDataService {

  private _user: UserModel | null = null;

  constructor() { }

  public set user(user: UserModel | null) {
    this._user = user;
    localStorage.setItem('user', JSON.stringify(user))
  }

  public get user(): UserModel | null {
    const s = localStorage.getItem('user')
    if (s == null) {
      return null;
    }
    return this._user;
    // return JSON.parse(s)
  }

}
