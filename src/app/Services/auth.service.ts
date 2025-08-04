import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../Models/user';
import { BehaviorSubject, catchError, map, Observable, Subject, tap, throwError } from 'rxjs';
import { LoginUser } from '../Models/loginUser';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';
import { countries } from '../constants/countries';
import { secretKey } from '../constants/countries';
import * as CryptoJS from 'crypto-js';
import { UsersDetailsComponent } from '../users-details/users-details.component';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  user = new Subject<LoginUser>();
  loadTableObservable = new Subject();
  // secretKey: string = 'TravelTrail';
  countries = countries;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedservice: SharedService,
  ) {}

  signup(email: string, password: string, data: User, adminSignUp?: boolean) {
    // console.log(email);
    // console.log(password);
    // console.log(data);    
    const dataToCreateuser = {email: email, password: password, returnSecureToken: true};
    if(adminSignUp) {
      // let userdetailcomponent = inject(UsersDetailsComponent);
      // console.log(userdetailcomponent);      
      this.http.post<any>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA0CxBGkhNtT1q48ZjBhu4aFn1FsQgYoxs', dataToCreateuser)
                        .subscribe((res) => {
                          // console.log(res);                          
                          this.http.post('https://travektrail-app-default-rtdb.firebaseio.com/users.json', data)
                            .subscribe((response) => {
                              // console.log(response);
                              // userdetailcomponent.loadUserdetailsInTable();
                              this.loadTableObservable.next(response);
                            });
                        })
    } else {
      this.http.post<any>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA0CxBGkhNtT1q48ZjBhu4aFn1FsQgYoxs', dataToCreateuser)
                        .subscribe((res) => {
                          // console.log(res);                          
                          this.http.post('https://travektrail-app-default-rtdb.firebaseio.com/users.json', 
                            data,
                            {params: new HttpParams().set("auth", `${res.idToken}`)}
                          )
                            .subscribe((response) => {
                              console.log(response);
                            });
                        })
    }   
    
  }

  login(email: string, password: string) {
    const data = {email: email, password: password, returnSecureToken: true};
    return this.http.post<any>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA0CxBGkhNtT1q48ZjBhu4aFn1FsQgYoxs', data)
                        .pipe(map((res) => {
                          this.handleCreateuser(res);
                        }));
    // localStorage.clear();
    // return this.sharedservice.getAllUsers().pipe(
    //   map((allUsers: User[]) => {
    //     // console.log(allUsers);
    //     const foundUser = allUsers.find((user) => {
    //       // console.log(user);
    //       let encryptedPassword = user.password;
    //       // console.log(encryptedPassword);          
    //       let code = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    //       let decryptedPassword = code.toString(CryptoJS.enc.Utf8);
    //       // console.log(decryptedPassword);          
    //       return (user.email === email || user.username === email) && decryptedPassword === password;
    //     });
    //     // console.log(foundUser);
    //     if (foundUser) {
    //       const loginTime = new Date().getTime();
    //       let isAdmin = foundUser.isAdmin;
    //       let country = this.countries.find((country) => {
    //         return country.code === foundUser.country;
    //       });
    //       // console.log(foundUser.country);       
    //       let user: LoginUser = { username: foundUser.username, id: foundUser.id, loginTime: loginTime, isAdmin, country };
    //       localStorage.setItem('user', JSON.stringify(user));
    //       // alert('User login successfully');
    //       return foundUser;
    //     } else {
    //       localStorage.removeItem('user');
    //       // alert('Invalid Username or password');
    //       return null;
    //     }
    //   }),
    //   catchError((error) => {
    //     console.error('Error fetching users for login:', error);
    //     localStorage.removeItem('user');
    //     alert('An error occurred during login. Please try again.');
    //     return of(null);
    //   })
    // );
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

  autoLogin() {
    const user = JSON.parse(localStorage.getItem('user'));

        if(!user){
            return;
        }

        if(user.idToken){
            const timerValue = new Date(user._expiresIn).getTime() - new Date().getTime();
            this.autoLogout(timerValue);
        }
  }

  tokenExpiryTimer: any;
  autoLogout(expiryTime) {
    this.tokenExpiryTimer  = setTimeout(() => {
      this.logout();
    }, expiryTime);
  }

  handleCreateuser(data) {
    console.log(data);
    const tokenId = data.idToken;
    const expiresInTs = new Date().getTime() + +data.expiresIn * 1000;
    const expiresIn = new Date(expiresInTs);
    const email = data.email;
    this.autoLogout(data.expiresIn * 1000);
    let user: LoginUser;
    this.sharedservice.getAllUsers(tokenId).pipe(map((res) => {
      console.log(res);
      let foundUser = res.find((user) => {
        return email === user.email;
      })
      console.log(foundUser);
      if(foundUser) {
        let country = this.countries.find((country) => {
          return country.code === foundUser.country;
        });
        user = new LoginUser(foundUser.username, foundUser.id, new Date().getTime(), foundUser.isAdmin, country, tokenId, expiresIn);
        localStorage.setItem("user", JSON.stringify(user));
        this.user.next(user);
        return user;
      } else {
        localStorage.clear();
        return null;
      } 
    })).subscribe((res) => {
      console.log(res);
      // return res;      
    });
  }

  handleError(err) {
    let errorMessage = "An unknown Error occerred";
    // console.log(err);
    if(!err.error || !err.error.error){
        return throwError(() => errorMessage);
    }
    if(err.error.error.message === 'INVALID_LOGIN_CREDENTIALS') {
      errorMessage = "Invalid Username or Password";
    }
    return throwError(() => errorMessage);
  }
  
}
