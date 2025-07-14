import { AfterViewChecked, Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Authservice } from '../Services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { User } from '../Models/user';
import { SharedService } from '../Services/shared.service';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  darkMode: boolean = false;
  isDarkMode: boolean = false;
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
  username: string = '';
  ngOnInit(): void {
    let theme: string = localStorage.getItem('theme');
    let currentUrl = this.router.url;
    const body = document.body;
    if(theme === 'dark') {
      body.classList.add('dark-mode');
      this.isDarkMode = true;
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
    console.log(localuser);    
    if(localuser.username === 'admin' || localuser.isAdmin) {
      this.usertype === 'admin';
      this.isAdmin = true;
      console.log(currentUrl);   
      // this.router.navigate(['/admin/UsersTrips']);
      if(localuser.isAdmin && localuser.username != 'admin') {
        this.sharedService.getAllUsers().subscribe({
      next: (allUsers) => {
        this.currentUser = allUsers.find((user) => {
          return user.username === localuser.username;
        })
        // console.log(this.currentUser);  
        if(this.currentUser) {
          this.username = this.currentUser.username;
        if(this.currentUser.profileImage) {
          this.profileImage = this.currentUser.profileImage;
        } else {
          let firstName = this.currentUser.firstName;
          let lastName = this.currentUser.lastName;
          this.profileImage = `https://ui-avatars.com/api/?name=${firstName}+${lastName ? lastName : ''}&bold=true`
        }
        }        
      }
    });
      } else {
        this.profileImage = `https://ui-avatars.com/api/?name=Admin&bold=true`;
      }     
      this.username = localuser.username;
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
        this.username = this.currentUser.username;
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

  isMobileView: boolean = false;
  screenWidth: number = window.innerWidth;
  showProfileInfo: boolean = false;

  @ViewChild('menuBar') menubar: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    console.log(target);
    if(this.showProfileInfo) {
      let clickedInsideListBox = this.menubar.nativeElement.contains(target);
    if(!clickedInsideListBox) {
      this.showProfileInfo = false;
    }
    }
    
  }


  showProfileDetail() {
    this.showProfileInfo = !this.showProfileInfo;
  }
}
