import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { TripsComponent } from './trips/trips.component';
import { BucketListComponent } from './bucket-list/bucket-list.component';
import { UserTripComponent } from './user-trip/user-trip.component';
import { UsersDetailsComponent } from './users-details/users-details.component';
import { canActivateRouteGuard } from './RouteGuards/authGuard'
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'user', canActivateChild: [canActivateRouteGuard], children: [
    {path: 'Home', component: HomeComponent},
    {path: 'Trips', component: TripsComponent},
    {path: 'BucketLists', component: BucketListComponent},
    {path: 'profile', component: ProfileComponent}
  ]},
  {path: 'admin', canActivateChild: [canActivateRouteGuard], children: [
    { path: '', redirectTo: 'UsersTrips', pathMatch: 'full' },
    {path: 'UsersTrips', component: UserTripComponent},    
    {path: 'Users', component: UsersDetailsComponent},

  ]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouteModule { }
