import { AfterContentChecked, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentChecked {
  title = 'TravelTrail-App';
  router: Router = inject(Router)

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
