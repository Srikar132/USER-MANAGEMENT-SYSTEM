
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { UserformComponent } from './dashboard/userForm/userform.component';
import { HomeComponent } from './home/home.component';
import { ViewProfileComponnet } from './dashboard/viewProfile/view-profile.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent , canActivate : [AuthGuard ] },
  { path: 'profile', component: UserProfileComponent, canActivate : [AuthGuard] },
  {path :'editform/:id',component : UserformComponent},
  {path :'home' , component : HomeComponent},
  {path : 'dashboard/profile/:id' , component : ViewProfileComponnet},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
