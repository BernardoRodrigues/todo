import { UserModel } from './../models/user.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { SubscriptionService } from '../services/subscription/subscription.service';
import { UserDataService } from '../services/user-data/user-data.service';
import { UserService } from '../services/user/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signupFormGroup: FormGroup;
  private showPassword: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SignupComponent>,
    private userService: UserService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private userDataService: UserDataService,
    // private subscriptionService: SubscriptionService,
    private router: Router
    ) {
    this.signupFormGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    })
  }

  public get isFormValid(): boolean {
    return this.signupFormGroup.valid;
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
    return this.isFormControlInvalid('email')
  }

  public get emailForm(): FormControl {
    return this.signupFormGroup.get('email') as FormControl
  }

  public get firstNameForm(): FormControl {
    return this.signupFormGroup.get('firstName') as FormControl
  }

  public get isFirstNameInvalid(): boolean {
    return this.isFormControlInvalid('firstName')
  }

  public get isLastNameInvalid(): boolean {
    return this.isFormControlInvalid('lastName')
  }

  public get lastNameForm(): FormControl {
    return this.signupFormGroup.get('lastName') as FormControl
  }

  public get isPasswordInvalid(): boolean {
    return this.isFormControlInvalid('password');
  }

  public get passwordForm(): FormControl {
    return this.signupFormGroup.get('password') as FormControl
  }

  public submitNewAccount(): void {
    const email = this.emailForm.value
    const password = this.passwordForm.value
    const firstName = this.firstNameForm.value
    const lastName = this.lastNameForm.value
    this.userService.signup(email, password, firstName, lastName).subscribe((value) => {
      // this.subscriptionService.subscribe().subscribe(() => {
      // })
      const user: UserModel = {
        id: value.id,
        email: email,
        firstName: firstName,
        lastName: lastName
      }
      this.authService.token = value.token
      this.authService.user = user
      this.userDataService.user = user
      this.dialogRef.close(value)
    },
    (error: HttpErrorResponse) => {
      if (error.status === 400) {
        this.snackbar.open('Email already being used', 'Dismiss')
      }
    })
  }

  private isFormControlInvalid(name: string): boolean {
    const form = this.signupFormGroup.get(name)
    if (form == null) return false;
    return form?.invalid && (form.dirty || form.touched);
  }

}
