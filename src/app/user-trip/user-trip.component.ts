import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { UserTrips } from '../Models/usertrips';
import { SharedService } from '../Services/shared.service';
import { BucketListService } from '../Services/bucketList.service';
import { BucketList } from '../Models/bucketList';
import { MultiSelect } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { countries } from '../constants/countries';
import { exchangeRates } from '../constants/countries';
import { exchangeRatesToINR } from '../constants/countries';
import { currencyFormate } from '../constants/countries';

import { Subscription } from 'rxjs';
import { AdminService } from '../Services/admin.service';

@Component({
  selector: 'app-user-trip',
  templateUrl: './user-trip.component.html',
  styleUrls: ['./user-trip.component.css'],
})
export class UserTripComponent implements OnInit, OnDestroy {

  constructor(
    private sharedService: SharedService,
    private bucketListService: BucketListService,
    private messageService: MessageService,
    private adminService: AdminService,
    private renderer: Renderer2
  ){}

  @ViewChild('userTripTable') userTripTable: Table;

  usersTrips: UserTrips[] = [];
  userId: string = ''
  isLoading: boolean = false;
  isDarkMode: boolean = false
  darkThemeSubscription: Subscription;
  currencyCode: string = '';
  currencySymbol: string = '';
  oldCurrencyCode: string
  countries  = countries;

  enteredText: string = '';

  ngOnInit(): void {
    this.darkThemeSubscription = this.sharedService.isDarkMode.subscribe((res) => this.isDarkMode = res);
    localStorage.getItem('theme') === 'dark' ? this.isDarkMode = true : this.isDarkMode = false;

    this.currencyCode = JSON.parse(localStorage.getItem('user')).country.currencyCode;
    this.oldCurrencyCode = JSON.parse(localStorage.getItem('user')).country.currencyCode;
    this.currencySymbol = JSON.parse(localStorage.getItem('user')).country.currencySymbol;

    let userstrips = JSON.parse(localStorage.getItem('usersTrips'));
    if(userstrips) {
      this.usersTrips = userstrips;
    } else {
      this.loadUserTipsInTable();
    }

    this.selectedColumns = [...this.columnOptions]
    // this.isLoading = true;
    // this.sharedService.getAllUsers().subscribe((users) => {
    //   for (let user of users) {
    //     // console.log(user);
    //     let username: string = user.firstName + ' ' + (user.lastName ? user.lastName : '');
    //     let gender: string = user.gender;
    //     let age: number = new Date().getFullYear() - new Date(user.dob).getFullYear();
    //     let id: string = user.id;
    //     let countryObj = this.countries.find((country) => {
    //       return country.code === user.country;
    //     });
    //     // console.log(countryObj);        
    //     let country = Object.values(countryObj)[0];
    //     // let country = user.country;
    //     // console.log(country);        
        
    //     let totalDistance: number = 0;
    //     let totalExpense: number = 0;
    //     // console.log(user.trips);
    //     if (user.trips) {
    //       Object.keys(user.trips).forEach((key) => {
    //         // console.log(user.trips[key]);
    //         totalDistance += user.trips[key].totalDistance;
    //         totalExpense += user.trips[key].totalExpense;
    //       });
    //     }
    //     let adminCurrencyCode = this.currencyCode;
    //     let userCurrencyCode= countryObj['currencyCode'];
    //     // console.log(userCurrencyCode);
    //     let userTotalExpense: number;

    //     userTotalExpense = this.convertExpenseToAdminCurrency(totalExpense,adminCurrencyCode,userCurrencyCode);
    //     // console.log(userTotalExpense);        
    //     let userDetail = new UserTrips( username, totalDistance, gender, age, userTotalExpense, id);
    //     // console.log(userDetail);
    //     this.usersTrips.push(userDetail);
    //   }
    //   this.isLoading = false;
    // });
  }

  loadUserTipsInTable() {
    this.isLoading = true;
    this.adminService.getUsersTrips().subscribe({
      next: (userTrips) => {
        console.log(userTrips);
        this.usersTrips = userTrips;
        localStorage.setItem("usersTrips", JSON.stringify(this.usersTrips));
        this.isLoading = false;   
      },
      error: (error) => {
        let errorMessage: string = "An error occered while fetching the users Trips!";
        this.messageService.add({severity:'error', summary:'Error', detail: errorMessage});
      }
    })
  }

  currencyFormate = currencyFormate;

  selectedCurrency: any;
  userCurrencyCode: string;
  usercurrencySymbol: string;

