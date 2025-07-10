import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { AdminService } from '../Services/admin.service';
import { UserTrips } from '../Models/usertrips';
import { SharedService } from '../Services/shared.service';
import { BucketListService } from '../Services/bucketList.service';
import { BucketList } from '../Models/bucketList';
import { MultiSelect } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-trip',
  templateUrl: './user-trip.component.html',
  styleUrls: ['./user-trip.component.css'],
})
export class UserTripComponent implements OnInit {

  @ViewChild('userTripTable') userTripTable: Table;

  usersTrips: UserTrips[] = [];
  adminService: AdminService = inject(AdminService);
  sharedService: SharedService = inject(SharedService);
  bucketListService: BucketListService = inject(BucketListService);
  messageService: MessageService = inject(MessageService);
  userId: string = ''
  isLoading: boolean = false;
  isDarkMode: boolean = false;

  ngOnInit(): void {
    this.sharedService.isDarkMode.subscribe((res) => this.isDarkMode = res);
    localStorage.getItem('theme') === 'dark' ? this.isDarkMode = true : this.isDarkMode = false;

    this.selectedColumns = [...this.columnOptions]
    this.isLoading = true;
    this.sharedService.getAllUsers().subscribe((users) => {
      for (let user of users) {
        // console.log(user);
        let username: string = user.firstName + ' ' + user.lastName;
        let gender: string = user.gender;
        let age: number = new Date().getFullYear() - new Date(user.dob).getFullYear();
        let id: string = user.id;
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
        // console.log(totalDistance);
        // console.log(totalExpense);
        let userDetail = new UserTrips( username, totalDistance, gender, age, totalExpense, id);
        // console.log(userDetail);
        this.usersTrips.push(userDetail);
      }
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
    console.log(this.selectedCurrency);
    this.currencyCode = this.selectedCurrency.code;
    console.log(this.currencyCode);    
  }
  convertAmount(baseAmount?: number): number {
    if (this.selectedCurrency && this.exchangeRates[this.selectedCurrency.code]) {
      const rate = this.exchangeRates[this.selectedCurrency.code];
      return baseAmount * rate;
    }
    return baseAmount;
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

  filterGlobal(event: Event) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    return this.userTripTable.filterGlobal(input.value, 'contains');
  }

  numOfRows: number = 5;
  showRowsChange: boolean = false;
  rowOptions = [
    { label: 'Show 5', value: 5 },
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

  @ViewChild('columnSelect') columnSelect: MultiSelect;
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
    this.shoeColumnsDisplay = !this.shoeColumnsDisplay;
  }

  columnsChanged(event: Event) {
    this.columnSelect.show()
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
  }

  updateBucketItem() {
    let updateBucketData = {
      placeImage: this.placeImage,
      placeName: this.placeName,
      placeDescription: this.placeDescription,
      estimatedDistance: this.estimatedDistance,
      estimatedBudget: this.estimatedBudget
    }
    if(!this.placeImage || !this.placeName || !this.placeDescription || !this.estimatedDistance || !this.estimatedBudget) {
      this.messageService.add({severity:'error',summary:'Error',detail:'please all the fields!.'})
      return;
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
