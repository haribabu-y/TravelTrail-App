import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../Models/user';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { LoginUser } from '../Models/loginUser';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  http: HttpClient = inject(HttpClient);
  //   user = new BehaviorSubject<LoginUser>(null);
  loggedInUser = new BehaviorSubject<User>(null);
  user: LoginUser;
  router: Router = inject(Router);
  sharedservice: SharedService = inject(SharedService)

  // public getAllUsers(): Observable<User[]> {
  //   return this.http
  //     .get<User[]>(
  //       'https://travektrail-app-default-rtdb.firebaseio.com/users.json'
  //     )
  //     .pipe(
  //       map((response) => {
  //         // console.log(response);
  //         let users = [];
  //         for (let key in response) {
  //           if (response.hasOwnProperty(key)) {
  //             users.push({ ...response[key], id: key });
  //           }
  //         }
  //         console.log(users);
  //         return users;
  //       }),
  //       catchError((err) => {
  //         return throwError(() => err);
  //       })
  //     );
  // }

  signup(data: User) {
    console.log(data);
    this.http.post(
        'https://travektrail-app-default-rtdb.firebaseio.com/users.json',
        data
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email, password): Observable<LoginUser | User | null> {
    if (email === 'Admin' && password === 'Admin') {
      let username = 'admin';
      let loginTime = new Date().getTime();
      let expiryTime = loginTime + 10 * 60 * 1000;
      let user: LoginUser = { username: username, id: '', loginTime: loginTime};
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/admin/UsersTrips']);
      return of(user);
    }
    return this.sharedservice.getAllUsers().pipe(
      map((allUsers: User[]) => {
        // console.log(allUsers);
        const foundUser = allUsers.find((user) => {
          // console.log(user);
          return user.email === email && user.password === password;
        });
        console.log(foundUser);
        if (foundUser) {
          const loginTime = new Date().getTime();
          const expiryTime = loginTime + 10 * 60 * 1000;
          let user = { username: foundUser.username, id: foundUser.id, loginTime: loginTime };
          localStorage.setItem('user', JSON.stringify(user));
          // alert('User login successfully');
          this.loggedInUser.next(foundUser);
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
        alert('An error occurred during login. Please try again.'); // Generic error
        return of(null);
      })
    );
  }

  isloggedIn(): boolean | string {
    const userString = localStorage.getItem('user');
    if (!userString) {
      return false;
    }
    const user = JSON.parse(userString);
    // return new Date().getTime() < user.loginTime;
    return user.username;
  }

  logout() {
    let user = localStorage.getItem('user');
    if (user) {
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login']);
  }

  autoLogin() {}
  autoLogout(expiryTime: number) {
    setTimeout(() => {
      this.logout();
    }, expiryTime);
  }

  // private handleError(err) {
  //   let errorMessage = 'An unknown error has occured!';
  //   console.log(err);
  //   if (!err.error || !err.error.error) {
  //     return throwError(() => errorMessage);
  //   }
  //   switch (err.error.error.message) {
  //     case 'EMAIL_EXISTS':
  //       errorMessage = 'This email already exists.';
  //       break;
  //     case 'OPERATION_NOT_ALLOWED':
  //       errorMessage = 'This operation is not allowed.';
  //       break;
  //     case 'INVALID_LOGIN_CREDENTIALS':
  //       errorMessage = 'The email ID or Password is not correct.';
  //       break;
  //   }
  //   return throwError(() => errorMessage);
  // }
}
