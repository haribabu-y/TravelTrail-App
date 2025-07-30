import { inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  
  time: any;
  timeout = 10 * 60 * 1000;
  events: string[] = ['click', 'mousemove', 'keydown', 'scroll'];
  constructor(private ngZone: NgZone,private router: Router) { 
    this.startCounting();
    // console.log('Auto logout service started');
   }

   startCounting() {
    this.ngZone.runOutsideAngular(() => {
      this.events.forEach(event => window.addEventListener(event, () => this.resetTimer()))
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
