import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ProfileService } from '../Services/profile.service';
import { count } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
    profileImage: string = '';
    name: string = ''
    email: string = "";
    address: string = "";
    dob: Date;
    country:  string;

    @ViewChildren('innerDiv') innerdivs;

    constructor( private profileService: ProfileService) {
    }

    colorArray: string[] = ['red', 'blue', 'green'];

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user'));
    let userid = user.id;

    let currentUser;
    
   this.profileService.getUser(userid).subscribe((res) => {
    currentUser = res;
    // console.log(res);  
    this.profileImage = res['profileImage'];
    this.name = res['firstName'] + " " + res['lastName'];
    this.email = res['email'];
    this.address = res['address'];
    this.dob = res['dob'];
    this.country = user.country.name;
   });   
  }

  ngAfterViewInit(): void {
    // console.log(this.innerdivs);
    // this.innerdivs.forEach((innerDiv: ElementRef, index) => {
    //   console.log(innerDiv);
    //   console.log(index);
    //   let color = index % this.colorArray.length;
    //   console.log(this.colorArray[color]);
    //   // innerDiv.nativeElement.style.backgroundColor = this.colorArray[color];    
    // })

    let allAcc = document.querySelectorAll('.p-accordion-header-link');
    // console.log(allAcc);
    
    allAcc.forEach((ele, index) => {
      let color = index % this.colorArray.length;
      // console.log(ele);
      ele.setAttribute('style', `background-color: ${this.colorArray[color]}; color: white;`);   
    })

  }
}
