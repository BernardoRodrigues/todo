import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoModel } from 'src/app/models/todo.model';
import { TodoDataService } from 'src/app/services/todo-data/todo-data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public todosDone: TodoModel[];
  public todosNotDone: TodoModel[];

  constructor(
    private todoDataService: TodoDataService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.data.subscribe((data) => {
      const reminders: TodoModel[] = data.reminders;
      if (reminders != null) {
        this.todosDone = reminders.filter((t) => !t.isCancelled && t.isDone)
        this.todosNotDone = reminders.filter((t) => !t.isCancelled && !t.isDone)
      }
    });
    this.todosDone = this.todoDataService.reminders.filter((t) => !t.isCancelled && t.isDone)
    this.todosNotDone = this.todoDataService.reminders.filter((t) => !t.isCancelled && !t.isDone)
    this.todoDataService.todoDataObs.subscribe((v) => {
      this.todosDone = v.filter((t) => !t.isCancelled && t.isDone)
      this.todosNotDone = v.filter((t) => !t.isCancelled && !t.isDone)
    })
  }

  ngOnInit(): void {
  }

}
