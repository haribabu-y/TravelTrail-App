import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements AfterViewInit {
      trips = [
      {
        startLocation: 'New York',
        destination: 'Los Angeles',
        totalDistance: 20000,
        totalExpense: 50000,
        totalMembers: 2
      },
      {
        startLocation: 'San Francisco',
        destination: 'Miami',
        totalDistance: 30000,
        totalExpense: 70000,
        totalMembers: 3
      },
      {
        startLocation: 'Chicago',
        destination: 'Houston',
        totalDistance: 15000,
        totalExpense: 40000,
        totalMembers: 1
      },
      {
        startLocation: 'Seattle',
        destination: 'Denver',
        totalDistance: 25000,
        totalExpense: 60000,
        totalMembers: 4
      },
      {
        startLocation: 'Boston',
        destination: 'Atlanta',
        totalDistance: 18000,
        totalExpense: 55000,
        totalMembers: 2
      },
      {
        startLocation: 'Phoenix',
        destination: 'Las Vegas',
        totalDistance: 12000,
        totalExpense: 30000,
        totalMembers: 1
      },
      {
        startLocation: 'Orlando',
        destination: 'San Diego',
        totalDistance: 22000,
        totalExpense: 65000,
        totalMembers: 3
      },
      {
        startLocation: 'Dallas',
        destination: 'Austin',
        totalDistance: 8000,
        totalExpense: 20000,
        totalMembers: 2
      },
      {
        startLocation: 'Philadelphia',
        destination: 'Washington DC',
        totalDistance: 10000,
        totalExpense: 25000,
        totalMembers: 1
      },
      {
        startLocation: 'Portland',
        destination: 'Salt Lake City',
        totalDistance: 27000,
        totalExpense: 70000,
        totalMembers: 3
      },
      {
        startLocation: 'Charlotte',
        destination: 'Nashville',
        totalDistance: 16000,
        totalExpense: 45000,
        totalMembers: 2
      },
      {
        startLocation: 'Kansas City',
        destination: 'Oklahoma City',
        totalDistance: 14000,
        totalExpense: 35000,
        totalMembers: 1
      },
      {
        startLocation: 'Minneapolis',
        destination: 'Milwaukee',
        totalDistance: 11000,
        totalExpense: 30000,
        totalMembers: 2
      },
      {
        startLocation: 'Baltimore',
        destination: 'Richmond',
        totalDistance: 9000,
        totalExpense: 22000,
        totalMembers: 1
      },
      {
        startLocation: 'Cincinnati',
        destination: 'Columbus',
        totalDistance: 13000,
        totalExpense: 32000,
        totalMembers: 2
      },
      {
        startLocation: 'Pittsburgh',
        destination: 'Cleveland',
        totalDistance: 15000,
        totalExpense: 40000,
        totalMembers: 1
      }    
    ]
    
  // collecting the refercnce of the table 
     @ViewChild('dt2') table;
  // Method to filter trips based on a search term
  filterGlobal(event: Event) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    return this.table.filterGlobal(input.value, 'contains');
  }

  // For selcting the number of rows to display
  rows: number = 5;
  showRowsChange: boolean = false;
  numOfRows: number = 5;

  rowOptions = [
    { label: 'Show 5', value: 5},
    { label: 'Show 10', value: 10},
    { label: 'Show 15', value: 15},
    { label: 'Show 20', value: 20},
  ]

  closeListbox() {
    this.showRowsChange = false;
    this.numOfRows = this.rows;
  }

  changeRows() {
    this.showRowsChange = !this.showRowsChange;
  }

  //For showing the selected columns to the table using the multiple select primeNG component
  shoeColumnsDisplay: boolean = false;

  columnOptions = [
    {label: 'Start Location', value: 'Start Location'},
    {label: 'Destination', value: 'Destination'},
    {label: 'Total Distance', value: 'Total Distance'},
    {label: 'Total Expense', value: 'Total Expense'},
    {label: 'Total Members', value: 'Total Members'}
  ];

  showCloumnList() {
    this.shoeColumnsDisplay = !this.shoeColumnsDisplay;
  }

  showDailog: boolean = false;
  //Colleting the reference of the dialog
  startPlace: string = '';
  destination: string = '';
  totalDistance: number = 0;
  totalExpense: number = 0;
  totalMembers: number = 0;

  openNew() {
    this.showDailog = true;
  }

  closeDailog() {
    this.showDailog = false;
  }
  addRecord() {
    let data = {
      startLocation: this.startPlace,
      destination: this.destination,
      totalDistance: this.totalDistance,
      totalExpense: this.totalExpense,
      totalMembers: this.totalMembers
    }

    this.trips.push(data); 
    this.showDailog = false;
  };

  ngAfterViewInit(): void {
    console.log(this.table);      
  }
}
