import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user-trip',
  templateUrl: './user-trip.component.html',
  styleUrls: ['./user-trip.component.css']
})
export class UserTripComponent {
  userTrips = [
    {
      userName: 'John Doe',
      totalDistance: 1200,
      gender: 'Male',
      age: 24,
      totalExpense: 25000
    },
    {
      userName: 'Jane Smith',
      totalDistance: 1500,
      gender: 'Male',
      age: 30,
      totalExpense: 30000
    },
    {
      userName: 'Alice Johnson',
      totalDistance: 800,
      gender: 'Male',
      age: 22,
      totalExpense: 15000
    },
    {
      userName: 'Bob Brown',
      totalDistance: 2000,
      gender: 'male',
      age: 28,
      totalExpense: 40000
    },
    {
      userName: 'Charlie White',
      totalDistance: 1800,
      gender: 'Feamle',
      age: 26,
      totalExpense: 35000
    },
    {
      userName: 'David Green',
      totalDistance: 1600,
      gender: 'Male',
      age: 32,
      totalExpense: 32000
    },
    {
      userName: 'Eve Black',
      totalDistance: 1400,
      gender: 'Female',
      age: 29,
      totalExpense: 28000
    },
    {
      userName: 'Frank Blue',
      totalDistance: 1100,
      gender: 'Male',
      age: 27,
      totalExpense: 22000
    },
    {
      userName: 'Grace Yellow',
      totalDistance: 1300,
      gender: 'Female',
      age: 31,
      totalExpense: 27000
    },
    {
      userName: 'Hank Purple',
      totalDistance: 900,
      gender: 'Male',
      age: 23,
      totalExpense: 18000
    },
    {
      userName: 'Ivy Orange',
      totalDistance: 1700,
      gender: 'Female',
      age: 25,
      totalExpense: 33000
    }
  ];

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

  @ViewChild('userTripTable') userTripTable;

  filterGlobal(event: Event) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    return this.userTripTable.filterGlobal(input.value, 'contains');
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

  bucketListDailog: boolean = false;

  openUserBucketList(userTrip) {
    console.log(userTrip);   
    this.bucketListDailog = !this.bucketListDailog; 
  }

}
