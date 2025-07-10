import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Authservice } from '../Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../Models/user';
import { SharedService } from '../Services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  darkMode: boolean = false;
  router: Router = inject(Router);
  activeRoute: ActivatedRoute = inject(ActivatedRoute)
  authService: Authservice = inject(Authservice);
  sharedService: SharedService = inject(SharedService)
  usertype: string;
  isAdmin: boolean = false;
  userExpense: number;

  currentPage: string = this.router.url.split('/')[2];
  ngDoCheck() {
    this.currentPage = this.router.url.split('/')[2];
  }  

  toggleDarkMode() {
    this.darkMode = !this.darkMode;

    const body = document.body;
    let mode: string = this.darkMode ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
    if(this.darkMode) {
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
  ngOnInit(): void {
    let theme: string = localStorage.getItem('theme');
    const body = document.body;
    if(theme === 'dark') {
      body.classList.add('dark-mode');
      this.darkMode = true;
    } else {
      body.classList.remove('dark-mode');
      this.darkMode = false;
    }

    this.sharedService.userExpense.subscribe((res) => {
      console.log(res);   
      this.userExpense = res; 
    })

    let localuser = JSON.parse(localStorage.getItem('user'));
    if(localuser.username === 'admin' || localuser.isAdmin) {
      this.usertype === 'admin';
      this.isAdmin = true;
      this.router.navigate(['/admin/UsersTrips']);
      this.profileImage = `https://ui-avatars.com/api/?name=Admin&bold=true`;
      return;
    } else {
      this.usertype = localuser.username;
    }
    console.log(localuser);
    this.sharedService.getAllUsers().subscribe({
      next: (allUsers) => {
        this.currentUser = allUsers.find((user) => {
          return user.username === localuser.username;
        })
        // console.log(this.currentUser);  
        if(this.currentUser.profileImage) {
          this.profileImage = this.currentUser.profileImage;
        } else {
          let firstName = this.currentUser.firstName;
          let lastName = this.currentUser.lastName;
          this.profileImage = `https://ui-avatars.com/api/?name=${firstName}+${lastName ? lastName : ''}&bold=true`
        }
      }
    });
  };
}
