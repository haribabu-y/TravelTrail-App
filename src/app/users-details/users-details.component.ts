import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { SharedService } from '../Services/shared.service';
import { UserDetail } from '../Models/userDetail';
import { BucketList } from '../Models/bucketList';
import { BucketListService } from '../Services/bucketList.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { User } from '../Models/user';
import { Authservice } from '../Services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { MultiSelect } from 'primeng/multiselect';

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

  ngOnInit(): void {
    
    this.getAllUserDetails();
    this.selectedColumns = [...this.columnOptions]
    
    this.addUserForm1 = new FormGroup({
        profileImage: new FormControl(null),
        username: new FormControl(null, [Validators.required, Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9]+$/)]),
        firstName: new FormControl(null, [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 ]+$/)]),
        lastName: new FormControl(null, [Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 ]+$/)]),
        gender: new FormControl('male', Validators.required),
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
  }

  getAllUserDetails() {
    this.isLoading = true;
    let allUsers: UserDetail[] = [];
    this.sharedService.getAllUsers().subscribe((users) => {
      for(let user of users) {
        console.log(user);
        let userimage: string = user.profileImage ? user.profileImage : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName ? user.lastName : ''}&bold=true`;
        let username: string = user.firstName + ' ' + user.lastName;
        let id: string = user.id;
        let age: number = new Date().getFullYear() - new Date(user.dob).getFullYear();
        console.log(user.country);        
        let countryObj = user.country;
        let country = Object.values(countryObj)[1];
        console.log(country);        
        let totalExpense: number = 0;
        if (user.trips) {
          Object.keys(user.trips).forEach((key) => {
            // console.log(user.trips[key]);
            totalExpense += user.trips[key].totalExpense;
          });
        }
        let userDetail = new UserDetail(id,username, userimage, age, country, totalExpense);
        allUsers.push(userDetail);   
      }
      console.log(this.users);
      
      this.users = allUsers;
      
      this.isLoading = false;
    });

  }

  currencyFormate = [
    { name: '$  Doller', code: 'USD', symbol: '$' },
    { name: '₹  Rupees', code: 'INR', symbol: '₹' },
    { name: '€  Euro', code: 'EUR', symbol: '€' },
    { name: '£  Pound', code: 'GBP', symbol: '£' },
    { name: '¥  Yen', code: 'JPY', symbol: '¥' },
  ];

  exchangeRates: { [key: string]: number } = {
    'INR': 1,      // 1 INR is 1 INR
    'USD': 0.012,  // 1 INR = 0.012 USD (example rate as of July 2025)
    'EUR': 0.011,  // 1 INR = 0.011 EUR
    'GBP': 0.0095, // 1 INR = 0.0095 GBP
    'JPY': 1.85,   // 1 INR = 1.85 JPY
  };

  selectedCurrency: any;
  currencyCode: string = 'INR';
  displayAmount: number;

  currencyFormateChanged() {
    this.currencyCode = this.selectedCurrency.code;
  }

  convertAmount(baseAmount?: number): number {
    if (this.selectedCurrency && this.exchangeRates[this.selectedCurrency.code]) {
      const rate = this.exchangeRates[this.selectedCurrency.code];
      return baseAmount * rate;
    }
    return baseAmount;
  }

  isLoading: boolean = false;

  filterGlobal(event: Event) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    return this.usersDetailTable.filterGlobal(input.value, 'contains');
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

  countries = [
    { name: 'India', code: 'IN' },
    { name: 'United States', code: 'US' },
    { name: 'Armenia', code: 'AM' },
    { name: 'Austria', code: 'AT' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'Iceland', code: 'IS' },
    { name: 'Italy', code: 'IT' },
    { name: 'Norway', code: 'NO' },
    { name: 'Romania', code: 'RO' },
    { name: 'Russia', code: 'RU' },
    { name: 'Spain', code: 'ES' },
    { name: 'Turkey', code: 'TR' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Vatican City', code: 'VA' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Venezuela', code: 'VE' },
  ];

  states = {
    IN: [
      { name: 'Andhra Pradesh', code: 'AP' },
      { name: 'Arunachal Pradesh', code: 'AR' },
      { name: 'Assam', code: 'AS' },
      { name: 'Bihar', code: 'BR' },
      { name: 'Chhattisgarh', code: 'CG' },
      { name: 'Goa', code: 'GA' },
      { name: 'Gujarat', code: 'GJ' },
      { name: 'Haryana', code: 'HR' },
      { name: 'Himachal Pradesh', code: 'HP' },
      { name: 'Jharkhand', code: 'JH' },
      { name: 'Karnataka', code: 'KA' },
      { name: 'Kerala', code: 'KL' },
      { name: 'Madhya Pradesh', code: 'MP' },
      { name: 'Maharashtra', code: 'MH' },
      { name: 'Manipur', code: 'MN' },
      { name: 'Meghalaya', code: 'ML' },
      { name: 'Mizoram', code: 'MZ' },
      { name: 'Nagaland', code: 'NL' },
      { name: 'Odisha', code: 'OR' },
      { name: 'Punjab', code: 'PB' },
      { name: 'Rajasthan', code: 'RJ' },
      { name: 'Sikkim', code: 'SK' },
      { name: 'Tamil Nadu', code: 'TN' },
      { name: 'Telangana', code: 'TG' },
      { name: 'Tripura', code: 'TR' },
      { name: 'Uttar Pradesh', code: 'UP' },
      { name: 'Uttarakhand', code: 'UT' },
      { name: 'West Bengal', code: 'WB' },
      // Union Territories
      { name: 'Andaman and Nicobar Islands', code: 'AN' },
      { name: 'Chandigarh', code: 'CH' },
      { name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DN' },
      { name: 'Delhi', code: 'DL' },
      { name: 'Jammu and Kashmir', code: 'JK' },
      { name: 'Ladakh', code: 'LA' },
      { name: 'Lakshadweep', code: 'LD' },
      { name: 'Puducherry', code: 'PY' },
    ],
    US: [
      { name: 'Alabama', code: 'AL' },
      { name: 'Alaska', code: 'AK' },
      { name: 'Arizona', code: 'AZ' },
      { name: 'Arkansas', code: 'AR' },
      { name: 'California', code: 'CA' },
      { name: 'Colorado', code: 'CO' },
      { name: 'Connecticut', code: 'CT' },
      { name: 'Delaware', code: 'DE' },
      { name: 'District of Columbia', code: 'DC' },
      { name: 'Florida', code: 'FL' },
      { name: 'Georgia', code: 'GA' },
      { name: 'Hawaii', code: 'HI' },
      { name: 'Idaho', code: 'ID' },
      { name: 'Illinois', code: 'IL' },
      { name: 'Indiana', code: 'IN' },
      { name: 'Iowa', code: 'IA' },
      { name: 'Kansas', code: 'KS' },
      { name: 'Kentucky', code: 'KY' },
      { name: 'Louisiana', code: 'LA' },
      { name: 'Maine', code: 'ME' },
      { name: 'Maryland', code: 'MD' },
      { name: 'Massachusetts', code: 'MA' },
      { name: 'Michigan', code: 'MI' },
      { name: 'Minnesota', code: 'MN' },
      { name: 'Mississippi', code: 'MS' },
      { name: 'Missouri', code: 'MO' },
      { name: 'Montana', code: 'MT' },
      { name: 'Nebraska', code: 'NE' },
      { name: 'Nevada', code: 'NV' },
      { name: 'New Hampshire', code: 'NH' },
      { name: 'New Jersey', code: 'NJ' },
      { name: 'New Mexico', code: 'NM' },
      { name: 'New York', code: 'NY' },
      { name: 'North Carolina', code: 'NC' },
      { name: 'North Dakota', code: 'ND' },
      { name: 'Ohio', code: 'OH' },
      { name: 'Oklahoma', code: 'OK' },
      { name: 'Oregon', code: 'OR' },
      { name: 'Pennsylvania', code: 'PA' },
      { name: 'Rhode Island', code: 'RI' },
      { name: 'South Carolina', code: 'SC' },
      { name: 'South Dakota', code: 'SD' },
      { name: 'Tennessee', code: 'TN' },
      { name: 'Texas', code: 'TX' },
      { name: 'Utah', code: 'UT' },
      { name: 'Vermont', code: 'VT' },
      { name: 'Virginia', code: 'VA' },
      { name: 'Washington', code: 'WA' },
      { name: 'West Virginia', code: 'WV' },
      { name: 'Wisconsin', code: 'WI' },
      { name: 'Wyoming', code: 'WY' },
    ],
  };
  timezones = [
    'Asia/Kolkata',
    'America/New_York',
    'Europe/London',
    'America/Los_Angeles',
    // Add more timezones
  ];

  locales = [
    'en-US',
    'en-GB',
    'hi-IN',
    'de-DE',
    // Add more locales
  ];

  countryCode = [
    { name: 'India', code: '+91' },
    { name: 'USA', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'Germany', code: '+49' },
    { name: 'France', code: '+33' },
    { name: 'Brazil', code: '+55' },
    { name: 'Argentina', code: '+54' },
    { name: 'Spain', code: '+34' },
    { name: 'Italy', code: '+39' },
    { name: 'Netherlands', code: '+31' },
    { name: 'Poland', code: '+48' },
    { name: 'Sweden', code: '+46' },
    { name: 'Portugal', code: '+351' },
    { name: 'Mexico', code: '+52' },
    { name: 'Colombia', code: '+57' },
    { name: 'Peru', code: '+51' },
    { name: 'Chile', code: '+56' },
    { name: 'Venezuela', code: '+58' },
    { name: 'Uruguay', code: '+598' },
    { name: 'Norway', code: '+47' },
    { name: 'Denmark', code: '+45' },
    { name: 'Finland', code: '+358' },
    { name: 'Belgium', code: '+32' },
    { name: 'Austria', code: '+43' }
  ]

  filteredstates: any[] = [];
  // @ViewChild('addUserForm') addUserForm: NgForm;
  authService: Authservice = inject(Authservice);
  messageService: MessageService = inject(MessageService)
  http: HttpClient = inject(HttpClient);

  onCountryChanges(country: any) {
    this.filteredstates = this.states[country.code] || [];
  }
  // username: string = ''
  // firstname: string = ''
  // lastname: string = ''
  // gender: string = 'male'
  // dob: Date
  // email: string = ''
  // address: string = ''
  // country: string = ''
  // state: string = ''
  // zipcode: number = null;
  // timezone: string = ''
  // locale: string = ''
  // isAdmin: boolean = false;
  // phone: string = ''
  // password: string = ''
  addOrUpdateUser(id?: string) {
    console.log(this.addUserForm1);  
    
    if(this.addUserForm1.controls['username'].invalid) {
      let errMsg = 'For username! Only alphanumric characters Allowed, Space is not Allowed and Maximum lenght is 20 Characters';
      this.messageService.add({severity:'warn', summary:'Warn', detail: errMsg})
      return;
    }
    if(this.addUserForm1.controls['firstName'].invalid || this.addUserForm1.controls['lastName'].invalid) {
      let errMsg = 'For FirstName and LastName! Only alphanumric characters and space Allowed and Maximum lenght is 30 Characters';
      this.messageService.add({severity:'warn', summary:'Warn', detail: errMsg})
      return;
    }
    
    if(this.addUserForm1.controls['phone'].invalid) {
      this.messageService.add({severity:'warn', summary:'Warn', detail:'Enter Valid Mobile number atleast 10 digits!.'})
      return
    }
    if(new Date(this.addUserForm1.value.dob) > new Date()) {
      this.messageService.add({severity:'warn', summary:'Warn', detail:'Date of Birth must less the today!.'})
      return;
    }
    if(this.addUserForm1.invalid){
      // // alert('Fill all manditory fields');
      // this.messageService.add({severity:'error', summary:'Error', detail:'Fill all manditory fields'})
      //   return;
      let formControls = this.addUserForm1.controls;
      let errorMessage = ''
      for(let formField in formControls) {
        console.log(formField);  
        if(formControls[formField].status === "INVALID") {
          errorMessage = formField + " field is INVALID!.";
        }      
      }    
      this.messageService.add({severity: 'error', summary:'Error', detail: errorMessage});
      return;
    }
    console.log(this.addUserForm1);
    let newUser: User = this.addUserForm1.value;
    console.log(newUser); 
    if(id) {
      let userToUpdate: User = this.addUserForm1.value;
      this.http.patch(`https://travektrail-app-default-rtdb.firebaseio.com/users/${id}.json`, userToUpdate).subscribe((res) => {
        console.log(res);       
        this.userToEditId = ''; 
        this.messageService.add({severity:'success', summary:'Success', detail:'User Successfully Updated!.'})
        this.showAddOrUpdateDailog = false;
        this.getAllUserDetails();
      });
      return;
    }   
    this.sharedService.getAllUsers().subscribe({
      next: (users) => {
        let isUserExit = users.find((user) => {
          return (user.username === newUser.username || user.email === newUser.email);
        });
        if(isUserExit) {
          console.log(isUserExit);          
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
        console.log(response);
        console.log(newUser);  
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
    this.showAddOrUpdateDailog = false;
    this.addUserForm1.reset();
    this.userToEditId = ''
    this.profileImage = 'assets/users/defaultProfileImg.jpg';

  }
  userToEdit: User;
  userToEditId: string;
  openEditDialog(userId: string) {
    console.log(userId);
    this.userToEditId = userId;
    this.showAddOrUpdateDailog = true;
    if(userId) {
      this.addUserForm1.get('username').disable();
      this.addUserForm1.get('password').disable();
    }
    this.http.get(`https://travektrail-app-default-rtdb.firebaseio.com/users/${userId}.json`).subscribe((user: User) => {
      this.userToEdit = user;
      console.log(this.userToEdit);
      this.selectedGender = user.gender;
      this.profileImage = user.profileImage ? user.profileImage : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName ? user.lastName : ''}&bold=true`;
      this.addUserForm1.patchValue(this.userToEdit);
      this.addUserForm1.patchValue({profileImage: this.profileImage});
      // this.addUserForm1.setValue({
      //   profileImage: user.profileImage,
      //   username: user.username,
      //   firstName: user.firstName,
      //   lastName: user.lastName || '',
      //   gender: user.gender,
      //   dob: user.dob || '',
      //   email: user.email,
      //   phone: user.phone,
      //   address: user.address || '',
      //   country: user.country || '',
      //   state: user.state,
      //   zipCode: user.zipCode || '',
      //   timeZone: user.timeZone || '',
      //   locale: user.locale || '',
      //   isAdmin: user.isAdmin || false,
      //   password: user.password,
      // });
    })
  }
  showDeleteUserdailog: boolean = false;
  userId: string = '';
  showDeleteUser(id: string) {
    console.log(id); 
    this.userId = id;   
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
  goToPageNumber: number = null;

  onPageChange(event: any) {
    console.log(event);
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
