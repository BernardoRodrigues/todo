import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TodoModel } from 'src/app/models/todo.model';

@Injectable()
export class TodoDataService {

  private _reminders: TodoModel[] = [];

  public get reminders(): TodoModel[] {
    return this._reminders;
  }

  public set reminders(value: TodoModel[]) {
    this._reminders = value;
  }

  public todoDataSubject: BehaviorSubject<TodoModel[]>;
  public todoDataObs: Observable<TodoModel[]>;

  constructor() {
    this.todoDataSubject = new BehaviorSubject<TodoModel[]>([]);
    this.todoDataObs = this.todoDataSubject.asObservable();
  }

  public add(t: TodoModel): void {
    this._reminders.push(t);
  }

  public remove(id: string): void {
    this._reminders = this._reminders.filter((t) => t.id != id)
  }

  public update(t: TodoModel): void {
    if (t.id != null) {
      this.remove(t.id);
      this.add(t)
    }
  }

}
