import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { SharedService } from '../Services/shared.service';
import { UserDetail } from '../Models/userDetail';
import { BucketList } from '../Models/bucketList';
import { BucketListService } from '../Services/bucketList.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { User } from '../Models/user';
import { Authservice } from '../Services/auth.service';
import { HttpClient } from '@angular/common/http';

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

  ngOnInit(): void {
    this.isLoading = true;
    this.sharedService.getAllUsers().subscribe((users) => {
      for(let user of users) {
        console.log(user);
        let userimage: string = user.profileImage;
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
        this.users.push(userDetail);   
      }
      console.log(this.users);
      
      this.isLoading = false;
    });

    this.addUserForm1 = new FormGroup({
        profileImage: new FormControl(null),
        username: new FormControl(null, Validators.required),
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null),
        gender: new FormControl('male', Validators.required),
        dob: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phone: new FormControl(null, Validators.required),
        address: new FormControl(null, Validators.required),
        country: new FormControl(null, Validators.required),
        state: new FormControl(null, Validators.required),
        zipCode: new FormControl(null, Validators.required),
        timeZone: new FormControl(null, Validators.required),
        locale: new FormControl(null),
        isAdmin: new FormControl(false),
        password: new FormControl(null, Validators.required),
    })
  }

  currencyFormate = [
    {name: '$  Doller', code: '$'},
    {name: '₹  Rupees', code: '₹'},
    {name: '€  Euro', code: '€'},
    {name: '£  Pound', code: '£'},
    {name: '¥  Yen', code: '¥'}
  ]

  selectedCurrency;

  distanceFormate = [
    'Kilo Meters',
    'Miles'
  ]
  selectedDistanceFormate: string = '';

  isLoading: boolean = false;

  filterGlobal(event: Event) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    return this.usersDetailTable.filterGlobal(input.value, 'contains');
  }

  numOfRows: number = 5;
  showRowsChange: boolean = false;
  rowOptions = [
    { label: 'Show 5', value: 5},
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

  shoeColumnsDisplay: boolean = false;

  columnOptions =[
    'User Name', 'Toatl Distance','Gender', 'Age', 'Total Expense'
  ]

  showCloumnList() {
    this.shoeColumnsDisplay = !this.shoeColumnsDisplay
  }

// code for adding and updating the new user to the application
  showAddOrUpdateDailog: boolean = false;

  addUserForm1: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  profileImage: string = 'assets/users/defaultProfileImg.jpg';

  openNew() {
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

  filteredstates: any[] = [];
  @ViewChild('addUserForm') addUserForm: NgForm;
  authService: Authservice = inject(Authservice);
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
    if(id) {
      let userToUpdate: User = this.addUserForm1.value;
      this.http.put(`https://travektrail-app-default-rtdb.firebaseio.com/users/${id}.json`, userToUpdate).subscribe((res) => {
        console.log(res);        
      });
      return;
    }
    console.log(this.addUserForm1);
    if(this.addUserForm.invalid){
      alert('Fill all manditory fields');
        return;
    }
    let newUser: User = this.addUserForm1.value;
    this.sharedService.getAllUsers().subscribe({
      next: (users) => {
        let isUserExit = users.find((user) => {
          return (user.username === newUser.username || user.email === newUser.email);
        });
        if(isUserExit) {
          console.log(isUserExit);          
          alert("User already exits");
          return;
        }
        this.authService.signup(newUser);
        console.log(newUser);  
        this.addUserForm1.reset(); 
        this.profileImage = 'assets/users/defaultProfileImg.jpg';
      }
    })
  }
  closeDailog() {
    this.showAddOrUpdateDailog = false;
    this.addUserForm1.reset();
  }
  userToEdit: User;
  userToEditId: string;
  openEditDialog(userId: string) {
    console.log(userId);
    this.userToEditId = userId;
    this.showAddOrUpdateDailog = true;
    this.http.get(`https://travektrail-app-default-rtdb.firebaseio.com/users/${userId}.json`).subscribe((user: User) => {
      this.userToEdit = user;
      console.log(this.userToEdit);
      this.profileImage = user.profileImage;
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
    this.http.delete(`https://travektrail-app-default-rtdb.firebaseio.com/users/${this.userId}.json`).subscribe();
    alert("user with id " + this.userId + 'Deleted');

  }

  closeDeleteUserDailog() {
    this.showDeleteUserdailog = false;
  }
}
