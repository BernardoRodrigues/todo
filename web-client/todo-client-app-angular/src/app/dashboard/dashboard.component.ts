import { MatDialog } from '@angular/material/dialog';
import { TodoModel } from './../models/todo.model';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { CalendarView, CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { ReminderDialogComponent } from '../reminder-dialog/reminder-dialog.component';
import * as moment from 'moment';
import { SwPush } from '@angular/service-worker';
import { SubscriptionService } from '../services/subscription/subscription.service';
import { SideBarService } from '../services/side-bar/side-bar.service';
import { TodoDataService } from '../services/todo-data/todo-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private _openNavItem: 'list' | 'calendar' = 'list';

  private _reminders: TodoModel[] | undefined;

  public _events: CalendarEvent[] = [];

  private _sideBarOpen: boolean = false;

  public get sideBarOpen(): boolean {
    return this._sideBarOpen;
  }

  public set sideBarOpen(value: boolean) {
    this._sideBarOpen = value;
  }

  public get reminders(): TodoModel[] | undefined {
    return this._reminders;
  }

  public get openNavItem(): 'list' | 'calendar' {
    return this._openNavItem;
  }

  public set openNavItem(v: 'list' | 'calendar') {
    this._openNavItem = v;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private sideBarService: SideBarService,
    private todoDataService: TodoDataService,
    public dialog: MatDialog
  ) {
    this.activatedRoute.data.subscribe((data) => {
      this._reminders = data.reminders;
      if (this._reminders != null) {
        this.todoDataService.reminders = data.reminders;
        this.todoDataService.todoDataSubject.next(data.reminders);
        // this._events = this._reminders.filter((v) => !v.isCancelled && !v.isDone).map(this.mapTodoToCalendarEvent)
      }
    });
    this.sideBarService.sideBarOpenObservable().subscribe((v: boolean) => {
      this.sideBarOpen = v;
    })
  }

  public drawerClosed(): void {
    this.sideBarService.sideBarOpen(false);
  }
  


  ngOnInit(): void {
    
  }

  public openDialogToCreateEvent() {
    const dialogRef = this.dialog.open(ReminderDialogComponent, {
      data: {
        data: null,
        mode: 'C'
      }
    })
    dialogRef.afterClosed().subscribe((v: TodoModel) => {
      if (this._reminders != null) {
        this._reminders?.push(v)
        this.todoDataService.add(v)
        this._events = this._reminders.map(this.mapTodoToCalendarEvent)
      }
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
