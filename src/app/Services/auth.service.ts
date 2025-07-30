import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../Models/user';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { LoginUser } from '../Models/loginUser';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';
import { countries } from '../constants/countries';
import { secretKey } from '../constants/countries';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  user: LoginUser;
  // secretKey: string = 'TravelTrail';
  countries = countries;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedservice: SharedService
  ) {}

  signup(data: User) {
    console.log(data);
    this.http.post('https://travektrail-app-default-rtdb.firebaseio.com/users.json', data)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string): Observable<LoginUser | User | null> {
    // if (email === 'Admin' && password === 'Admin') {
    //   let username = 'admin';
    //   let loginTime = new Date().getTime();
    //   let isAdmin = true;
    //   let country = { name: 'India', code: 'IN', currencyCode: 'INR', currencySymbol: '₹', phoneCode: '+91' };
    //   let user: LoginUser = { username: username, id: '', loginTime: loginTime, isAdmin, country};
    //   localStorage.setItem('user', JSON.stringify(user));
    //   this.router.navigate(['/admin/UsersTrips']);
    //   return of(user);
    // }
    localStorage.clear();
    return this.sharedservice.getAllUsers().pipe(
      map((allUsers: User[]) => {
        // console.log(allUsers);
        const foundUser = allUsers.find((user) => {
          // console.log(user);
          let encryptedPassword = user.password;
          // console.log(encryptedPassword);          
          let code = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
          let decryptedPassword = code.toString(CryptoJS.enc.Utf8);
          // console.log(decryptedPassword);          
          return (user.email === email || user.username === email) && decryptedPassword === password;
        });
        // console.log(foundUser);
        if (foundUser) {
          const loginTime = new Date().getTime();
          let isAdmin = foundUser.isAdmin;
          let country = this.countries.find((country) => {
            return country.code === foundUser.country;
          });
          // console.log(foundUser.country);       
          let user: LoginUser = { username: foundUser.username, id: foundUser.id, loginTime: loginTime, isAdmin, country };
          localStorage.setItem('user', JSON.stringify(user));
          // alert('User login successfully');
          return foundUser;
        } else {
          localStorage.removeItem('user');
          // alert('Invalid Username or password');
          return null;
        }
      }),
      catchError((error) => {
        console.error('Error fetching users for login:', error);
        localStorage.removeItem('user');
        alert('An error occurred during login. Please try again.');
        return of(null);
      })
    );
  }

  isloggedIn(): boolean {
    const userString = localStorage.getItem('user');
    if (!userString) {
      return false;
    } else {
      return true;
    }
  }

  logout() {
    let user = localStorage.getItem('user');
    if (user) {
      // localStorage.removeItem('user');
      localStorage.clear();
      localStorage.removeItem("preloadGraph");
    }
    this.router.navigate(['/login']);
  }
}
