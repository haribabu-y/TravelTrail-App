import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, Subject, throwError } from "rxjs";
import { User } from "../Models/user";
import { Trip } from "../Models/trip";

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    http: HttpClient = inject(HttpClient);

    public getAllUsers(): Observable<User[]> {
        return this.http
          .get<User[]>(
            'https://travektrail-app-default-rtdb.firebaseio.com/users.json'
          )
          .pipe(
            map((response) => {
              // console.log(response);
              let users = [];
              for (let key in response) {
                if (response.hasOwnProperty(key)) {
                  users.push({ ...response[key], id: key });
                }
              }
              console.log(users);
              return users;
            }),
            catchError((err) => {
              return throwError(() => err);
            })
          );
      }

    //   userTrips: Trip[];
    userExpense = new Subject<number>;

    getUserExpense(expense: number) {
        this.userExpense.next(expense);
    }
}