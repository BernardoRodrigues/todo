import { SubscriptionService } from './../services/subscription/subscription.service';
import { UserDataService } from './../services/user-data/user-data.service';
import { AuthService } from './../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginFormGroup: FormGroup;
  private showPassword: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private userService: UserService,
    private authService: AuthService,
    private userDataService: UserDataService,
    ) {
    this.loginFormGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    })
  }

  get show(): boolean {
    return this.showPassword
  }

  set show(value: boolean) {
    this.showPassword = value
  }

  ngOnInit(): void {
  }

  public get isEmailInvalid(): boolean {
    const form = this.loginFormGroup.get('email')
    if (form == null) return false;
    return form?.invalid && (form.dirty || form.touched);
  }

  public get emailForm(): FormControl {
    return this.loginFormGroup.get('email') as FormControl
  }

  public get isPasswordInvalid(): boolean {
    const form = this.loginFormGroup.get('password')
    if (form == null) return false;
    return form?.invalid && (form.dirty || form.touched);
  }

  public get passwordForm(): FormControl {
    return this.loginFormGroup.get('password') as FormControl
  }

  public submitLogin(): void {
    const email = this.emailForm.value
    const password = this.passwordForm.value
    this.userService.login(email, password).subscribe((value) => {
      // this.subscriptionService.subscribe().subscribe(() => {
      // })
      this.authService.token = value.token
      this.authService.user = value.user
      this.userDataService.user = value.user
      this.dialogRef.close(value)
    })
  }

}