  currencyFormateChanged() {

    this.currencyCode = this.selectedCurrency.code;
    this.userCurrencyCode = this.selectedCurrency.code;
    this.usercurrencySymbol = this.selectedCurrency.symbol;

    // console.log(this.selectedCurrency);
    // console.log(this.usersTrips);
    this.usersTrips.forEach((trip) => {
      trip.totalExpense = this.convertAmount(trip.totalExpense);
      // console.log(trip.totalExpense);
    })
    console.log(this.usersTrips);
    this.oldCurrencyCode = this.selectedCurrency.code;
    
  }
  convertAmount(baseAmount?: number): number {
    // console.log("Base mount" + baseAmount);   
    // console.log(this.currencyCode);       
    if (this.selectedCurrency && exchangeRates[this.selectedCurrency.code]) {
      // let amountInINR = baseAmount * this.exchangeRatesToINR[this.oldCurrencyCode]
      // console.log(amountInINR);      
      // const rate = this.exchangeRates[this.selectedCurrency.code];   
      // let amount: number = this.convertCurrency(baseAmount,this.oldCurrencyCode,this.selectedCurrency.code);
      // console.log(amount);   
      // console.log(this.convertExpenseToselectedCurrency(baseAmount,this.oldCurrencyCode,this.selectedCurrency.code));
      // return baseAmount * rate;
      return this.convertExpenseToselectedCurrency(baseAmount,this.oldCurrencyCode,this.selectedCurrency.code);
    }
    return baseAmount;
  }

  // convertExpenseToAdminCurrency(amount: number, adminCurrencyCode: string, usercurrencycode: string): number | null {
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

    // console.log(sourceCurrencyCode);
    // console.log(resultcurrencyCode);    
    
    // this.oldCurrencyCode = resultcurrencyCode;
    
    if(!exchangeRatesToINR[sourceCurrencyCode] || !exchangeRatesToINR[resultcurrencyCode]) {
      console.error("Unsupported currency code");      
    }
    let amountToINR: number = amount * exchangeRatesToINR[sourceCurrencyCode];
    // console.log(amountToINR);
    const convertedAmount = amountToINR / exchangeRatesToINR[resultcurrencyCode];
    // console.log(convertedAmount);
        
