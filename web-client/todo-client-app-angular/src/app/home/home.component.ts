import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { AuthButtonSubjectService } from '../services/auth-button-subject/auth-button-subject.service';
import { LoginSubjectService } from '../services/login-subject/login-subject.service';
import { SubscriptionService } from '../services/subscription/subscription.service';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(
    private authButtonSubjectService: AuthButtonSubjectService,
    private snackbar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private loginSubjectService: LoginSubjectService
  ) {
    this.subscription = this.authButtonSubjectService.authButtonPressedObservable().subscribe((v) => {
      if (v === 'login') {
          this.dialog.open(LoginComponent).afterClosed().subscribe(this.afterDialogClose)
      } else if (v === 'signin') {
          this.dialog.open(SignupComponent).afterClosed().subscribe(this.afterDialogClose)
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

  }

  private afterDialogClose(value: any) {
    if (value != null) {
      this.loginSubjectService.userLogIn();
      this.snackbar.open(`Welcome back ${value.user.firstName}!`, 'Dismiss', { duration: 3 * 1000 });
      this.router.navigate(['/dashboard']);
    }
  }

}
