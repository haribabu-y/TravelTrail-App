import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
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
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css']
})
export class UsersDetailsComponent implements OnInit {
  
  @ViewChild('usersDetailTable') usersDetailTable: Table;
  sharedService: SharedService = inject(SharedService);
  bucketListService: BucketListService = inject(BucketListService)
  users: UserDetail[] = [];
  isDarkMode: boolean = false;
  currencyCode: string;
  oldCurrencyCode: string;

    countries = countries;
  states = states;
  timeZones = timezones;
  locales = locales;
  phoneCode = phoneCodes;

  ngOnInit(): void {
    
    this.getAllUserDetails();
    this.selectedColumns = [...this.columnOptions]
    
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

    this.sharedService.isDarkMode.subscribe((res) => this.isDarkMode = res);
    localStorage.getItem('theme') === 'dark' ? this.isDarkMode = true : this.isDarkMode = false;

    this.currencyCode = JSON.parse(localStorage.getItem('user')).country['currencyCode'];
    this.oldCurrencyCode = JSON.parse(localStorage.getItem('user')).country['currencyCode'];
  }

  getAllUserDetails() {
    this.isLoading = true;
    let allUsers: UserDetail[] = [];
    this.sharedService.getAllUsers().subscribe((users) => {
      for(let user of users) {
        console.log(user);
        let userimage: string = user.profileImage ? user.profileImage : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName ? user.lastName : ''}&bold=true`;
        let username: string = user.firstName + ' ' + (user.lastName ? user.lastName : '');
        let id: string = user.id;
        let age: number = new Date().getFullYear() - new Date(user.dob).getFullYear();
        console.log(user.country);        
        let countryObj = this.countries.find((country) => {
          return country.code === user.country;
        });
        console.log(countryObj);        
        let country = Object.values(countryObj)[0];
        console.log(country);        
        let totalExpense: number = 0;
        if (user.trips) {
          Object.keys(user.trips).forEach((key) => {
            // console.log(user.trips[key]);
            totalExpense += user.trips[key].totalExpense;
          });
        }
        let adminCurrencyCode = this.currencyCode;
        let userCurrencyCode= countryObj['currencyCode']; 
        console.log(adminCurrencyCode);
        console.log(userCurrencyCode); 
        
        let userTotalExpense: number = this.convertExpenseToAdminCurrency(totalExpense,adminCurrencyCode,userCurrencyCode)
        console.log(userTotalExpense);        
        let userDetail = new UserDetail(id,username, userimage, age, country, userTotalExpense);
        allUsers.push(userDetail);   
      }
      console.log(this.users);
      
      this.users = allUsers;
      
      this.isLoading = false;
    });

  }

  currencyFormate = [
      { name: '₹ Rupees', code: 'INR', symbol: '₹' },
      { name: '$ Dollar', code: 'USD', symbol: '$' },
      { name: '€ Euro', code: 'EUR', symbol: '€' },
      { name: 'лв Lev', code: 'BGN', symbol: 'лв' },
      { name: 'kn Kuna', code: 'HRK', symbol: 'kn' },
      { name: 'Kč Koruna', code: 'CZK', symbol: 'Kč' },
      { name: 'kr Krone', code: 'DKK', symbol: 'kr' },
      { name: 'Ft Forint', code: 'HUF', symbol: 'Ft' },
      { name: 'kr Króna', code: 'ISK', symbol: 'kr' },
      { name: 'kr Krone', code: 'NOK', symbol: 'kr' },
      { name: 'zł Zloty', code: 'PLN', symbol: 'zł' },
      { name: 'lei Leu', code: 'RON', symbol: 'lei' },
      { name: 'kr Krona', code: 'SEK', symbol: 'kr' },
      { name: 'Fr Franc', code: 'CHF', symbol: 'Fr' },
      { name: '£ Pound', code: 'GBP', symbol: '£' },
      { name: '$ Peso', code: 'ARS', symbol: '$' },
      { name: 'Bs. Boliviano', code: 'BOB', symbol: 'Bs.' },
      { name: 'R$ Real', code: 'BRL', symbol: 'R$' },
      { name: '$ Peso', code: 'CLP', symbol: '$' },
      { name: '$ Peso', code: 'COP', symbol: '$' },
      { name: 'G$ Dollar', code: 'GYD', symbol: 'G$' },
      { name: '₲ Guarani', code: 'PYG', symbol: '₲' },
      { name: 'S/. Sol', code: 'PEN', symbol: 'S/.' },
      { name: '$ Dollar', code: 'SRD', symbol: '$' },
      { name: '$U Peso', code: 'UYU', symbol: '$U' },
      { name: 'Bs.S. Bolívar', code: 'VES', symbol: 'Bs.S.' },
      { name: '¥ Yen', code: 'JPY', symbol: '¥' }, // For comparison only
  ];

exchangeRates: { [key: string]: number } = {
    'INR': 1,        // Base
    'USD': 0.012,    // US Dollar
    'EUR': 0.011,    // Euro
    'BGN': 0.021,    // Bulgarian Lev
    'HRK': 0.083,    // Croatian Kuna (historical, now uses EUR)
    'CZK': 0.27,     // Czech Koruna
    'DKK': 0.082,    // Danish Krone
    'HUF': 4.4,      // Hungarian Forint
    'ISK': 1.6,      // Icelandic Króna
    'NOK': 0.13,     // Norwegian Krone
    'PLN': 0.048,    // Polish Złoty
    'RON': 0.056,    // Romanian Leu
    'SEK': 0.13,     // Swedish Krona
    'CHF': 0.0108,   // Swiss Franc
    'GBP': 0.0095,   // British Pound
    'ARS': 10.2,     // Argentine Peso
    'BOB': 0.083,    // Boliviano
    'BRL': 0.065,    // Brazilian Real
    'CLP': 11.1,     // Chilean Peso
    'COP': 48.2,     // Colombian Peso
    'GYD': 2.5,      // Guyanese Dollar
    'PYG': 88.0,     // Paraguayan Guarani
    'PEN': 0.045,    // Peruvian Sol
    'SRD': 0.45,     // Surinamese Dollar
    'UYU': 0.47,     // Uruguayan Peso
    'VES': 0.44,     // Venezuelan Bolívar Soberano
    // Duplicate currencies across countries
    'JPY': 1.85
  };

  exchangeRatesToINR: { [key: string]: number } = {
  'INR': 1,           // Base
  'USD': 83.33,       // 1 USD = 83.33 INR
  'EUR': 90.91,       // 1 EUR = 90.91 INR
  'BGN': 47.62,       // 1 BGN = 47.62 INR
  'HRK': 12.05,       // 1 HRK = 12.05 INR
  'CZK': 3.70,        // 1 CZK = 3.70 INR
  'DKK': 12.20,       // 1 DKK = 12.20 INR
  'HUF': 0.227,       // 1 HUF = 0.227 INR
  'ISK': 0.625,       // 1 ISK = 0.625 INR
  'NOK': 7.69,        // 1 NOK = 7.69 INR
  'PLN': 20.83,       // 1 PLN = 20.83 INR
  'RON': 17.86,       // 1 RON = 17.86 INR
  'SEK': 7.69,        // 1 SEK = 7.69 INR
  'CHF': 92.59,       // 1 CHF = 92.59 INR
  'GBP': 105.26,      // 1 GBP = 105.26 INR
  'ARS': 0.098,       // 1 ARS = 0.098 INR
  'BOB': 12.05,       // 1 BOB = 12.05 INR
  'BRL': 15.38,       // 1 BRL = 15.38 INR
  'CLP': 0.090,       // 1 CLP = 0.090 INR
  'COP': 0.021,       // 1 COP = 0.021 INR
  'GYD': 0.40,        // 1 GYD = 0.40 INR
  'PYG': 0.0114,      // 1 PYG = 0.0114 INR
  'PEN': 22.22,       // 1 PEN = 22.22 INR
  'SRD': 2.22,        // 1 SRD = 2.22 INR
  'UYU': 2.13,        // 1 UYU = 2.13 INR
  'VES': 2.27,        // 1 VES = 2.27 INR
  'JPY': 0.54         // 1 JPY = 0.54 INR
};

  selectedCurrency: any;
  displayAmount: number;
  userCurrencyCode: string;
  usercurrencySymbol: string;
  
  currencyFormateChanged() {
    // this.oldCurrencyCode = this.currencyCode;
    this.currencyCode = this.selectedCurrency.code;
    this.usercurrencySymbol = this.selectedCurrency.symbol;
  }

  convertAmount(baseAmount?: number): number {
    if (this.selectedCurrency && this.exchangeRates[this.selectedCurrency.code]) {
      // console.log(this.oldCurrencyCode);      
      // console.log(this.selectedCurrency.code);      
      const rate = this.exchangeRates[this.selectedCurrency.code];
      // console.log(rate);
      // console.log(baseAmount);
      console.log(this.convertExpenseToselectedCurrency(baseAmount,this.oldCurrencyCode,this.selectedCurrency.code));
      
      // return baseAmount * rate;
      return this.convertExpenseToselectedCurrency(baseAmount,this.oldCurrencyCode,this.selectedCurrency.code);
    }
    return baseAmount;
  }

    convertExpenseToAdminCurrency(amount: number, adminCurrencyCode: string, usercurrencycode: string): number | null {
      console.log(adminCurrencyCode);
      console.log(usercurrencycode);      
    const rateToINRUser = this.exchangeRates[usercurrencycode];
    const reteToINRAdmin = this.exchangeRates[adminCurrencyCode];
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

  convertExpenseToselectedCurrency(amount: number, sourceCurrencyCode: string, resultcurrencyCode: string) {
    
    if(!this.exchangeRatesToINR[sourceCurrencyCode] || !this.exchangeRatesToINR[resultcurrencyCode]) {
      console.error("Unsupported currency code");      
    }
    let amountToINR: number = amount * this.exchangeRatesToINR[sourceCurrencyCode];
    // console.log(amountToINR);
    const convertedAmount = amountToINR / this.exchangeRatesToINR[resultcurrencyCode];
    // console.log(convertedAmount);
        
    return convertedAmount;
  }

  isLoading: boolean = false;

  filterGlobal(text: string) {
    return this.usersDetailTable.filterGlobal(text, 'contains');
  }

    reloadAll(text: string) {
    if(text === '') {
      this.filterGlobal(text);
    }
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
  columnsChanged(event: any) {
    console.log(event);    
    this.columnMultiSelect.show();
    event.originalEvent?.stopPropagation?.();
    // console.log(this.selectedColumns);
    // this.shoeColumnsDisplay = false;
  }



// code for adding and updating the new user to the application
  showAddOrUpdateDailog: boolean = false;

  addUserForm1: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  profileImage: string = 'assets/users/defaultProfileImg.jpg';

  openNew() {
    this.selectedGender = 'male';
    this.addUserForm1.get('username').enable();
    this.addUserForm1.get('password').enable();
    this.showAddOrUpdateDailog = true;
  }

  triggerFileinput() {
    this.fileInput.nativeElement.click();
  }

  onFilechanges(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

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
    reader.onload = () => {
      this.profileImage = reader.result as string;
      console.log(reader.result as string);  
      this.addUserForm1.patchValue({ profileImage: reader.result as string});    
    };
    reader.readAsDataURL(file);
  }

  selectedGender: string = 'male';

  changeGender(value: string) {
    this.selectedGender = value;
  }

  filteredstates: any[] = [];
  // @ViewChild('addUserForm') addUserForm: NgForm;
  authService: Authservice = inject(Authservice);
  messageService: MessageService = inject(MessageService)
  http: HttpClient = inject(HttpClient);
  secretKey: string = 'TravelTrail';

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
    console.log(country);
    this.addUserForm1.patchValue({country: country});
    console.log(this.addUserForm1.controls['state'] !== null);
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
        this.getAllUserDetails();
      });
      return;
    } 
    // console.log(this.addUserForm1);
    console.log(this.addUserForm1.value);
    let password = this.addUserForm1.value.password;
    let encryptedPassword = CryptoJS.AES.encrypt(password, this.secretKey).toString();
    console.log(encryptedPassword);
    this.addUserForm1.patchValue({password: encryptedPassword});
    let country = (this.addUserForm1.controls['country']).value.code;
    console.log(country);
    this.addUserForm1.patchValue({country: country});
    console.log(this.addUserForm1.controls['state'] !== null);
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
        
        // this.authService.signup(newUser);
        this.http.post(
        'https://travektrail-app-default-rtdb.firebaseio.com/users.json',
        newUser
      )
      .subscribe((response) => {
        // console.log(response);
        // console.log(newUser);  
        this.addUserForm1.reset(); 
        this.messageService.add({severity:'success', summary:'Success', detail:'UserSuccessFully Added!.'})
        this.profileImage = 'assets/users/defaultProfileImg.jpg';
        this.showAddOrUpdateDailog = false;
        this.getAllUserDetails();
      });
        
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
    }
    this.http.get(`https://travektrail-app-default-rtdb.firebaseio.com/users/${userId}.json`).subscribe((user: User) => {
      this.userToEdit = user;
      // console.log(this.userToEdit);
      this.selectedGender = user.gender.toLocaleLowerCase();
      this.filteredstates = this.states[user.country] || [];
      console.log(this.statesForEdit);      
      this.profileImage = user.profileImage ? user.profileImage : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName ? user.lastName : ''}&bold=true`;
      this.addUserForm1.patchValue(this.userToEdit);
      console.log(this.addUserForm1);      
      this.addUserForm1.patchValue({profileImage: this.profileImage});
      console.log(this.addUserForm1);
      let countryObj = countries.find((country) => {
        return country.code === this.userToEdit.country;
      })
      this.addUserForm1.patchValue({country: countryObj})
      let encryptedPassword = user.password;
      // console.log(encryptedPassword);          
      let code = CryptoJS.AES.decrypt(encryptedPassword, this.secretKey);
      let decryptedPassword = code.toString(CryptoJS.enc.Utf8);
      this.addUserForm1.patchValue({password: decryptedPassword});
      console.log(this.addUserForm1.controls['country']);      
      if(this.addUserForm1.controls['country']) {
        this.filteredstates = this.states[countryObj.code] || [];
      }
      this.addUserForm1.patchValue({state: this.filteredstates.find((state) => state.code === this.userToEdit.state)})
      console.log(this.addUserForm1);
      
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
    this.http.delete(`https://travektrail-app-default-rtdb.firebaseio.com/users/${this.userId}.json`).subscribe((res) => {
      this.messageService.add({severity:'success', summary:'Success', detail:`User Successfully Deleted!.`})
    this.showDeleteUserdailog = false;
    this.getAllUserDetails();
    });
    
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
    this.goToPageNumber = event.page + 1;
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
}
