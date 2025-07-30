import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Authservice } from '../Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../Models/user';
import { SharedService } from '../Services/shared.service';
import { Subscription } from 'rxjs';
import { countries } from '../constants/countries';
import { states } from '../constants/countries';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  darkMode: boolean = false;
  isDarkMode: boolean = false;
  userExpenseSubscription: Subscription;
  usertype: string;
  isAdmin: boolean = false;
  userExpense: number;
  userDetail: User;
  country: string;
  state: string;

  constructor(
    private router: Router,
    private authService: Authservice,
    private sharedService: SharedService
  ) {}

  currentPage: string = this.router.url.split('/')[2];
  ngDoCheck() {
    this.currentPage = this.router.url.split('/')[2];
  }

  navigateToHome() {
    // console.log(this.isAdmin);
    if (!this.isAdmin) {
      this.router.navigate(['/user/Home'])
    } else {
      this.router.navigate(['/admin/UsersTrips']);
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    const body = document.body;
    let mode: string = this.darkMode ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
    if (this.darkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
    this.sharedService.emitThemevalue(this.darkMode);
  }

  logoutUser() {
    this.authService.logout();
  }

  currentUser: User;
  profileImage: string = 'assets/users/defaultProfileImg.jpg'
  username: string = '';
  currencyCode: string = '';
  ngOnInit(): void {
    let theme: string = localStorage.getItem('theme');
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      this.isDarkMode = true;
      this.darkMode = true;
    } else {
      body.classList.remove('dark-mode');
      this.darkMode = false;
    }

    this.userExpenseSubscription = this.sharedService.userExpense.subscribe((res) => {
      // console.log(res);
      this.userExpense = res;
    })

    let localuser = JSON.parse(localStorage.getItem('user'));
    // console.log(localuser);
    if(!localuser) {
      return;
    }
    if (localuser.isAdmin) {
      this.usertype === 'admin';
      this.isAdmin = true;
      this.router.navigate(['/admin/UsersTrips']);
      this.sharedService.getAllUsers().subscribe({
          next: (allUsers) => {
            this.currentUser = allUsers.find((user) => {
              return user.username === localuser.username;
            })
            // console.log(this.currentUser);  
            if (this.currentUser) {
              this.userDetail = this.currentUser;
              this.username = this.currentUser.username;
              let countryObj = countries.find((country) => {
                return country.code === this.currentUser.country;
              });
              // console.log(countryObj);                      
              this.country = countryObj.name;              
              let filteredState = states[countryObj.code] || [];
              if(this.currentUser.state) {
                this.state = filteredState.find((state) => state.code === this.currentUser.state).name;
              }              
              this.currencyCode = countryObj['currencyCode'];
              if (this.currentUser.profileImage) {
                this.profileImage = this.currentUser.profileImage;
              } else {
                let firstName = this.currentUser.firstName;
                let lastName = this.currentUser.lastName;
                this.profileImage = `https://ui-avatars.com/api/?name=${firstName}+${lastName ? lastName : ''}&bold=true`
              }
            }
          }
        });
      this.username = localuser.username;
      return;
    } else {
      this.usertype = localuser.username;
      // console.log(localuser);
      // this.router.navigate(['/user/Home'])
      this.sharedService.getAllUsers().subscribe({
        next: (allUsers) => {
          this.currentUser = allUsers.find((user) => {
            return user.username === localuser.username;
          })
          this.username = this.currentUser.username;
          let countryObj = countries.find((country) => {
            return country.code === this.currentUser.country;
          });
          // console.log(countryObj);        
          this.country = countryObj.name;
          let filteredState = states[countryObj.code] || [];
          if(this.currentUser.state) {
            this.state = filteredState.find((state) => state.code === this.currentUser.state).name;
          }        
          this.currencyCode = countryObj['currencyCode'];
          this.userDetail = this.currentUser;
          if (this.currentUser.profileImage) {
            this.profileImage = this.currentUser.profileImage;
          } else {
            let firstName = this.currentUser.firstName;
            let lastName = this.currentUser.lastName;
            this.profileImage = `https://ui-avatars.com/api/?name=${firstName}+${lastName ? lastName : ''}&bold=true`
          }
        }
      });
    }  
  };

  showProfileInfo: boolean = false;

  @ViewChild('menuBar') menubar: ElementRef;
  @ViewChild('profileInfo') profileInfo: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.showProfileInfo) {
      let clickedInsideListBox = this.menubar.nativeElement.contains(target);
      let clickInsideProfileInfo = this.profileInfo.nativeElement.contains(target);
      if (!clickedInsideListBox && !clickInsideProfileInfo) {
        this.showProfileInfo = false;
      }
    }
  }

  showProfileDetail() {
    this.showProfileInfo = !this.showProfileInfo;
  }

  ngOnDestroy(): void {
    this.userExpenseSubscription.unsubscribe();
  }
}
