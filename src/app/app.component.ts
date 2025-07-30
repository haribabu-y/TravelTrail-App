import { AfterContentChecked, Component, Inject, inject, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from './Services/autoLogout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentChecked, OnInit {
  title = 'TravelTrail-App';
  router: Router = inject(Router)
  logoutService: LogoutService = inject(LogoutService)
  
  ngOnInit() {
    // console.log("appcomponent is initialized");
    // console.log(this.router);
    // console.log(this.logoutService);
  }

  isInAuthPages: boolean = true;

  ngAfterContentChecked(): void {
    let currentUrl = this.router.url;
    if(currentUrl === '/login' || currentUrl === '/signup' || currentUrl === '/' || currentUrl.includes('/login') || currentUrl.includes('/signup')) {
      this.isInAuthPages = false;
      // localStorage.removeItem('user');
    } else {
      this.isInAuthPages = true;
    }
  }
}
