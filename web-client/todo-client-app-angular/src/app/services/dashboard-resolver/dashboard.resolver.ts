import { TodoModel } from './../../models/todo.model';
import { TodoService } from './../todo/todo.service';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolver implements Resolve<TodoModel[]> {

  constructor(
    private todoService: TodoService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TodoModel[]> {
    return this.todoService.getAll();
  }
}
