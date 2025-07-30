import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUser(userid: string) {
    return this.http.get(`https://travektrail-app-default-rtdb.firebaseio.com/users/${userid}.json`);
  }
}
