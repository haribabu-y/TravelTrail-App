import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouteModule } from './route.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { TripsComponent } from './trips/trips.component';
import { BucketListComponent } from './bucket-list/bucket-list.component';
import { UserTripComponent } from './user-trip/user-trip.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UsersDetailsComponent } from './users-details/users-details.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { ProfileComponent } from './profile/profile.component';

import { AccordionModule } from 'primeng/accordion';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptorSevice } from './Services/auth-interceptor.service';
import { HighlightRowDirective } from './CustomDirectives/highlight-row.directive';
import { SetBackgroundColorDirective } from './CustomDirectives/set-background-color.directive';
import { SearchFilterPipe } from './CustomPipes/search-filter.pipe';

import { CustomClassDirective } from './CustomDirectives/customClass.directive';
import { CustomIfDirective } from './CustomDirectives/customIf.directive';
import { CustomTitlecasePipe } from './CustomPipes/CustomTitlecase.pipe';
import { DigitsOnlyDirective } from './CustomDirectives/digitesOnly.directive';
import { StringOnlyDirective } from './CustomDirectives/stringOnly.directive';
import { HandleErrorInterceptor } from './Services/handle-error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    TripsComponent,
    BucketListComponent,
    UserTripComponent,
    LoginComponent,
    SignupComponent,
    UsersDetailsComponent,
    LoaderComponent,
    NotFoundComponent,
    ProfileComponent,
    HighlightRowDirective,
    SetBackgroundColorDirective,
    SearchFilterPipe,
    CustomClassDirective,
    CustomIfDirective,
    CustomTitlecasePipe,
    DigitsOnlyDirective,
    StringOnlyDirective
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
    TooltipModule,
    AccordionModule
  ],
  providers: [
    MessageService,
    {provide: HTTP_INTERCEPTORS, useClass: HandleErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: authInterceptorSevice, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
