import { Component, inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Authservice } from '../Services/auth.service';
import { Router } from '@angular/router';
import { User } from '../Models/user';
import { MessageService } from 'primeng/api';
import { LoginUser } from '../Models/loginUser';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authService: Authservice = inject(Authservice);
  router: Router = inject(Router)
  errorMessage: string = ''
  messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    const body = document.body;
    body.classList.remove('dark-mode');
  }

  onLoginSubmit(form: NgForm) {
    if(form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(form.value);
    this.authService.login(email, password).subscribe({
      next: (user: User | null ) => {
        if(user) {
          console.log(user);          
          this.errorMessage = 'Login Successful!..';
          this.messageService.add({severity: 'success', summary: 'Success', detail: this.errorMessage})
          if(user.username === 'admin') {
            this.router.navigate(['/admin/UsersTrips']);
          } else if(user.isAdmin) {
            this.router.navigate(['/admin/UsersTrips']);
          }
          else {
            // console.log(user);    
            // this.loggedInUser.next(user);      
            this.router.navigate(['/user/Home']);
            form.reset();
          }          
        } else {
          this.errorMessage = 'Invalid Username or Password';
          this.messageService.add({severity: 'error', summary: 'Error', detail: this.errorMessage})
        }
      },
      error: (err) => {
        console.error('Login error in component:', err);
        this.errorMessage = 'An unexpected error occurred during login.';
        localStorage.removeItem('user');
      },
      complete: () => {
        console.log('Login attempt complete.');        
      }
    });    
  }
}
