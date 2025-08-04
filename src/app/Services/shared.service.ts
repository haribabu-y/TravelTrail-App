import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, Subject, throwError } from "rxjs";
import { User } from "../Models/user";

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    http: HttpClient = inject(HttpClient);
    isDarkMode = new Subject<boolean>();
    userExpense = new Subject<number>;

    public getAllUsers(idToken?: string): Observable<User[]> {
        return this.http.get<User[]>('https://travektrail-app-default-rtdb.firebaseio.com/users.json', {params: new HttpParams().set('auth', idToken)})
          .pipe(map((response) => {
              // console.log(response);
              let users = [];
              for (let key in response) {
                if (response.hasOwnProperty(key)) {
                  users.push({ ...response[key], id: key });
                }
              }
              // console.log(users);
              return users;
            }),
            catchError((err) => {
              return throwError(() => err);
            })
          );
      }

    //   userTrips: Trip[];
    getUserExpense(expense: number) {
        this.userExpense.next(expense);
    }

    emitThemevalue(value: boolean) {
      this.isDarkMode.next(value);
      // console.log(value);
    }
}