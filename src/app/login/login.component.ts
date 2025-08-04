import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Authservice } from '../Services/auth.service';
import { Router } from '@angular/router';
import { User } from '../Models/user';
import { MessageService } from 'primeng/api';
import { catchError, Subscription, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMessage: string = ''
  loginSubscription: Subscription;
  userSuscription: Subscription;

  constructor(
    private authService: Authservice,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    localStorage.clear();
    const body = document.body;
    body.classList.remove('dark-mode');

    this.userSuscription = this.authService.user.subscribe((user) => {
      console.log(user); 
      if(user) {
          // console.log(user);          
          this.errorMessage = 'Login Successful!..';
          this.messageService.add({severity: 'success', summary: 'Success', detail: this.errorMessage})
          if(user.isAdmin) {
            this.router.navigate(['/admin/UsersTrips']);
          }
          else {
            // console.log(user);    
            // this.loggedInUser.next(user);      
            this.router.navigate(['/user/Home']);
            // form.reset();
          }          
        } else {
          this.errorMessage = 'Invalid Username or Password';
          this.messageService.add({severity: 'error', summary: 'Error', detail: this.errorMessage})
        }     
    })
  }

  onLoginSubmit(form: NgForm) {
    if(form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    // console.log(form.value);
    // this.loginSubscription = 
    this.authService.login(email, password).pipe(catchError((error: HttpErrorResponse) => {
      console.log(error);
      return throwError(error.error.message);      
    })).subscribe({
      next: (res) => {
        // console.log(res);
      },
      error: (err) => {
        // console.log(err);   
        if(err === 'INVALID_LOGIN_CREDENTIALS') {
          this.errorMessage = 'Invalid Username or Password';
        } else {
          this.errorMessage = "An Unknown Error occerred";
        }
        // this.errorMessage = err;
        this.messageService.add({severity: 'error', summary: 'Error', detail: this.errorMessage});
        return;
      }
    })
    // .subscribe({
    //   next: (user: User | null ) => {
    //     if(user) {
    //       // console.log(user);          
    //       this.errorMessage = 'Login Successful!..';
    //       this.messageService.add({severity: 'success', summary: 'Success', detail: this.errorMessage})
    //       if(user.isAdmin) {
    //         this.router.navigate(['/admin/UsersTrips']);
    //       }
    //       else {
    //         // console.log(user);    
    //         // this.loggedInUser.next(user);      
    //         this.router.navigate(['/user/Home']);
    //         form.reset();
    //       }          
    //     } else {
    //       this.errorMessage = 'Invalid Username or Password';
    //       this.messageService.add({severity: 'error', summary: 'Error', detail: this.errorMessage})
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Login error in component:', err);
    //     this.errorMessage = 'An unexpected error occurred during login.';
    //     localStorage.removeItem('user');
    //   },
    //   complete: () => {
    //     // console.log('Login attempt complete.');
    //     this.messageService.add({severity: 'success', summary:'Success', detail:"Login Successful!."});    
    //   }
    // });    
  }

  ngOnDestroy(): void {
    if(this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if(this.userSuscription) {
      this.userSuscription.unsubscribe();
    }
  }
}
