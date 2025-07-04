import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { SharedService } from '../Services/shared.service';
import { UserDetail } from '../Models/userDetail';
import { BucketList } from '../Models/bucketList';
import { BucketListService } from '../Services/bucketList.service';

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

  showAddOrUpdateDailog: boolean = false;

  openNew() {
    this.showAddOrUpdateDailog = true;
  }

}
