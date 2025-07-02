import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../Models/user';
import { Authservice } from '../Services/auth.service';
import { catchError, map, throwError } from 'rxjs';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {

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

  onCountryChanges(country: any) {
    this.filteredstates = this.states[country.code] || [];
  }

  reactiveForm: FormGroup;

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
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
      confirmPassword: new FormControl(null, Validators.required),
    });
  }
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  http: HttpClient = inject(HttpClient);
  allUsers: User[] = [];
  errorMessage: string = '';
  profileImage: string = 'assets/users/defaultProfileImg.jpg';
  paginationPageNo: number = 1;

  triggerFileinput() {
    this.fileInput.nativeElement.click();
  }

  onFilechanges(event: Event) {
    // const file = (event.target as HTMLInputElement).files?.[0];
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
      this.reactiveForm.patchValue({ profileImage: reader.result as string});    
    };
    reader.readAsDataURL(file);

    // this.reactiveForm.patchValue({ profileImage: this.profileImage });
    // this.reactiveForm.get('profileImage')?.updateValueAndValidity();
  }

  authService: Authservice = inject(Authservice);

  currentUser: User;
  passwordMatch: boolean = false;
  onSignupFormsubmit() {
    console.log(this.reactiveForm.value);
    this.currentUser = this.reactiveForm.value;
    if(this.currentUser.password !== this.currentUser.confirmPassword || this.currentUser.password === null) {
      this.passwordMatch = true;
      alert("password should be match")
      return;
    }
    console.log(this.currentUser);    
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        console.log(this.allUsers);
        let isUserExits = this.allUsers.find((user) => {
          return (user.username === this.currentUser.username || user.email === this.currentUser.email);
        });
        if (isUserExits) {
          alert('User already exits');
          return;
        }
        console.log(this.currentUser);        
        this.authService.signup(this.currentUser);
        this.reactiveForm.reset();
        this.profileImage = 'assets/users/defaultProfileImg.jpg';
      },
      error: (err) => {
        this.errorMessage = err.message;
        console.log(this.errorMessage);
      },
    });
  }

  // private getAllUsers() {
  //   return this.http
  //     .get('https://travektrail-app-default-rtdb.firebaseio.com/users.json')
  //     .pipe(
  //       map((response) => {
  //         console.log(response);
  //         let users = [];
  //         for (let key in response) {
  //           if (response.hasOwnProperty(key)) {
  //             users.push({ ...response[key], id: key });
  //           }
  //         }
  //         console.log(users);
  //         return users;
  //       }),
  //       catchError((err) => {
  //         return throwError(() => err);
  //       })
  //     );
  // }

  private setErrorMessage(error: HttpErrorResponse) {}


  goToPrevPage(value: number) {
    this.paginationPageNo = value;
  }
  goToNextPage(value: number) {
    this.paginationPageNo = value;
  }
  
}
