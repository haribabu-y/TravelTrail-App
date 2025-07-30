import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from '../Services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    profileImage: string = '';
    name: string = ''
    email: string = "";
    address: string = "";

    @ViewChild('userDeatil') profileDetailDiv;

    constructor( private profileService: ProfileService) {
    }

    colorArray: string[] = ['red', 'blue', 'green'];

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user'));
    let userid = user.id;

    let currentUser;
    
   this.profileService.getUser(userid).subscribe((res) => {
    currentUser = res;
    console.log(res);  
    
    this.profileImage = res['profileImage'];
    this.name = res['firstName'] + " " + res['lastName'];
    this.email = res['email'];
    this.address = res['address']; 

    console.log(this.profileDetailDiv);
    
    console.log(document.querySelector('.profileDetailDiv'));
    

   });   
    
  }
}
