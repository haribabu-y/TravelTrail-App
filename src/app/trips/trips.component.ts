import { AfterViewInit, Component, DoCheck, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Authservice } from '../Services/auth.service';
import { TripService } from '../Services/trip.service';
import { Trip } from '../Models/trip';
import { SharedService } from '../Services/shared.service';
import { Table } from 'primeng/table';
import { MultiSelect } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { LoginUser } from '../Models/loginUser';

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
  isDarkMode: boolean = false;
  currencyCode: string = '';

  @ViewChild('coloumnSelect') columnSelect: ElementRef;
  @ViewChild('rowSelect') rowSelect: ElementRef;

  messageService: MessageService = inject(MessageService);

  ngOnInit() {
    let theme = localStorage.getItem('theme');
    if(theme === 'dark') {
      this.isDarkMode = true;
    } else {
      this.isDarkMode = false;
    }

    this.sharedService.isDarkMode.subscribe((res) => {
      this.isDarkMode = res;
    })

    this.loadTripsInTable();
    this.selectedColumns = [...this.columnOptions]

    let user = JSON.parse(localStorage.getItem('user'));
    console.log(user.country);
    
    if(user) {
      this.currencyCode = user.country.currencyCode;
    }
    console.log(this.currencyCode);    
  }

  // columnsChanged(event: Event) {
  //   // this.loadTripsInTable();
  //   // console.log(event)
  //   this.columnSelect.show();
  //   // console.log(this.selectedColumns);  
  //   // this.shoeColumnsDisplay = false;  
  // }


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
    this.startPlace = '';
    this.destination = '';
    this.totalDistance = 0;
    this.totalExpense = 0;
    this.totalMembers = 0;
  }

  closeDailog() {
    this.showDailog = false;
    this.isSPV = false;
    this.isDV = false;
    this.isTDV = false;
    this.isTEV = false;
    this.isTMV = false;
  }
  isSPV: boolean = false;
  isDV: boolean = false;
  isTDV: boolean = false;
  isTEV: boolean = false;
  isTMV: boolean = false;
  onNewTripSubmit() {
    console.log(this.startPlace);    
    if(this.startPlace === '') {
      this.isSPV = true;
      return;
    } else {
      this.isSPV = false;
    } 
    if(this.destination === '') {
      this.isDV = true;
      return;
    } else {
      this.isDV = false;
    }
      if(this.totalDistance === null || this.totalDistance === 0) {
      this.isTDV = true;
      return;
    } else {
      this.isTDV = false;
    } 
    if(this.totalExpense === null || this.totalExpense === 0){
      this.isTEV = true;
      return;
    } else {
      this.isTEV = false;
    } 
    if(this.totalMembers === null || this.totalMembers === 0){
      this.isTMV = true;
      return;
    } else {
      this.isTMV = false
    }
    // if(this.startPlace === '' || this.destination === '' || this.totalDistance === 0 || this.totalExpense === 0 || this.totalMembers === 0){
    //   this.messageService.add({severity: 'error', summary:'Error', detail:'Please fill all the fields!.'});
    //   return;
    // }
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
  filterGlobal(text: string) {
    // const input: HTMLInputElement = event.target as HTMLInputElement;
    return this.table.filterGlobal(text, 'contains');
  }

  reloadAll(text: string) {
    if(text === '') {
      this.filterGlobal(text);
    }
  }

  // For selcting the number of rows to display
  rows: number = 10;
  showRowsChange: boolean = false;
  numOfRows: number = 10;

  rowOptions = [
    { label: 'Show 10', value: 10},
    { label: 'Show 15', value: 15},
    { label: 'Show 20', value: 20},
  ]  

  changeRows() {
    this.showRowsChange = !this.showRowsChange;
  }

  closeListbox() {
    this.showRowsChange = false;
    this.numOfRows = this.rows;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    console.log(target);
    console.log(this.columnSelect);
    if(this.showRowsChange) {
      let clickedInsideListBox = this.rowSelect.nativeElement.contains(target);
    if(!clickedInsideListBox) {
      this.showRowsChange = false;
    }
    }
    
  }

  //For showing the selected columns to the table using the multiple select primeNG component

  @ViewChild('columnMultiSelect') columnMultiSelect: MultiSelect;
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
    this.columnMultiSelect.show();
    // this.shoeColumnsDisplay = !this.shoeColumnsDisplay;
  }
  columnsChanged(event) {
    console.log(event);    
    this.columnMultiSelect.show();
    event.originalEvent?.stopPropagation?.();
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
        this.messageService.add({severity:'warn', summary:'Warn', detail:'Inavlid page numbmer entered.'})
        // alert("Invalid page number entered.")
        // this.goToPageNumber = Math.floor(this.table.first / this.rows) + 1;
      }
    }
  }
  

  // ngAfterViewInit(): void {
  //   console.log(this.table.value);      
  // }
  
}
