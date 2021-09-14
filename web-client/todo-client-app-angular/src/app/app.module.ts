import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter as AngularCalendarDateAdapter } from 'angular-calendar';
import { environment } from 'src/environments/environment';
import { ReminderDialogComponent } from './reminder-dialog/reminder-dialog.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HomeComponent } from './home/home.component';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { SideBarComponent } from './side-bar/side-bar/side-bar.component';
import { ListComponent } from './dashboard/list/list.component';
import { CalendarComponent } from './dashboard/calendar/calendar.component';
import { SideBarService } from './services/side-bar/side-bar.service';
import { UserDataService } from './services/user-data/user-data.service';
import { UserService } from './services/user/user.service';
import { TodoDataService } from './services/todo-data/todo-data.service';
import { TodoService } from './services/todo/todo.service';
import { SubscriptionService } from './services/subscription/subscription.service';
import { LoginSubjectService } from './services/login-subject/login-subject.service';
import { AuthButtonSubjectService } from './services/auth-button-subject/auth-button-subject.service';
import { AuthService } from './services/auth/auth.service';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ReminderDialogComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    SignupComponent,
    HomeComponent,
    SideBarComponent,
    ListComponent,
    CalendarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgxMaterialTimepickerModule,
    AppRoutingModule,
    FlexLayoutModule,
    CalendarModule.forRoot({
      provide: AngularCalendarDateAdapter,
      useFactory: adapterFactory,
    }),
    NgxMaterialTimepickerModule.setLocale('en-US'),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    SideBarService,
    UserDataService,
    UserService,
    TodoDataService,
    TodoService,
    SubscriptionService,
    LoginSubjectService,
    AuthButtonSubjectService,
    AuthService,
    {
      provide: 'BASE_API_URL',
      useValue: environment.apiUrl
    },
    {
      provide: 'PUBLIC_VAPID_KEY',
      useValue: environment.vapidKey
    },
    {
      provide: 'ENV_TYPE',
      useValue: environment.env
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'en-US'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
