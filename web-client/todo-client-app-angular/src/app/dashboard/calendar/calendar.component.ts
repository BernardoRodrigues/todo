import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import * as moment from 'moment';
import { TodoModel } from 'src/app/models/todo.model';
import { ReminderDialogComponent } from 'src/app/reminder-dialog/reminder-dialog.component';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import { TodoDataService } from 'src/app/services/todo-data/todo-data.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  private _reminders: TodoModel[] | undefined;

  private _format: 'month' | 'week' | 'day' = 'month';

  public viewDate: Date;

  public _events: CalendarEvent[] = [];

  // public get events(): CalendarEvent[] {
  //   if (this._reminders == null) return []
  //   if (this._events == null)
  //     this._events = this._reminders.map(this.mapTodoToCalendarEvent)
  //   return this._events;
  // }

  public get reminders(): TodoModel[] | undefined {
    return this._reminders;
  }

  public set format(value: 'month' | 'week' | 'day') {
    this._format = value
  }

  public get format(): 'month' | 'week' | 'day' {
    return this._format;
  }

  public get firstDayOfWeek(): Date {
    return moment(this.viewDate).startOf('week').toDate()
  }

  public get lastDayOfWeek(): Date {
    return moment(this.viewDate).endOf('week').toDate()
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    @Inject('PUBLIC_VAPID_KEY') private publicVapidKey: string,
    @Inject('BASE_API_URL') private apiUrl: string,
    private subscriptionService: SubscriptionService,
    private swPush: SwPush,
    private todoDataService: TodoDataService
  ) {
    this.activatedRoute.data.subscribe((data) => {
      this._reminders = data.reminders;
      if (this._reminders != null) {
        this._events = this._reminders.filter((v) => !v.isCancelled && !v.isDone).map(this.mapTodoToCalendarEvent)
      }
    });
    this.todoDataService.todoDataObs.subscribe((v) => {
      this._reminders = v
      if (this._reminders != null) {
        this._events = this._reminders.filter((v) => !v.isCancelled && !v.isDone).map(this.mapTodoToCalendarEvent)
      }
    })
    this.viewDate = new Date();

      this.swPush.messages.subscribe((notification: any) => {
        console.log("received push notification", notification);
        let options = {
          body: notification.body,
          icon: "assets/icon/favicon.png",
          actions: <any>notification.actions,
          data: notification.data,
          vibrate: [100, 50, 10, 20, 20]
        };
        // this.showNotification(notification.title, options)
      },
    
      err => {
        console.error(err);
      })
  }


  ngOnInit(): void {
    
  }

  public openNewTodoDialog(): void {

  }

  public dayClick({ date, events }: { date: Date; events: CalendarEvent[] }): void {

  }

  public dayClicked(day: CalendarMonthViewDay<any>, sourceEvent: any): void {
    // console.log(`Day: ${day}`);
    // console.log(`Event: ${sourceEvent}`);
    console.log("Day")
    console.table(day)
    console.log("Event")
    console.table(sourceEvent)
    console.log(sourceEvent)
  }

  public eventClicked(format: 'month' | 'week' | 'day', event: CalendarEvent) {
    const id = event.id
    const data = id == null ? null : this.reminders?.filter((v) => v.id === id)[0];
    const dialogRef = this.dialog.open(ReminderDialogComponent, {
      data: {
        data: data,
        mode: 'R'
      },
      autoFocus: true,
    })
  }

  public mapTodoToCalendarEvent(r: TodoModel): CalendarEvent {
    r.startDate = typeof r.startDate === 'string' ? new Date(r.startDate) : r.startDate
    r.endDate = typeof r.endDate === 'string' ? new Date(r.endDate) : r.endDate
      return {
        id: r.id,
        start: r.startDate,
        end: r.endDate,
        title: r.title,
        draggable: false,
        allDay: r.startDate.getDay() !== r.endDate.getDay(),
      };
  }


}
