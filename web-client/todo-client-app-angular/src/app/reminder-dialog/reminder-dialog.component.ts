import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoService } from './../services/todo/todo.service';
import { DateAdapter as AngularCalendarDateAdapter } from 'angular-calendar';
import { PriorityModel } from './../models/priority.model';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { PriorityEnumModel } from './../models/priority-enum.model';
import { TodoModel } from './../models/todo.model';
import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReminderDialogDataModel } from '../models/reminder-dialog-data.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';

@Component({
  selector: 'app-reminder-dialog',
  templateUrl: './reminder-dialog.component.html',
  styleUrls: ['./reminder-dialog.component.scss']
})
export class ReminderDialogComponent implements OnInit {

  public reminderFormGroup: FormGroup;
  private editing: boolean = false;
  public priorities: {value: number, name: string, color: string}[] = [
    {value: 1, name: 'Low', color: '#0be03d'},
    {value: 2, name: 'Normal', color: '#c8f533'},
    {value: 3, name: 'High', color: '#e60000'},
  ]
  public mode: 'C' | 'R' = 'R';

  constructor(
    private dialogRef: MatDialogRef<ReminderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: {data: TodoModel, mode: 'C' | 'R'},
    private todoService: TodoService,
    private snackbar: MatSnackBar
  ) {
    if (this.dialogData != null && this.dialogData.mode != null) {
      this.mode = this.dialogData.mode;
    }
    const startDataDate = dialogData.data == null || dialogData.data.startDate == null ? new Date() : new Date(dialogData.data.startDate);
    const endDataDate = dialogData.data == null || dialogData.data.endDate == null ? new Date() :  new Date(dialogData.data.endDate);
    const startDateTime = dialogData.data == null || dialogData.data.startDate == null ? `00:00` : `${dialogData.data.startDate.getHours()}:${dialogData.data.startDate.getMinutes()}`
    const endDateTime = dialogData.data == null || dialogData.data.endDate == null ? `00:00` : `${dialogData.data.endDate.getHours()}:${dialogData.data.endDate.getMinutes()}`
    this.reminderFormGroup = new FormGroup({
      title: new FormControl(dialogData.data == null || dialogData.data.title == null ? null : dialogData.data.title, [Validators.required]),
      startDateDate: new FormControl(startDataDate, [Validators.required]),
      endDateDate: new FormControl(endDataDate, [Validators.required]),
      startDateTime: new FormControl(startDateTime, [Validators.required]),
      endDateTime: new FormControl(endDateTime, [Validators.required]),
      priority: new FormControl(dialogData.data == null ? null : dialogData.data.priority?.value, [Validators.required])
    }, [this.dates])
  }

  private dates(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const startDateDate = control.get('startDateDate') as FormControl;
      const startDateTime = control.get('startDateTime') as FormControl;
      const endDateDate = control.get('endDateDate') as FormControl;
      const endDateTime = control.get('endDateTime') as FormControl;
      if (startDateDate.untouched || endDateDate.untouched || startDateTime.untouched || endDateTime.untouched) {
        return null;
      }
      const [ startDateHour, startDateMinutes ] = (startDateTime.value as string).split(':')
      const startDate = moment(new Date(startDateDate.value)).set('hour', +startDateHour).set('minute', +startDateMinutes)
      const [ endDateHour, endDateMinutes ] = (endDateTime.value as string).split(':')
      const endDate = moment(new Date(endDateDate.value)).set('hour', +endDateHour).set('minute', +endDateMinutes)
      console.log("End Date after start date: ", endDate.isAfter(startDate))
      return endDate.isAfter(startDate) ? null : { date: 'Start Date is after End Date' };
    }
  }

  ngOnInit(): void {

  }

  public get edit(): boolean {
    return this.editing;
  }

  private get startDate(): Date {
    const startDateDate = this.reminderFormGroup.get('startDateDate') as FormControl;
    const startDateTime = this.reminderFormGroup.get('startDateTime') as FormControl;
    const [ startDateHour, startDateMinutes ] = (startDateTime.value as string).split(':');
    return moment(new Date(startDateDate.value)).set('hour', +startDateHour).set('minute', +startDateMinutes).toDate()
  }

  private get endDate(): Date {
    const endDateDate = this.reminderFormGroup.get('endDateDate') as FormControl;
    const endDateTime = this.reminderFormGroup.get('endDateTime') as FormControl;
    const [ endDateHour, endDateMinutes ] = (endDateTime.value as string).split(':')
    return moment(new Date(endDateDate.value)).set('hour', +endDateHour).set('minute', +endDateMinutes).toDate();
  }

  public set edit(value: boolean) {
    this.editing = value;
    if (this.editing) {
      this.reminderFormGroup.enable();
    } else {
      this.reminderFormGroup.disable();
    }
  }

  public get color(): string {
    if (this.dialogData.data == null) return '';
    if (this.dialogData.data.priority == null) {
      return 'green'
    }
    switch(this.dialogData.data.priority.value) {
      default:
      case PriorityEnumModel.Low:
        return 'green'
      case PriorityEnumModel.Normal:
        return 'warning'
      case PriorityEnumModel.High:
        return 'danger'
    }
  }

  public createNewReminder() {
    if (this.reminderFormGroup.invalid) return;

    const t = {
      title: (this.reminderFormGroup.get('title') as FormControl).value as string,
      startDate: this.startDate,
      endDate: this.endDate,
      priority: +((this.reminderFormGroup.get('priority') as FormControl).value as string)
    }
    this.todoService.create(t).subscribe((v) => {
      const todo: TodoModel = {
        id: v.id,
        title: t.title,
        startDate: t.startDate,
        endDate: t.endDate,
        priority: {
          value: t.priority,
          name: this.priorities.filter((p) => p.value === t.priority)[0].name
        }
      }
      this.dialogRef.close(todo)
      this.snackbar.open("New Reminder Created!", 'Dismiss', {duration: 3*1000})
    })
  }

}
