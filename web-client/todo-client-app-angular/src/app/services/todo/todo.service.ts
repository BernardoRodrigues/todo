import { TodoModel } from './../../models/todo.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class TodoService {

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_API_URL') private apiUrl: string
  ) { }

  public getAll(): Observable<TodoModel[]> {
    return this.httpClient.get<TodoModel[]>(`${this.apiUrl}/todo/`)
  }

  public create(todo: {title: string, startDate: Date, endDate: Date, priority: number}): Observable<{id: string}> {
    return this.httpClient.post<{id: string}>(`${this.apiUrl}/todo/`, todo)
  }

}
