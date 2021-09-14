import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class LoginSubjectService {

  private userLoggedIn: Subject<void>;
  private userLoggedInObservable: Observable<void>;

  constructor() {
    this.userLoggedIn = new Subject();
    this.userLoggedInObservable = this.userLoggedIn.asObservable();
  }

  public userLogIn(): void {
    this.userLoggedIn.next();
  }

  public userLogInObservable(): Observable<void> {
    return this.userLoggedInObservable;
  }

}
