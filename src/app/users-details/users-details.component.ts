import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { SharedService } from '../Services/shared.service';
import { UserDetail } from '../Models/userDetail';
import { BucketListService } from '../Services/bucketList.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../Models/user';
import { Authservice } from '../Services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { MultiSelect } from 'primeng/multiselect';
import { countries } from '../constants/countries';
import { states } from '../constants/countries';
import { timezones } from '../constants/countries';
import { locales } from '../constants/countries';
import { phoneCodes } from '../constants/countries';
import { secretKey } from '../constants/countries';
import { currencyFormate } from '../constants/countries';
import { exchangeRates } from '../constants/countries';
import { exchangeRatesToINR } from '../constants/countries';
import * as CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs';
import { AdminService } from '../Services/admin.service';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css']
})
export class UsersDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private sharedService: SharedService,
    private messageService: MessageService,
    private http: HttpClient,
    private authService: Authservice,
    private adminService: AdminService,
    private renderer: Renderer2
  ) {}
  
  @ViewChild('usersDetailTable') usersDetailTable: Table;
  users: UserDetail[] = [];
  isDarkMode: boolean = false;
  darkThemeSubscription: Subscription;
  loadTableObservableSubscription: Subscription;
  currencyCode: string;
  oldCurrencyCode: string;
  isLoading: boolean = false;

  countries = countries;
  states = states;
  timeZones = timezones;
  locales = locales;
  phoneCode = phoneCodes;
  currencyFormate = currencyFormate;

  enteredText: string = '';

  ngOnInit(): void {
    
    // this.getAllUserDetails();
    let allUsers = JSON.parse(localStorage.getItem('allUsers'));
    if(allUsers) {
      this.users = allUsers
    } else {
      this.loadUserdetailsInTable();
    }

    this.selectedColumns = [...this.columnOptions];
    
    this.addUserForm1 = new FormGroup({
        profileImage: new FormControl(null),
        username: new FormControl(null, [Validators.required, Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9]+$/)]),
        firstName: new FormControl(null, [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 ]+$/)]),
        lastName: new FormControl(null, [Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 ]+$/)]),
        gender: new FormControl('Male', Validators.required),
        dob: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(100)]),
        countryCode: new FormControl(null, Validators.required),
        phone: new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)]),
        address: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
        country: new FormControl(null, Validators.required),
        state: new FormControl(null),
        zipCode: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
        timeZone: new FormControl(null, Validators.required),
        locale: new FormControl(null),
        isAdmin: new FormControl(false),
        password: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
    })

    this.darkThemeSubscription = this.sharedService.isDarkMode.subscribe((res) => this.isDarkMode = res);
    localStorage.getItem('theme') === 'dark' ? this.isDarkMode = true : this.isDarkMode = false;

    this.currencyCode = JSON.parse(localStorage.getItem('user')).country['currencyCode'];
    this.oldCurrencyCode = JSON.parse(localStorage.getItem('user')).country['currencyCode'];

    this.loadTableObservableSubscription = this.authService.loadTableObservable.subscribe((res) => {
      console.log(res);
      this.loadUserdetailsInTable();
    })
  }

  loadUserdetailsInTable() {
    this.isLoading = true;
    this.adminService.getAllUserDetails().subscribe({
      next: (users) => {
        // console.log(users);
        this.users = users;
        localStorage.setItem("allUsers", JSON.stringify(users));
        this.isLoading = false;     
      },
      error: (error) => {
        let errorMessage: string = "An error occered while fetching the Users!";
        this.messageService.add({severity:'error', summary:'Error', detail: errorMessage});
      }
    })
  }

  // getAllUserDetails() {
  //   this.isLoading = true;
  //   let allUsers: UserDetail[] = [];
  //   this.sharedService.getAllUsers().subscribe((users) => {
  //     for(let user of users) {
  //       // console.log(user);
  //       let userimage: string = user.profileImage ? user.profileImage : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName ? user.lastName : ''}&bold=true`;
  //       let username: string = user.firstName + ' ' + (user.lastName ? user.lastName : '');
  //       let id: string = user.id;
  //       let age: number = new Date().getFullYear() - new Date(user.dob).getFullYear();
  //       // console.log(user.country);        
  //       let countryObj = this.countries.find((country) => {
  //         return country.code === user.country;
  //       });
  //       // console.log(countryObj);        
  //       let country = Object.values(countryObj)[0];
  //       // console.log(country);        
  //       let totalExpense: number = 0;
  //       if (user.trips) {
  //         Object.keys(user.trips).forEach((key) => {
  //           // console.log(user.trips[key]);
  //           totalExpense += user.trips[key].totalExpense;
  //         });
  //       }
  //       let adminCurrencyCode = this.currencyCode;
  //       let userCurrencyCode= countryObj['currencyCode']; 
  //       // console.log(adminCurrencyCode);
  //       // console.log(userCurrencyCode); 
        
  //       let userTotalExpense: number = this.convertExpenseToAdminCurrency(totalExpense,adminCurrencyCode,userCurrencyCode)
  //       // console.log(userTotalExpense);        
  //       let userDetail = new UserDetail(id, username, userimage, age, country, userTotalExpense);
  //       allUsers.push(userDetail);   
  //     }
  //     // console.log(this.users);
  //     this.users = allUsers;
  //     this.isLoading = false;
  //   });
  // }

  selectedCurrency: any;
  usercurrencySymbol: string;
  
  currencyFormateChanged() {
    // this.oldCurrencyCode = this.currencyCode;
    this.currencyCode = this.selectedCurrency.code;
    this.usercurrencySymbol = this.selectedCurrency.symbol;

    this.users.forEach((user) => {
      user.totalExpense = this.convertAmount(user.totalExpense);
    })
    this.oldCurrencyCode = this.selectedCurrency.code;
    
  }

  convertAmount(baseAmount?: number): number {
    if (this.selectedCurrency && exchangeRates[this.selectedCurrency.code]) {
      // console.log(this.oldCurrencyCode);      
      // console.log(this.selectedCurrency.code);      
      const rate = exchangeRates[this.selectedCurrency.code];
      // console.log(rate);
      // console.log(baseAmount);
      // console.log(this.convertExpenseToselectedCurrency(baseAmount,this.oldCurrencyCode,this.selectedCurrency.code));      
      // return baseAmount * rate;
      return this.convertExpenseToselectedCurrency(baseAmount,this.oldCurrencyCode,this.selectedCurrency.code);
    }
    return baseAmount;
  }

  //   convertExpenseToAdminCurrency(amount: number, adminCurrencyCode: string, usercurrencycode: string): number | null {
  //     // console.log(adminCurrencyCode);
  //     // console.log(usercurrencycode);      
  //   const rateToINRUser = exchangeRates[usercurrencycode];
  //   const reteToINRAdmin = exchangeRates[adminCurrencyCode];
  //   if(!rateToINRUser || !reteToINRAdmin) {
  //     // alert("Invalid currency codes or missing exchange rates");
  //     return null;
  //   }
  //   //converting thr user amount to INR
  //   const userAmountInINR = amount / rateToINRUser;
  //   // console.log(userAmountInINR);
  //   //converting the user INR amount to admin currency
  //   const amountInAdminCurrency = userAmountInINR * reteToINRAdmin;
  //   // console.log(amountInAdminCurrency);

  //   return parseFloat(amountInAdminCurrency.toFixed(2));        
  // }

  convertExpenseToselectedCurrency(amount: number, sourceCurrencyCode: string, resultcurrencyCode: string) {
    
    // this.oldCurrencyCode = resultcurrencyCode;
    let amountToINR: number = amount * exchangeRatesToINR[sourceCurrencyCode];
    // console.log(amountToINR);
    const convertedAmount = amountToINR / exchangeRatesToINR[resultcurrencyCode];
    // console.log(convertedAmount);    
    return convertedAmount;
  }

  filterGlobal(text: string) {
    // console.log(this.usersDetailTable);    
    return this.usersDetailTable.filterGlobal(text, 'contains');
  }
  
  reloadAll(text: string) {
    if(text === '') {
      this.filterGlobal(text);
    }
  }

  handleFilter(event) {
    // console.log(JSON.stringify(event.filters).length == 2); 
    if(JSON.stringify(event.filters).length == 2) {
      let allFields = document.querySelectorAll('.tableField');
      let fields = document.querySelectorAll('.highlightField');
      console.log(fields);
      fields.forEach((field) => {
        console.log(field);        
        this.renderer.removeAttribute(field,'highlightsearchtext');
      })    
      console.log(fields);          
      return;
    }   

    setTimeout(() => {
      // let element = document.querySelectorAll('[highlightSearchText]');
      // console.log(element);
      let tableBodyDom = document.querySelector('.p-datatable-tbody')
      // console.log(tableBodyDom);
      let allFields = tableBodyDom.querySelectorAll('.tableField');
      // console.log(allFields);    
      // console.log(event);    
      let searchText = event.filters.global.value;
      console.log(searchText);  
      allFields.forEach((field) => {
        let fieldText =  field.innerHTML.replace(/[^\w\s]/g, '')
        console.log(field.innerHTML.includes(searchText));      
        if(fieldText.toLowerCase().includes(searchText.toLowerCase())) {
          // (field as HTMLElement).style.backgroundColor = 'lightblue'
          field.setAttribute('highlightSearchText', searchText);
        }
      })
    },0);
  }

  @ViewChild('rowSelect') rowSelect;
  numOfRows: number = 10;
  showRowsChange: boolean = false;
  rowOptions = [
    { label: 'Show 10', value: 10},
    { label: 'Show 15', value: 15},
    { label: 'Show 20', value: 20},
  ]

  changeRows() {
    this.showRowsChange = !this.showRowsChange;
  }
  closeListbox() {
    this.showRowsChange = false;
  }
  
  @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if(this.showRowsChange) {
        let clickedInsideListBox = this.rowSelect.nativeElement.contains(target);
      if(!clickedInsideListBox) {
        this.showRowsChange = false;
      }
      }
    }

  @ViewChild('columnSelect') columnSelect: MultiSelect;
  @ViewChild('columnMultiSelect') columnMultiSelect: MultiSelect;
  shoeColumnsDisplay: boolean = false;
  selectedColumns: any[] = [];

  columnOptions =[
    {label: 'User Name', value:'username'},
    {label:'Age', value: 'age'},
    {label:'Total Expense', value: 'totalExpense'},
    {label:'Country', value: 'country'},
  ]

  showCloumnList() {
    this.columnMultiSelect.show();
    // this.shoeColumnsDisplay = !this.shoeColumnsDisplay
  }

  columnsChanged() {
    // console.log(event);    
    this.columnMultiSelect.show();
    // console.log(this.selectedColumns);
    // this.shoeColumnsDisplay = false;
  }

