import { SignupComponent } from './../signup/signup.component';
import { LoginComponent } from './../login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { SubscriptionService } from '../services/subscription/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthButtonSubjectService } from '../services/auth-button-subject/auth-button-subject.service';
import { SideBarService } from '../services/side-bar/side-bar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private _isMenuOpened: boolean = false;


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackbar: MatSnackBar,
    private authButtonSubjectService: AuthButtonSubjectService,
    private sideBarService: SideBarService
  ) {
    this.sideBarService.sideBarOpenObservable().subscribe((v: boolean) => this._isMenuOpened = v);
  }

  ngOnInit(): void {
  }

  public get isLoggedIn(): boolean {
    return this.authService.token != null
  }

  public get isMenuOpened(): boolean {
    return this._isMenuOpened
  }

  public set isMenuOpened(value: boolean) {
    this._isMenuOpened = value
    this.sideBarService.sideBarOpen(this._isMenuOpened)
  }

  public get userName(): string | null {
    const user = this.authService.user;
    if (user == null) return null;
    return `${user.firstName} ${user.lastName}`
  }

  public logout(): void {
    this.userService.logout().subscribe(() => {
      this.authService.token = null;
      this.authService.user = null;
      this.router.navigate(['/home'])
    })
  }

  public openLoginDialog(): void {
    // this.dialog.open(LoginComponent).afterClosed().subscribe(this.afterDialogClose)
    this.authButtonSubjectService.authButtonPressed('login')
  }

  private afterDialogClose(value: any) {
    // this.subscriptionService.subscribe();
    this.snackbar.open(`Welcome back ${value.user.firstName}!`, 'Dismiss', { duration: 3 * 1000 });
    this.router.navigate(['/dashboard']);
  }

  public openSignupDialog(): void {
    // this.dialog.open(SignupComponent).afterClosed().subscribe(this.afterDialogClose)
    this.authButtonSubjectService.authButtonPressed('signin')
  }

}