    return convertedAmount;
  }

  distanceFormate = [
    { name: 'Kilometers', unit: 'km', label: 'km' },
    { name: 'Miles', unit: 'miles', label: 'miles' }
  ];
  selectedDistanceFormate: any;
  distanceUnit: string = 'km'
  distanceLabel: string = 'km';
  private kmToMilesFactor: number = 0.621371;

  distanceFormateChnaged() {
    this.distanceUnit = this.selectedDistanceFormate.unit
    this.distanceLabel = this.selectedDistanceFormate.label
  }

  getConvertedDistance(baseDistanceKm: number): string {
    if(this.distanceUnit === 'miles') {
      return Math.floor(baseDistanceKm * this.kmToMilesFactor) + this.distanceUnit;
    }
    return baseDistanceKm.toString() + this.distanceUnit;
  }

  filterGlobal(text: string) {
    return this.userTripTable.filterGlobal(text, 'contains');
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

  @ViewChild('rowSelect') rowSelect!: ElementRef;
  numOfRows: number = 10;
  showRowsChange: boolean = false;
  rowOptions = [
    { label: 'Show 10', value: 10 },
    { label: 'Show 15', value: 15 },
    { label: 'Show 20', value: 20 },
  ];

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

  @ViewChild('columnMultiSelect') columnMultiSelect: MultiSelect;
  shoeColumnsDisplay: boolean = false;
  selectedColumns: any[] = [];

  columnOptions = [
    {label:'User Name', value: 'username'},
    {label:'Toatl Distance', value: 'totalDistance'},
    {label:'Gender', value: 'gender'},
    {label:'Age', value: 'age'},
    {label:'Total Expense', value: 'totalExpense'},
  ];

  showCloumnList() {
    this.columnMultiSelect.show();
    // this.shoeColumnsDisplay = !this.shoeColumnsDisplay;
  }

  columnsChanged() {
    this.columnMultiSelect.show();
    // console.log(this.selectedColumns);
    // this.shoeColumnsDisplay = false;    
  }

  bucketListDailog: boolean = false;
  bucketListItems: BucketList[];
  isbucketListloading: boolean = false;
  haveBucketLists: boolean = false;

  openUserBucketList(userid: string) {
    // console.log(userid);
    this.userId = userid;
    this.bucketListDailog = true;
    this.isbucketListloading = true;
    this.bucketListService.getAllBucketLists(userid).subscribe((userBucketLists) => {
      // console.log(res);   
      this.bucketListItems = userBucketLists;
      this.isbucketListloading = false;
      if(this.bucketListItems.length === 0) {
        this.haveBucketLists = true;
      } else {
        this.haveBucketLists = false;
      }
    })
    
  }

  closeBucketListDailog() {
    this.haveBucketLists = false;
  }

  showEditBucketDialog: boolean = false;
  bucketListItem: BucketList;

  placeImage: string = '';
  placeName: string = '';
  placeDescription: string = '';
  estimatedDistance: number;
  estimatedBudget: number;
  bucketlistId: string;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  displayBucketItem(bucketItem: BucketList) {

    this.bucketListItem = bucketItem;
    this.placeImage = bucketItem.placeImage;
    this.placeName = bucketItem.placeName;
    this.placeDescription = bucketItem.placeDescription;
    this.estimatedDistance = bucketItem.estimatedDistance;
    this.estimatedBudget = bucketItem.estimatedBudget;
    this.bucketlistId = bucketItem.id;

    this.showEditBucketDialog = true;
  }

  triggerFileinput() {
    this.fileInput.nativeElement.click();  
  }

  onFilechanges(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    if(!file) return;

    const maxInputSize = 2;
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if(!allowedTypes.includes(file.type)) {
      alert("Only JPG and PNG formats are allowed.");
      return;
    }

    if(file.size > maxInputSize * 1024 * 1024) {
      alert("File size must be 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.placeImage = reader.result as string;
      // console.log(reader.result as string);      
    }    
  }

  deleteSelectedPlaceImage() {
    this.placeImage = '';
  }

  closeEditDailog() {
    this.showEditBucketDialog = false;
    this.isPIV = false;
    this.isPNV = false;
    this.isPDV = false;
    this.isEDV = false;
    this.isEBV = false;
  }

  validatePlaceName() {
    const pattern = /^[a-zA-Z\s]*$/;
    this.isPNV = !pattern.test(this.placeName || '');
    // this.isPDV = !pattern.test(this.placeDescription || '');
  }
  validatePlaceDescription() {
    const pattern = /^[a-zA-Z\s]*$/;
    this.isPDV = !pattern.test(this.placeDescription || '');
  }
  validateED() {
    if(this.estimatedDistance === 0 || this.estimatedDistance === null) {      
      this.isEDV = true;
    } else{
      this.isEDV = false;
    }
  }
  validateEB() {
    if(this.estimatedBudget === 0 || this.estimatedBudget === null) {
      this.isEBV = true;
    } else {
      this.isEBV = false;
    }
  }

  isPIV: boolean = false;
  isPNV: boolean = false;
  isPDV: boolean = false;
  isEDV: boolean = false;
  isEBV: boolean = false;
  updateBucketItem() {
    if(this.placeImage === '') {
      this.isPIV = true;
      return;
    } else {
      this.isPIV = false;
    }
    if(this.placeName === '') {
      this.isPNV = true;
      return;
    } else {
      this.isPNV = false;
    }
    if(this.placeDescription === '') {
      this.isPDV = true;
      return;
    } else {
      this.isPDV = false;
    }
    if(this.estimatedDistance === 0 || this.estimatedDistance === null) {
      this.isEDV = true;
      return;
    } else {
      this.isEDV = false;
    }
    if(this.estimatedBudget === 0 || this.estimatedBudget === null) {
      this.isEBV = true;
      return;
    } else {
      this.isEBV = false;
    }
    // if(!this.placeImage || !this.placeName || !this.placeDescription || !this.estimatedDistance || !this.estimatedBudget) {
    //   this.messageService.add({severity:'error',summary:'Error',detail:'please all the fields!.'})
    //   return;
    // }

    let updateBucketData = {
      placeImage: this.placeImage,
      placeName: this.placeName,
      placeDescription: this.placeDescription,
      estimatedDistance: this.estimatedDistance,
      estimatedBudget: this.estimatedBudget
    }   

    this.bucketListService.updateUserBucketItem(this.bucketlistId, updateBucketData, this.userId).subscribe((res) => {
      this.openUserBucketList(this.userId);
      this.messageService.add({severity:'success', summary:'Success', detail:'BucketList updated Successfully!.'});
    })
    this.showEditBucketDialog = false;
  }

  isDeleteDailog: boolean = false;
  bucketId: string;
  showDeleteDailog(bucketid: string) {
    this.bucketId = bucketid;
    this.isDeleteDailog = true;
  }

  deleteBucketItem() {
    this.bucketListService.deleteUserbucketItem(this.bucketId, this.userId).subscribe((res) => {
      this.openUserBucketList(this.userId);
      this.messageService.add({severity:'success', summary:'Success', detail:'BucketList Successfully Deleted!.'})
    })
    this.isDeleteDailog = false;
  }

  closeDeleteDailog() {
    this.isDeleteDailog = false;
  }

  goToPageNumber: number = null;

  onPageChange(event: any) {
    this.goToPageNumber = event.page + 1;
    this.numOfRows = event.rows;
  }

  goToPage() {
    if(this.userTripTable && this.goToPageNumber > 0) {
      const pageIndex = this.goToPageNumber - 1;
      const firstrowindex = pageIndex * this.numOfRows;
      if(firstrowindex >= 0 && firstrowindex < this.userTripTable.value.length) {
        this.userTripTable.first = firstrowindex;
      } else {
        this.messageService.add({severity:'warn', summary:"Warn", detail:'Inavlid page numbmer entered.'});
        // alert("Inavlid page numbmer entered.");
      }
    }
  }
  
  ngOnDestroy(): void {
    if(this.darkThemeSubscription) {
      this.darkThemeSubscription.unsubscribe();
    }
  }
}
