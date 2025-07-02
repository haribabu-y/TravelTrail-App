import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode: boolean = true;
  
  currentPage: number = 1;

  formData = {
    username: '',
    firstName: '',
    lastName: '',
    gender: '',
    dob: Date,
    email: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    zipCode: '',
    timeZone: '',
    locale: '',
    isAdmin: false,
    password: '',
    confirmPassword: ''
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onFormSubmit(form: NgForm) {
    console.log(this.formData);
    if(form.invalid) {
      return;
    } 
    console.log('form is submitted');
  }

  goToPage(value: number) {
    this.currentPage = value;
    console.log(this.formData)
  }

}
