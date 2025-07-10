import { inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  ngZone: NgZone = inject(NgZone);
  router: Router = inject(Router);
  time: any;
  timeout = 10 * 60 * 1000;
  constructor() { 
    this.startCounting();
    // console.log('Auto logout service started');
   }

   startCounting() {
    this.ngZone.runOutsideAngular(() => {
      ['click', 'mousemove', 'keydown', 'scroll', 'touchstart']
      .forEach(event => window.addEventListener(event, () => this.resetTimer()))
    });
    this.resetTimer();
    // console.log('counting started');
   }

   resetTimer() {
    clearTimeout(this.time);
    this.time = setTimeout(() => this.logout(), this.timeout);
    // console.log('reseting the time');
   }

   logout() {
    this.ngZone.run(() => {
      localStorage.clear();
      this.router.navigate(['/login'])
      // console.log('local storage clearing');
      // console.log("navigating the user to the login");
    })
   }
}
