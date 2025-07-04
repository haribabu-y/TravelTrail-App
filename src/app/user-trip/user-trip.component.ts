import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { AdminService } from '../Services/admin.service';
import { UserTrips } from '../Models/usertrips';
import { SharedService } from '../Services/shared.service';
import { BucketListService } from '../Services/bucketList.service';
import { BucketList } from '../Models/bucketList';

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
  userId: string = ''
  isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    // this.adminService.getUsersTrips().subscribe((res) => {
    //   console.log(res);
    //   this.usersTrips = res;
    //   this.isLoading = false;
    // });
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
        let userDetail = new UserTrips(
          username,
          totalDistance,
          gender,
          age,
          totalExpense,
          id
        );
        // console.log(userDetail);
        this.usersTrips.push(userDetail);
      }
      this.isLoading = false;
    });
  }

    currencyFormate = [
    { name: '$  Doller', code: '$' },
    { name: '₹  Rupees', code: '₹' },
    { name: '€  Euro', code: '€' },
    { name: '£  Pound', code: '£' },
    { name: '¥  Yen', code: '¥' },
  ];

  selectedCurrency: string = '';

  distanceFormate = ['Kilo Meters', 'Miles'];
  selectedDistanceFormate: string = '';

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

  shoeColumnsDisplay: boolean = false;

  columnOptions = [
    'User Name',
    'Toatl Distance',
    'Gender',
    'Age',
    'Total Expense',
  ];

  showCloumnList() {
    this.shoeColumnsDisplay = !this.shoeColumnsDisplay;
  }

  bucketListDailog: boolean = false;
  bucketListItems: BucketList[];
  isbucketListloading: boolean = false;

  openUserBucketList(userid: string) {
    console.log(userid);
    this.userId = userid;
    this.bucketListDailog = true;
    this.isbucketListloading = true;
    this.bucketListService.getAllBucketLists(userid).subscribe((res) => {
      console.log(res);   
      this.bucketListItems = res;
      this.isbucketListloading = false;   
    })
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
      alert("Please fill all the fields.");
      return;
    }

    this.bucketListService.updateUserBucketItem(this.bucketlistId, updateBucketData, this.userId).subscribe((res) => {
      this.openUserBucketList(this.userId);
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
    })
    this.isDeleteDailog = false;
  }

  closeDeleteDailog() {
    this.isDeleteDailog = false;
  }
}
