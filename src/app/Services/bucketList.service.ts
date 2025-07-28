import { inject, Injectable } from "@angular/core";
import { LoginUser } from "../Models/loginUser";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { BucketList } from "../Models/bucketList";

@Injectable({
    providedIn: 'root'
})
export class BucketListService {
    currentUser: LoginUser;
    http: HttpClient = inject(HttpClient);
    getAllBucketLists(id?: string) {
        if(id) {
            return this.http.get(`https://travektrail-app-default-rtdb.firebaseio.com/users/${id}/bucketLists.json`).pipe(map((response) => {
            let bucketLists = [];
            for(let key in response) {
                if(response.hasOwnProperty(key)) {
                    bucketLists.push({...response[key], id: key})
                }
            }
            // console.log(bucketLists);
            return bucketLists;            
        }))
        }
        this.currentUser = JSON.parse(localStorage.getItem('user'));
        // console.log(this.currentUser);
        return this.http.get(`https://travektrail-app-default-rtdb.firebaseio.com/users/${this.currentUser.id}/bucketLists.json`).pipe(map((response) => {
            let bucketLists = [];
            for(let key in response) {
                if(response.hasOwnProperty(key)) {
                    bucketLists.push({...response[key], id: key})
                }
            }
            // console.log(bucketLists);
            return bucketLists;            
        }))
    }

    addNewBucketListitem(data: BucketList) {
        return this.http.post(`https://travektrail-app-default-rtdb.firebaseio.com/users/${this.currentUser.id}/bucketLists.json`, data)
    }

    deleteUserbucketItem(id: string,userid?: string) {
        if(userid) {
            return this.http.delete(`https://travektrail-app-default-rtdb.firebaseio.com/users/${userid}/bucketLists/${id}.json`)
        }
        return this.http.delete(`https://travektrail-app-default-rtdb.firebaseio.com/users/${this.currentUser.id}/bucketLists/${id}.json`)
    }

    updateUserBucketItem(id: string, data: BucketList, userId?: string) {
        if(userId) {
            return this.http.put(`https://travektrail-app-default-rtdb.firebaseio.com/users/${userId}/bucketLists/${id}.json`,data)
        }
        return this.http.put(`https://travektrail-app-default-rtdb.firebaseio.com/users/${this.currentUser.id}/bucketLists/${id}.json`,data)
    }
}