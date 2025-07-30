import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Authservice } from '../Services/auth.service';
import { TripService } from '../Services/trip.service';
import { Trip } from '../Models/trip';
import { SharedService } from '../Services/shared.service';
import { Table } from 'primeng/table';
import { MultiSelect } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private tripService: TripService,
    private sharedService: SharedService,
    private router: Router,
    private messageService: MessageService,
  ){}
    
  // collecting the refercnce of the table 
  @ViewChild('tripTable') table: Table;
  userTrips: Trip[];
  //instance of the tripService
  isLoading: boolean = false;
  isDarkMode: boolean = false;
  darkThemeSubscription: Subscription;
  getAllTripsSunscription: Subscription;
  addNewTripSubscrition: Subscription;
  currencyCode: string = '';

  @ViewChild('coloumnSelect') columnSelect: ElementRef;
  @ViewChild('rowSelect') rowSelect: ElementRef;
  @ViewChild('searchText') searchField: ElementRef;

  ngOnInit() {
    let theme = localStorage.getItem('theme');
    if(theme === 'dark') {
      this.isDarkMode = true;
    } else {
      this.isDarkMode = false;
    }
    // console.log(this.router.url);
    this.darkThemeSubscription = this.sharedService.isDarkMode.subscribe((res) => {
      this.isDarkMode = res;
    })

    this.loadTripsInTable();
    this.selectedColumns = [...this.columnOptions]

    let user = JSON.parse(localStorage.getItem('user'));
    // console.log(user.country);
    if(user) {
      this.currencyCode = user.country.currencyCode;
    }
    // console.log(this.currencyCode);
    if(localStorage.getItem('tripsRows')) {
      this.rows = JSON.parse(localStorage.getItem('tripsRows'))
    }
    if(localStorage.getItem('tripsSelectedColumns')) {
      this.selectedColumns = JSON.parse(localStorage.getItem('tripsSelectedColumns'));
    }    
  }

  ngAfterViewInit(): void {
    // console.log(this.searchField);    
  }

  loadTripsInTable() {
    this.isLoading = true;
    this.getAllTripsSunscription = this.tripService.getAllTrips().subscribe((res: Trip[]) => {
      // console.log(res);  
      this.userTrips = res;
      this.isLoading = false;
      // console.log(this.userTrips);  
      let totalExpense: number = 0;
      for(let key of res) {
        totalExpense += key.totalExpense;
      }    
      this.sharedService.getUserExpense(totalExpense);
    });
    // console.log(this.userTrips);
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
    this.startPlace = '';
    this.destination = '';
    this.totalDistance = null;
    this.totalExpense = null;
    this.totalMembers = null;
  }

  closeDailog() {
    this.showDailog = false;
    this.isSPV = false;
    this.isDV = false;
    this.isTDV = false;
    this.isTEV = false;
    this.isTMV = false;
  }
  validatePlaceName() {
    const pattern = /^[a-zA-Z\s]*$/;
    this.isSPV = !pattern.test(this.startPlace || '');
  }
  validatePlacedescription() {
    const pattern = /^[a-zA-Z\s]*$/;
    this.isDV = !pattern.test(this.destination || '');
  }
  validateNumberFields(field: string) {
    if(field === 'td' && this.totalDistance === null || this.totalDistance === 0) {
      this.isTDV = true;
      // return;
    } else {
      this.isTDV = false;
    } 
    if(field === 'te' && this.totalExpense === null || this.totalExpense === 0){
      this.isTEV = true;
      // return;
    } else {
      this.isTEV = false;
    } 
    if(field === 'tm' && this.totalMembers === null || this.totalMembers === 0){
      this.isTMV = true;
      // return;
    } else {
      this.isTMV = false
    }
  };

  isSPV: boolean = false;
  isDV: boolean = false;
  isTDV: boolean = false;
  isTEV: boolean = false;
  isTMV: boolean = false;

  onNewTripSubmit() {
    console.log(this.startPlace);    
    if(this.startPlace === '') {
      this.isSPV = true;
      // return;
    } else {
      this.isSPV = false;
    } 
    if(this.destination === '') {
      this.isDV = true;
      // return;
    } else {
      this.isDV = false;
    }
      if(this.totalDistance === null || this.totalDistance === 0) {
      this.isTDV = true;
      // return;
    } else {
      this.isTDV = false;
    } 
    if(this.totalExpense === null || this.totalExpense === 0){
      this.isTEV = true;
      // return;
    } else {
      this.isTEV = false;
    } 
    if(this.totalMembers === null || this.totalMembers === 0){
      this.isTMV = true;
      // return;
    } else {
      this.isTMV = false
    }
    if(this.startPlace === '' || this.destination === '' || (this.totalDistance === 0 || this.totalDistance === null) || (this.totalExpense === 0 || this.totalExpense === null) || (this.totalMembers === 0 || this.totalMembers === null)){
      // this.messageService.add({severity: 'error', summary:'Error', detail:'Please fill all the fields!.'});
      return;
    }
    let data: Trip = {
      startLocation: this.startPlace,
      destination: this.destination,
      totalDistance: this.totalDistance,
      totalExpense: this.totalExpense,
      totalMembers: this.totalMembers
    }
    this.addNewTripSubscrition = this.tripService.addNewtrip(data).subscribe((res) => {
      this.loadTripsInTable();
      this.messageService.add({severity: 'success', summary:'Success',detail:'Trip SuccessFully Added!.'})
    });
    this.showDailog = false;
  };

  // Method to filter trips based on a search term
  filterTableGlobal(text: string) {
    // console.log(typeof text);    
    // const input: HTMLInputElement = event.target as HTMLInputElement;
    return this.table.filterGlobal(text, 'contains');
  }

  reloadAll(text: string) {
    if(text === '') {
      this.filterTableGlobal(text);
    }
  }

  // For selcting the number of rows to display
  rows: number = 10;
  showRowsChange: boolean = false;

  rowOptions = [
    { label: 'Show 10', value: 10},
    { label: 'Show 15', value: 15},
    { label: 'Show 20', value: 20},
  ]  

  showChangeRowsList() {
    this.showRowsChange = !this.showRowsChange;
  }

  closeListbox() {
    this.showRowsChange = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // console.log(target);
    if(this.showRowsChange) {
      let clickedInsideListBox = this.rowSelect.nativeElement.contains(target);
    if(!clickedInsideListBox) {
      this.showRowsChange = false;
    }
    }
    
  }

  //For showing the selected columns to the table using the multiple select primeNG component
  @ViewChild('columnMultiSelect') columnMultiSelect: MultiSelect;
  showColumnsDisplay: boolean = false;
  selectedColumns: any[] = [];

  columnOptions = [
    {label: 'Start Location', value: 'startLocation'},
    {label: 'Destination', value: 'destination'},
    {label: 'Total Distance', value: 'totalDistance'},
    {label: 'Total Expense', value: 'totalExpense'},
    {label: 'Total Members', value: 'totalMembers'}
  ];

  showCloumnList() {
    this.columnMultiSelect.show();
    // this.shoeColumnsDisplay = !this.shoeColumnsDisplay;
  }
  columnsChanged() {
    // console.log(event);    
    this.columnMultiSelect.show();
  }

  goToPageNumber: number = null;

  onPageChange(event: any) {
    // console.log(event);
    this.goToPageNumber = event.page + 1;
    this.rows = event.rows;
  }

  showTripDetailDailog: boolean = false;

  showTripDetail(trip: Trip) {
    this.showTripDetailDailog = true;
    // console.log(trip);
    this.startPlace = trip.startLocation;
    this.destination = trip.destination;
    this.totalDistance = trip.totalDistance;
    this.totalExpense = trip.totalExpense;
    this.totalMembers = trip.totalMembers;
  }

  goToPage(){
    if(this.table && this.goToPageNumber > 0) {
      const pageIndex = this.goToPageNumber - 1;
      const firstRowIndex = pageIndex * this.rows;
      if(firstRowIndex >= 0 && firstRowIndex < this.table.value.length) {
        this.table.first = firstRowIndex;
      } else {
        this.messageService.add({severity:'warn', summary:'Warn', detail:'Inavlid page numbmer entered.'})
        // alert("Invalid page number entered.")
        // this.goToPageNumber = Math.floor(this.table.first / this.rows) + 1;
      }
    }
  }

  ngOnDestroy(): void {
    if(this.darkThemeSubscription) {
      this.darkThemeSubscription.unsubscribe();
    }
    if(this.getAllTripsSunscription) {
      this.getAllTripsSunscription.unsubscribe();
    }
    if(this.addNewTripSubscrition) {
      this.addNewTripSubscrition.unsubscribe();
    }
    // console.log(this.rows);
    // console.log(this.selectedColumns);
    // console.log(this.goToPageNumber);
    // console.log(this.searchField.nativeElement.value);   
    localStorage.setItem("tripsRows", JSON.stringify(this.rows));
    localStorage.setItem("tripsSelectedColumns", JSON.stringify(this.selectedColumns));
    // localStorage.setItem("tripsTablePage", JSON.stringify(this.goToPageNumber));
    // localStorage.setItem("tripsSearchText", JSON.stringify(this.searchField.nativeElement.value));
  }
  
}