// code for adding and updating the new user to the application
  showAddOrUpdateDailog: boolean = false;
  addUserForm1: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  profileImage: string = 'assets/users/defaultProfileImg.jpg';

  openNew() {
    // this.selectedGender = 'male';
    this.addUserForm1.get('username').enable();
    this.addUserForm1.get('password').enable();
    this.addUserForm1.get('email').enable();
    this.showAddOrUpdateDailog = true;
  }

  triggerFileinput() {
    this.fileInput.nativeElement.click();
  }

  onFilechanges(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files[0];

    if (!file) return;

    const maxInputSize = 2;
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG and PNG formats are allowed.');
      input.value = '';
      return;
    }

    if (file.size > maxInputSize * 1024 * 1024) {
      alert('File size must be 2MB.');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.profileImage = reader.result as string;
      // console.log(reader.result as string);  
      this.addUserForm1.patchValue({ profileImage: reader.result as string});    
    };
    
  }

  selectedGender: string = 'male';

  changeGender(value: string) {
    this.selectedGender = value;
  }

  filteredstates: any[] = [];
  // secretKey: string = 'TravelTrail';

  onCountryChanges(country: any) {
    this.filteredstates = this.states[country.code] || [];
  }

  addOrUpdateUser(id?: string) {
    console.log(this.addUserForm1);  
    if(this.addUserForm1.invalid){
      let formControls = this.addUserForm1.controls;
      let errorMessage = ''
      for(let formField in formControls) {
        // console.log(formField);  
        if(formControls[formField].status === "INVALID") {
          errorMessage = formField + " field is INVALID!.";
        }      
      }    
      this.messageService.add({severity: 'error', summary:'Error', detail: errorMessage});
      this.addUserForm1.markAllAsTouched();
      return;
    }
    if(id) {
      // let password = this.addUserForm1.value.password;
      // let encryptedPassword = CryptoJS.AES.encrypt(password, this.secretKey).toString();
      // console.log(encryptedPassword);
      // this.addUserForm1.patchValue({password: encryptedPassword});
      // console.log(this.addUserForm1);
      let country = (this.addUserForm1.controls['country']).value.code;
    // console.log(country);
    this.addUserForm1.patchValue({country: country});
    // console.log(this.addUserForm1.controls['state'] !== null);
    if(this.addUserForm1.controls['state'].value !== null) {
      let state = this.addUserForm1.controls['state'].value.code;
      this.addUserForm1.patchValue({state: state});
    }  
      let userToUpdate: User = this.addUserForm1.value;
      this.http.patch(`https://travektrail-app-default-rtdb.firebaseio.com/users/${id}.json`, userToUpdate).subscribe((res) => {
        // console.log(res);       
        this.userToEditId = ''; 
        this.messageService.add({severity:'success', summary:'Success', detail:'User Successfully Updated!.'})
        this.showAddOrUpdateDailog = false;
        // this.getAllUserDetails();
        this.loadUserdetailsInTable();
      });
      return;
    } 
    // console.log(this.addUserForm1);
    // console.log(this.addUserForm1.value);
    let password = this.addUserForm1.value.password;
    let encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
    // console.log(encryptedPassword);
    this.addUserForm1.patchValue({password: encryptedPassword});
    let country = (this.addUserForm1.controls['country']).value.code;
    // console.log(country);
    this.addUserForm1.patchValue({country: country});
    // console.log(this.addUserForm1.controls['state'] !== null);
    if(this.addUserForm1.controls['state'].value !== null) {
      let state = this.addUserForm1.controls['state'].value.code;
      this.addUserForm1.patchValue({state: state});
    }
    let newUser: User = this.addUserForm1.value;
    // console.log(newUser);
    // return;  
    this.sharedService.getAllUsers().subscribe({
      next: (users) => {
        let isUserExit = users.find((user) => {
          return (user.username === newUser.username || user.email === newUser.email);
        });
        if(isUserExit) {
          // console.log(isUserExit);          
          // alert("User already exits");
          this.messageService.add({severity:'error', summary:'Error',detail:'User already exits!.'})
          return;
        }
        
        this.authService.signup(newUser.email, password, newUser, true);
        this.addUserForm1.reset(); 
        this.messageService.add({severity:'success', summary:'Success', detail:'UserSuccessFully Added!.'})
        this.profileImage = 'assets/users/defaultProfileImg.jpg';
        this.showAddOrUpdateDailog = false;
        // this.getAllUserDetails();

      //   this.http.post('https://travektrail-app-default-rtdb.firebaseio.com/users.json', newUser)
      // .subscribe((response) => {
      //   // console.log(response);
      //   // console.log(newUser);  
      //   this.addUserForm1.reset(); 
      //   this.messageService.add({severity:'success', summary:'Success', detail:'UserSuccessFully Added!.'})
      //   this.profileImage = 'assets/users/defaultProfileImg.jpg';
      //   this.showAddOrUpdateDailog = false;
      //   this.getAllUserDetails();
      // });
        
      }
    })
  }
  closeDailog() {
    // console.log(this.addUserForm1);    
    this.showAddOrUpdateDailog = false;
    this.addUserForm1.reset();
    this.userToEditId = ''
    this.profileImage = 'assets/users/defaultProfileImg.jpg';

  }
  userToEdit: User;
  userToEditId: string;
  statesForEdit: any;
  openEditDialog(userId: string) {
    // console.log(userId);
    this.userToEditId = userId;
    this.showAddOrUpdateDailog = true;
    if(userId) {
      this.addUserForm1.get('username').disable();
      this.addUserForm1.get('password').disable();
      this.addUserForm1.get('email').disable();
    }
    this.http.get(`https://travektrail-app-default-rtdb.firebaseio.com/users/${userId}.json`).subscribe((user: User) => {
      this.userToEdit = user;
      // console.log(this.userToEdit);
      this.selectedGender = user.gender.toLocaleLowerCase();
      this.filteredstates = this.states[user.country] || [];
      // console.log(this.statesForEdit);      
      this.profileImage = user.profileImage ? user.profileImage : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName ? user.lastName : ''}&bold=true`;
      this.addUserForm1.patchValue(this.userToEdit);
      // console.log(this.addUserForm1);      
      this.addUserForm1.patchValue({profileImage: this.profileImage});
      // console.log(this.addUserForm1);
      let countryObj = countries.find((country) => {
        return country.code === this.userToEdit.country;
      })
      this.addUserForm1.patchValue({country: countryObj})
      let encryptedPassword = user.password;
      // console.log(encryptedPassword);          
      let code = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
      let decryptedPassword = code.toString(CryptoJS.enc.Utf8);
      this.addUserForm1.patchValue({password: decryptedPassword});
      // console.log(this.addUserForm1.controls['country']);      
      if(this.addUserForm1.controls['country']) {
        this.filteredstates = this.states[countryObj.code] || [];
      }
      this.addUserForm1.patchValue({state: this.filteredstates.find((state) => state.code === this.userToEdit.state)})
      // console.log(this.addUserForm1);
    })
  }
  showDeleteUserdailog: boolean = false;
  userId: string = '';

  showDeleteUser(id: string) {
    // console.log(id); 
    this.userId = id;
    if(id === JSON.parse(localStorage.getItem('user')).id) {
      this.messageService.add({severity:'warn', summary:'Warn', detail:"Admin can't delete himself!."});
      return;
    }
    this.showDeleteUserdailog = true;
  }

  deleteUser() {
    // console.log(this.userId);  
    this.http.get(`https://travektrail-app-default-rtdb.firebaseio.com/users/${this.userId}.json`).subscribe((res) => {
      // console.log(res);
      let email = res['email'];
      let encryptedPassword = res['password'];
      let code = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
      let decryptedPassword = code.toString(CryptoJS.enc.Utf8);
      this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA0CxBGkhNtT1q48ZjBhu4aFn1FsQgYoxs', {email: email, password: decryptedPassword, returnSecureToken: true}).subscribe((res) => {
        // console.log(res);
        // console.log(res['idToken']); 
        this.deleteAuthUser(res['idToken']);            
      })
                  
    }) 
    // this.http.delete(`https://travektrail-app-default-rtdb.firebaseio.com/users/${this.userId}.json`).subscribe((res) => {
    //   this.messageService.add({severity:'success', summary:'Success', detail:`User Successfully Deleted!.`})
    // this.showDeleteUserdailog = false;
    // // this.getAllUserDetails();
    // this.loadUserdetailsInTable();
    // });
  }

  deleteAuthUser(tokenId: string) {
    let idToken = {idToken: tokenId};
    this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyA0CxBGkhNtT1q48ZjBhu4aFn1FsQgYoxs', idToken).subscribe((res) => {
      // console.log(res); 
      this.http.delete(`https://travektrail-app-default-rtdb.firebaseio.com/users/${this.userId}.json`).subscribe((res) => {
        this.messageService.add({severity:'success', summary:'Success', detail:`User Successfully Deleted!.`})
        this.showDeleteUserdailog = false;
        // this.getAllUserDetails();
        this.loadUserdetailsInTable();
      });     
    })
  }

  closeDeleteUserDailog() {
    this.showDeleteUserdailog = false;
  }

  validateDateOfBirth(date: Date) {
    let dob = new Date(date);
    let today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
    }

    if(age < 18) {
      return true;
    } else {
      return false;
    }
  }

  goToPageNumber: number = null;

  onPageChange(event: any) {
    // console.log(event);
    this.numOfRows = event.rows;
  }

  goToPage() {
    if(this.usersDetailTable && this.goToPageNumber > 0) {
      const pageIndex = this.goToPageNumber -1;      
      const firstRowIndex = pageIndex * this.numOfRows;
      if(firstRowIndex >= 0 && firstRowIndex < this.usersDetailTable.value.length) {
        this.usersDetailTable.first = firstRowIndex;
      } else {
        // alert("Invalid page number entered.")
        this.messageService.add({severity:'warn', summary:'Warn', detail:'Invali page number entered!.'})
        // this.goToPageNumber = Math.floor(this.usersDetailTable.first / this.numOfRows) + 1;
      }
    }
  }

  ngOnDestroy(): void {
    if(this.darkThemeSubscription) {
      this.darkThemeSubscription.unsubscribe();
    }
    if(this.loadTableObservableSubscription) {
      this.loadTableObservableSubscription.unsubscribe();
    }
  }
  
}
