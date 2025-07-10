import { AfterContentChecked, Component, Inject, inject, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './Services/shared.service';
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
    console.log("appcomponent is initialized");
    console.log(this.router);
    console.log(this.logoutService);
    
  }

  isInAuthPages: boolean = true;

  ngAfterContentChecked(): void {
    if(this.router.url === '/login' || this.router.url === '/signup' || this.router.url === '/') {
      this.isInAuthPages = false;
      // localStorage.removeItem('user');
    } else {
      this.isInAuthPages = true;
    }
  }
}
