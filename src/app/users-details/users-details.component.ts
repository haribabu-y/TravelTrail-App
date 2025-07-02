import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css']
})
export class UsersDetailsComponent {
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

  @ViewChild('usersDetailTable') usersDetailTable;

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


  usersDetails = [
    {
      profilePic: 'assets/users/user1.png',
      userName: 'Hari babu',
      age: 22,
      TotalExpense: 20000,
      Country: 'India'
    },
    {
      profilePic: 'assets/users/user2.png',
      userName: 'Naruto',
      age: 22,
      TotalExpense: 30000,
      Country: 'Japan'
    },
    {
      profilePic: 'assets/users/user3.png',
      userName: 'Eren',
      age: 22,
      TotalExpense: 35000,
      Country: 'Koria'
    },
    {
      profilePic: 'assets/users/user4.png',
      userName: 'Kakashi',
      age: 22,
      TotalExpense: 40000,
      Country: 'India'
    },
    {
      profilePic: 'assets/users/user5.png',
      userName: 'Gaara',
      age: 22,
      TotalExpense: 25000,
      Country: 'Japan'
    },
    {
      profilePic: 'assets/users/user6.png',
      userName: 'Sasuke',
      age: 22,
      TotalExpense: 30000,
      Country: 'japan'
    },
    {
      profilePic: 'assets/users/user7.png',
      userName: 'Hinata',
      age: 22,
      TotalExpense: 15000,
      Country: 'India'
    },
    {
      profilePic: 'assets/users/user8.png',
      userName: 'Mikasha',
      age: 22,
      TotalExpense: 23000,
      Country: 'Koria'
    }
  ]

}
