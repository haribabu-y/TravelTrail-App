import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Authservice } from '../Services/auth.service';
import { Router } from '@angular/router';
import { User } from '../Models/user';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authService: Authservice = inject(Authservice);
  router: Router = inject(Router)
  errorMessage: string = ''
  messageService: MessageService = inject(MessageService);
  onLoginSubmit(form: NgForm) {
    if(form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(form.value);
    this.authService.login(email, password).subscribe({
      next: (user: User | null) => {
        if(user) {
          this.errorMessage = 'Login Successful!..';
          this.messageService.add({severity: 'success', summary: 'Success', detail: this.errorMessage})
          setTimeout(() => {
            this.router.navigate(['/user/Home']);
          },1500)
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
    // this.authService.login(email, password);    
    // let user = localStorage.getItem('user');
    // if(user) {
    //   this.router.navigate(['/user/Home'])
    // } else {
    //   this.erroemessage = 'Invalid Username or password!'
    //   alert(this.erroemessage);
    // }
    
    form.reset();
  }
}
