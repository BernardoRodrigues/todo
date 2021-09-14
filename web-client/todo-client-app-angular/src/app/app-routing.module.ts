import { HomeComponent } from './home/home.component';
import { DashboardResolver } from './services/dashboard-resolver/dashboard.resolver';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    resolve: {
      reminders: DashboardResolver
    }
  },
  {
    path: '/',
    redirectTo: 'home',
    pathMatch: '**'
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: '**'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
