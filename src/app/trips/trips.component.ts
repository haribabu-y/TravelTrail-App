import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Authservice } from '../Services/auth.service';
import { TripService } from '../Services/trip.service';
import { Trip } from '../Models/trip';
import { SharedService } from '../Services/shared.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent {
    
  // collecting the refercnce of the table 
  @ViewChild('tripTable') table: Table;
  authService: Authservice = inject(Authservice);
  userTrips: Trip[];
  //instance of the tripService
  tripService: TripService = inject(TripService);
  sharedService: SharedService = inject(SharedService);
  isLoading: boolean = false;

  ngOnInit() {
    this.loadTripsInTable();
  }

  loadTripsInTable() {
    this.isLoading = true;
    this.tripService.getAllTrips().subscribe((res: Trip[]) => {
      console.log(res);  
      this.userTrips = res;
      this.isLoading = false;
      console.log(this.userTrips);      
    });
    console.log(this.userTrips);
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
  onNewTripSubmit() {
    let data: Trip = {
      startLocation: this.startPlace,
      destination: this.destination,
      totalDistance: this.totalDistance,
      totalExpense: this.totalExpense,
      totalMembers: this.totalMembers
    }
    this.tripService.addNewtrip(data).subscribe((res) => {
      this.loadTripsInTable();
    });
    this.showDailog = false;
  };

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
  

  // ngAfterViewInit(): void {
  //   console.log(this.table.value);      
  // }
  
}
