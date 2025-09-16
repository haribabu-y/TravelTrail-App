import { inject, Injectable } from "@angular/core";
import { SharedService } from "./shared.service";
import { map } from "rxjs";
import { UserTrips } from "../Models/usertrips";
import { UserDetail } from "../Models/userDetail";
import { countries } from "../constants/countries";
import { exchangeRates } from "../constants/countries";

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    
    constructor(private sharedService: SharedService) {}

    userTrips: UserTrips[] = [];

    getUsersTrips() {
      let currencyCode = JSON.parse(localStorage.getItem('user')).country.currencyCode;
        return this.sharedService.getAllUsers().pipe(map((users) => {
            // console.log(users);
            for(let user of users) {
                // console.log(user);
                let username: string = user.firstName + ' ' + (user.lastName ? user.lastName : '');
                let gender: string = user.gender;
                let age: number = new Date().getFullYear() - new Date(user.dob).getFullYear();
                let id: string = user.id;
                let countryObj = countries.find((country) => {
                  return country.code === user.country;
                });
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
                let adminCurrencyCode = currencyCode;
                let userCurrencyCode= countryObj['currencyCode'];
                let userTotalExpense: number = this.convertExpenseToAdminCurrency(totalExpense,adminCurrencyCode,userCurrencyCode);

                let userDetail = new UserTrips(username, totalDistance, gender, age, userTotalExpense, id);
                // console.log(userDetail);
                this.userTrips.push(userDetail);                
            }
            return this.userTrips;
        }))
    }

    allUsers: UserDetail[];

    getAllUserDetails() {
        let currencyCode = JSON.parse(localStorage.getItem('user')).country['currencyCode'];
        let allUsers: UserDetail[] = [];
        return this.sharedService.getAllUsers().pipe(map((users) => {
          for(let user of users) {
            // console.log(user);
            let userimage: string = user.profileImage ? user.profileImage : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName ? user.lastName : ''}&bold=true`;
            let username: string = user.firstName + ' ' + (user.lastName ? user.lastName : '');
            let id: string = user.id;
            let age: number = new Date().getFullYear() - new Date(user.dob).getFullYear();
            // console.log(user.country);        
            let countryObj = countries.find((country) => {
              return country.code === user.country;
            });
            // console.log(countryObj);        
            let country = Object.values(countryObj)[0];
            // console.log(country);        
            let totalExpense: number = 0;
            if (user.trips) {
              Object.keys(user.trips).forEach((key) => {
                // console.log(user.trips[key]);
                totalExpense += user.trips[key].totalExpense;
              });
            }
            let adminCurrencyCode = currencyCode;
            let userCurrencyCode= countryObj['currencyCode']; 
            // console.log(adminCurrencyCode);
            // console.log(userCurrencyCode); 
            
            let userTotalExpense: number = this.convertExpenseToAdminCurrency(totalExpense,adminCurrencyCode,userCurrencyCode)
            // console.log(userTotalExpense);        
            let userDetail = new UserDetail(id, username, userimage, age, country, userTotalExpense);
            allUsers.push(userDetail);   
          }
          // console.log(this.users);
          return allUsers;
        }));
      }

    convertExpenseToAdminCurrency(amount: number, adminCurrencyCode: string, usercurrencycode: string): number | null {
          // console.log(adminCurrencyCode);
          // console.log(usercurrencycode);      
        const rateToINRUser = exchangeRates[usercurrencycode];
        const reteToINRAdmin = exchangeRates[adminCurrencyCode];
        if(!rateToINRUser || !reteToINRAdmin) {
          // alert("Invalid currency codes or missing exchange rates");
          return null;
        }
        //converting thr user amount to INR
        const userAmountInINR = amount / rateToINRUser;
        // console.log(userAmountInINR);
        //converting the user INR amount to admin currency
        const amountInAdminCurrency = userAmountInINR * reteToINRAdmin;
        // console.log(amountInAdminCurrency);
    
        return parseFloat(amountInAdminCurrency.toFixed(2));        
      }
}