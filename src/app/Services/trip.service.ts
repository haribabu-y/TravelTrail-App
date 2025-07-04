import { inject, Injectable, OnInit } from "@angular/core";
import { Authservice } from "./auth.service";
import { User } from "../Models/user";
import { HttpClient } from "@angular/common/http";
import { Trip } from "../Models/trip";
import { map, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TripService {
    authService: Authservice = inject(Authservice);
    currentUser: User;
    userTrips: Subject<Trip[]>;
    http: HttpClient = inject(HttpClient);
    
    getAllTrips(id?: string) {
        if(id) {
          return this.http.get(`https://travektrail-app-default-rtdb.firebaseio.com/users/${id}/trips.json`).pipe(map((response) => {
        //   console.log(response);
          let trips = [];
          for (let key in response) {
            if (response.hasOwnProperty(key)) {
              trips.push({ ...response[key], id: key });
            }
          }
          console.log(trips);
          return trips;
        }))
        }
        this.currentUser = JSON.parse(localStorage.getItem('user'));
        console.log(this.currentUser);
        return this.http.get(`https://travektrail-app-default-rtdb.firebaseio.com/users/${this.currentUser.id}/trips.json`).pipe(map((response) => {
        //   console.log(response);
          let trips = [];
          for (let key in response) {
            if (response.hasOwnProperty(key)) {
              trips.push({ ...response[key], id: key });
            }
          }
          console.log(trips);
          return trips;
        }))
        // .subscribe((res) => {
        //     console.log(res);  
        //     this.userTrips.next(res)          
        // })        
    }

    addNewtrip(trip: Trip) {
        return this.http.post(`https://travektrail-app-default-rtdb.firebaseio.com/users/${this.currentUser.id}/trips.json`, trip)
    }

    getCurrentUser(): User {
        this.authService.loggedInUser.subscribe((user: User) => {
            console.log(user);
            this.currentUser = user;
        });
        console.log(this.currentUser); 
        return this.currentUser;       
    }
}