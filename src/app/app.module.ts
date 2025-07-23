import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouteModule } from './route.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { TripsComponent } from './trips/trips.component';
import { BucketListComponent } from './bucket-list/bucket-list.component';
import { UserTripComponent } from './user-trip/user-trip.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UsersDetailsComponent } from './users-details/users-details.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth/auth.component';

import { ToggleButtonModule } from 'primeng/togglebutton'
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';

import { ChartModule } from 'primeng/chart';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http'

import { DropdownModule } from 'primeng/dropdown';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';

import { ImageModule } from 'primeng/image';

import { PaginatorModule } from 'primeng/paginator';
import { LoaderComponent } from './utility/loader/loader.component';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotFoundComponent } from './not-found/not-found.component';

import { OverlayPanelModule } from 'primeng/overlaypanel';

import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    TripsComponent,
    BucketListComponent,
    UserTripComponent,
    LoginComponent,
    SignupComponent,
    AuthComponent,
    UsersDetailsComponent,
    LoaderComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    RouteModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToggleButtonModule,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    InputSwitchModule,
    ChartModule,
    TableModule,
    DialogModule,
    ListboxModule,
    MultiSelectModule,
    ImageModule,
    PaginatorModule,
    ToastModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
