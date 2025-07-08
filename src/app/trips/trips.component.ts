import { AfterViewInit, Component, DoCheck, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Authservice } from '../Services/auth.service';
import { TripService } from '../Services/trip.service';
import { Trip } from '../Models/trip';
import { SharedService } from '../Services/shared.service';
import { Table } from 'primeng/table';
import { MultiSelect } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {
    
  // collecting the refercnce of the table 
  @ViewChild('tripTable') table: Table;
  authService: Authservice = inject(Authservice);
  userTrips: Trip[];
  //instance of the tripService
  tripService: TripService = inject(TripService);
  sharedService: SharedService = inject(SharedService);
  isLoading: boolean = false;

  @ViewChild('coloumnSelect') columnSelect: MultiSelect

  messageService: MessageService = inject(MessageService);

  ngOnInit() {
    this.loadTripsInTable();
    this.selectedColumns = [...this.columnOptions]
  }

  columnsChanged(event: Event) {
    // this.loadTripsInTable();
    // console.log(event)
    this.columnSelect.show();
    // console.log(this.selectedColumns);  
    // this.shoeColumnsDisplay = false;  
  }


  loadTripsInTable() {
    this.isLoading = true;
    this.tripService.getAllTrips().subscribe((res: Trip[]) => {
      console.log(res);  
      this.userTrips = res;
      this.isLoading = false;
      console.log(this.userTrips);  
      let totalExpense: number = 0;
      for(let key of res) {
        totalExpense += key.totalExpense;
      }    
      this.sharedService.getUserExpense(totalExpense);
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
    if(this.startPlace === '' || this.destination === '' || this.totalDistance === 0 || this.totalExpense === 0 || this.totalMembers === 0){
      this.messageService.add({severity: 'error', summary:'Error', detail:'Please fill all the fields!.'});
      return;
    }
    let data: Trip = {
      startLocation: this.startPlace,
      destination: this.destination,
      totalDistance: this.totalDistance,
      totalExpense: this.totalExpense,
      totalMembers: this.totalMembers
    }
    this.tripService.addNewtrip(data).subscribe((res) => {
      this.loadTripsInTable();
      this.messageService.add({severity: 'success', summary:'Success',detail:'Trip SuccessFully Added!.'})
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
  selectedColumns: any[] = [];

  columnOptions = [
    {label: 'Start Location', value: 'startLocation'},
    {label: 'Destination', value: 'destination'},
    {label: 'Total Distance', value: 'totalDistance'},
    {label: 'Total Expense', value: 'totalExpense'},
    {label: 'Total Members', value: 'totalMembers'}
  ];

  showCloumnList() {
    this.shoeColumnsDisplay = !this.shoeColumnsDisplay;
  }

  goToPageNumber: number = null;

  onPageChange(event: any) {
    console.log(event);
    this.goToPageNumber = event.page + 1;
    this.rows = event.rows;
  }

  goToPage(){
    if(this.table && this.goToPageNumber > 0) {
      const pageIndex = this.goToPageNumber -1;
      const firstRowIndex = pageIndex * this.rows;
      if(firstRowIndex >= 0 && firstRowIndex < this.table.value.length) {
        this.table.first = firstRowIndex;
      } else {
        alert("Invalid page number entered.")
        // this.goToPageNumber = Math.floor(this.table.first / this.rows) + 1;
      }
    }
  }
  

  // ngAfterViewInit(): void {
  //   console.log(this.table.value);      
  // }
  
}
