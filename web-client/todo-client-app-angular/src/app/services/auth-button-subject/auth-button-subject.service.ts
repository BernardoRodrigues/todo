import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AuthButtonSubjectService {

  private authButtonPress: Subject<'login' | 'signin'>;
  private authButtonPressObservable: Observable<'login' | 'signin'>;

  constructor() {
    this.authButtonPress = new Subject();
    this.authButtonPressObservable = this.authButtonPress.asObservable();
  }

  public authButtonPressed(v: 'login' | 'signin'): void {
    this.authButtonPress.next(v);
  }

  public authButtonPressedObservable(): Observable<'login' | 'signin'> {
    return this.authButtonPressObservable;
  }

}
