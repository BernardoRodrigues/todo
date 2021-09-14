import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SideBarService {

  private sideBarOpenedSubject: BehaviorSubject<boolean>;
  private sideBarOpenedObservable: Observable<boolean>;

  constructor() {
    this.sideBarOpenedSubject = new BehaviorSubject<boolean>(false);
    this.sideBarOpenedObservable = this.sideBarOpenedSubject.asObservable();
  }

  public sideBarOpen(v: boolean): void {
    this.sideBarOpenedSubject.next(v);
  }

  public sideBarOpenObservable(): Observable<boolean> {
    return this.sideBarOpenedObservable;
  }

}
