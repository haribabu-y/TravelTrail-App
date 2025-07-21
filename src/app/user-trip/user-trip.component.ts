import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { UserTrips } from '../Models/usertrips';
import { SharedService } from '../Services/shared.service';
import { BucketListService } from '../Services/bucketList.service';
import { BucketList } from '../Models/bucketList';
import { MultiSelect } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { countries } from '../constants/countries';

@Component({
  selector: 'app-user-trip',
  templateUrl: './user-trip.component.html',
  styleUrls: ['./user-trip.component.css'],
})
export class UserTripComponent implements OnInit {

  @ViewChild('userTripTable') userTripTable: Table;

  usersTrips: UserTrips[] = [];
  sharedService: SharedService = inject(SharedService);
  bucketListService: BucketListService = inject(BucketListService);
  messageService: MessageService = inject(MessageService);
  userId: string = ''
  isLoading: boolean = false;
  isDarkMode: boolean = false;
  currencyCode: string = '';
  currencySymbol: string = '';
  oldCurrencyCode: string;

  countries  = countries;

  ngOnInit(): void {
    this.sharedService.isDarkMode.subscribe((res) => this.isDarkMode = res);
    localStorage.getItem('theme') === 'dark' ? this.isDarkMode = true : this.isDarkMode = false;

    this.currencyCode = JSON.parse(localStorage.getItem('user')).country.currencyCode;
    this.oldCurrencyCode = JSON.parse(localStorage.getItem('user')).country.currencyCode;
    this.currencySymbol = JSON.parse(localStorage.getItem('user')).country.currencySymbol;

    this.selectedColumns = [...this.columnOptions]
    this.isLoading = true;
    this.sharedService.getAllUsers().subscribe((users) => {
      for (let user of users) {
        // console.log(user);
        let username: string = user.firstName + ' ' + user.lastName;
        let gender: string = user.gender;
        let age: number = new Date().getFullYear() - new Date(user.dob).getFullYear();
        let id: string = user.id;
        let countryObj = this.countries.find((country) => {
          return country.code === user.country;
        });
        console.log(countryObj);        
        let country = Object.values(countryObj)[0];
        // let country = user.country;
        // console.log(country);        
        
        let totalDistance: number = 0;
        let totalExpense: number = 0;
        // console.log(user.trips);
        if (user.trips) {
          Object.keys(user.trips).forEach((key) => {
            // console.log(user.trips[key]);
            totalDistance += user.trips[key].totalDistance;
            totalExpense += user.trips[key].totalExpense;
          });
        }
        let adminCurrencyCode = this.currencyCode;
        let userCurrencyCode= countryObj['currencyCode'];
        // console.log(userCurrencyCode);
        let userTotalExpense: number;

        userTotalExpense = this.convertExpenseToAdminCurrency(totalExpense,adminCurrencyCode,userCurrencyCode);
        // console.log(userTotalExpense);        
        let userDetail = new UserTrips( username, totalDistance, gender, age, userTotalExpense, id);
        // console.log(userDetail);
        this.usersTrips.push(userDetail);
      }
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
  userCurrencyCode: string;
  usercurrencySymbol: string;

  currencyFormateChanged() {

    this.currencyCode = this.selectedCurrency.code;
    this.userCurrencyCode = this.selectedCurrency.code;
    this.usercurrencySymbol = this.selectedCurrency.symbol;
        
  }
  convertAmount(baseAmount?: number): number {
    // console.log("Base mount" + baseAmount);   
    // console.log(this.currencyCode);       
    if (this.selectedCurrency && this.exchangeRates[this.selectedCurrency.code]) {
      // let amountInINR = baseAmount * this.exchangeRatesToINR[this.oldCurrencyCode]
      // console.log(amountInINR);      
      const rate = this.exchangeRates[this.selectedCurrency.code];   
      // let amount: number = this.convertCurrency(baseAmount,this.oldCurrencyCode,this.selectedCurrency.code);
      // console.log(amount);   
      console.log(this.convertExpenseToselectedCurrency(baseAmount,this.oldCurrencyCode,this.selectedCurrency.code));
      // return baseAmount * rate;
      return this.convertExpenseToselectedCurrency(baseAmount,this.oldCurrencyCode,this.selectedCurrency.code);
    }
    return baseAmount;
  }

  convertExpenseToAdminCurrency(amount: number, adminCurrencyCode: string, usercurrencycode: string): number | null {
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
  getDistanceUnitLabel(): string {
    return this.distanceLabel;
  }

  filterGlobal(text: string) {
    return this.userTripTable.filterGlobal(text, 'contains');
  }

    reloadAll(text: string) {
    if(text === '') {
      this.filterGlobal(text);
    }
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

  columnsChanged(event) {
    this.columnMultiSelect.show();
    event.originalEvent?.stopPropagation?.();
    // console.log(this.selectedColumns);
    // this.shoeColumnsDisplay = false;    
  }

  bucketListDailog: boolean = false;
  bucketListItems: BucketList[];
  isbucketListloading: boolean = false;
  haveBucketLists: boolean = false;

  openUserBucketList(userid: string) {
    console.log(userid);
    this.userId = userid;
    this.bucketListDailog = true;
    this.isbucketListloading = true;
    this.bucketListService.getAllBucketLists(userid).subscribe((res) => {
      console.log(res);   
      this.bucketListItems = res;
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
    const file = (event.target as HTMLInputElement).files?.[0];

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
    reader.onload = () => {
      this.placeImage = reader.result as string;
      console.log(reader.result as string);      
    }
    reader.readAsDataURL(file);
    
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
}
