import { inject, Injectable } from "@angular/core";
import { SharedService } from "./shared.service";
import { map } from "rxjs";
import { UserTrips } from "../Models/usertrips";

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    sharedService: SharedService = inject(SharedService);

    userTrips: UserTrips[] = [];

    getUsersTrips() {
        return this.sharedService.getAllUsers().pipe(map((users) => {
            // console.log(users);
            for(let user of users) {
                // console.log(user);
                let username: string = user.firstName + ' ' + user.lastName;
                let gender: string = user.gender;
                let age: number = new Date().getFullYear() - new Date(user.dob).getFullYear();
                let id: string = user.id;
                let totalDistance: number = 0;
                let totalExpense: number = 0;
                // console.log(user.trips);
                if(user.trips) {
                    Object.keys(user.trips).forEach(key => {
                        // console.log(user.trips[key]);
                        totalDistance += user.trips[key].totalDistance;
                        totalExpense += user.trips[key].totalExpense;                    
                 }) 
                }
                // console.log(totalDistance);
                // console.log(totalExpense);
                let userDetail = new UserTrips(username, totalDistance, gender, age, totalExpense, id);
                // console.log(userDetail);
                this.userTrips.push(userDetail);                
            }
            return this.userTrips;
        }))
    }
}