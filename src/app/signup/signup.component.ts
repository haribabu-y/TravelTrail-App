import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../Models/user';
import { Authservice } from '../Services/auth.service';
import { catchError, map, throwError } from 'rxjs';
import { SharedService } from '../Services/shared.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, AfterViewChecked {

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

  phoneCode;
  onCountryCodeChandes(code: any) {
    this.phoneCode = code;
  }
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
      countryCode: new FormControl(null, Validators.required),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)] ),
      address: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
      state: new FormControl(null),
      zipCode: new FormControl(null, Validators.required),
      timeZone: new FormControl(null, Validators.required),
      locale: new FormControl(null),
      isAdmin: new FormControl(false),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required),
    });
  }
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('logoContainer') logoContainer: ElementRef<HTMLDivElement>;;

  http: HttpClient = inject(HttpClient);
  sharedService: SharedService = inject(SharedService)
  messageService: MessageService = inject(MessageService);
  allUsers: User[] = [];
  errorMessage: string = '';
  profileImage: string = 'assets/users/defaultProfileImg.jpg';
  paginationPageNo: number = 1;
  fullPhoneNumber: string;

  screenWidth: number = window.innerWidth;

@HostListener('window:resize', ['$event'])
onResize(event: any) {
  this.screenWidth = event.target.innerWidth;
  console.log(this.screenWidth);
  
}

  ngAfterViewChecked(): void {
    if(this.paginationPageNo === 2 && this.screenWidth <= 1000) {
      this.logoContainer.nativeElement.style.display = 'none';
    } else {
      this.logoContainer.nativeElement.style.display = 'block';
    }
  }

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
  router: Router = inject(Router);

  currentUser: User;
  onSignupFormsubmit() {
    // this.reactiveForm.patchValue({phone: `${this.phoneCode + ' ' + this.reactiveForm.value.phone}`})
    if(this.reactiveForm.controls['phone'].invalid) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Mobhile number should less than 10 digits'});
      return;
    }
    console.log(this.reactiveForm.value.dob);    
    if(new Date(this.reactiveForm.value.dob) > new Date()) {
      this.messageService.add({severity:'error', summary:'Error',detail:'Date of Birth must less the today!.'})
      return;
    }
    if(this.reactiveForm.invalid) {
    //   console.log('Form is invalid. Checking controls:');
    // Object.keys(this.reactiveForm.controls).forEach(key => {
    //   const control = this.reactiveForm.get(key);
    //   console.log(`${key} → valid: ${control?.valid}, value: ${control?.value}, errors: ${JSON.stringify(control?.errors)}`);
    // });
    // return;
      console.log(this.reactiveForm);      
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Please fill all the mandatory fields!.'});
      return;
    }
    console.log(this.reactiveForm.value);
    this.currentUser = this.reactiveForm.value;
    if(this.currentUser.password !== this.currentUser.confirmPassword || this.currentUser.password === null) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Password and Confirm password should same!.'})
      return;
    }
    console.log(this.currentUser);    
    this.sharedService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        console.log(this.allUsers);
        let isUserExits = this.allUsers.find((user) => {
          return (user.username === this.currentUser.username || user.email === this.currentUser.email);
        });
        if (isUserExits) {
          alert('User already exits');
          this.messageService.add({severity: 'error', summary: 'Error', detail:'User already exits. Please Login!.'})
          this.router.navigate(['/login']);
          return;
        }
        console.log(this.currentUser);        
        this.authService.signup(this.currentUser);
        this.reactiveForm.reset();
        this.profileImage = 'assets/users/defaultProfileImg.jpg';
        this.messageService.add({severity: 'success', summary: 'Success', detail:`User ${this.currentUser.firstName + " " + this.currentUser.lastName} successfully signed Up. Please Login!.`});
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.messageService.add({severity: 'error', summary:'Error', detail:'An Unknowen Error occered!.'});
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
