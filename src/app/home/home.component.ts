import { Component, inject, OnInit } from '@angular/core';
import { Colors, layouts, Legend, scales } from 'chart.js';
import { SharedService } from '../Services/shared.service';
import { TripService } from '../Services/trip.service';
import { map, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  barGraphData: any;
  barGraphOptions: any;
  lineGraphData: any;
  lineGraphOptions: any;
  pieChartData: any;
  pieChartOptions: any;
  userTrips: String[];
  userExpenses: number[];
  isLoading: boolean = false;
  isDarkMode: boolean = false;

  sharedService: SharedService = inject(SharedService);
  tripService: TripService = inject(TripService);


  predefinedColors: string[] = [
  "#FF6384", // Red
  "#36A2EB", // Blue
  "#FFCE56", // Yellow
  "#4BC0C0", // Teal
  "#9966FF", // Purple
  "#FF9F40", // Orange
  "#A9A9A9", // Dark Gray
  "#2ECC71", // Emerald Green
  "#E74C3C", // Alizarin Red
  "#9B59B6", // Amethyst
  "#34495E", // Wet Asphalt
  "#F1C40F", // Sunflower
  "#1ABC9C", // Turquoise
  "#D35400", // Pumpkin
  "#7F8C8D", // Asbestos
  "#C0392B", // Pomegranate
  "#2C3E50", // Midnight Blue
  "#F39C12", // Orange (Vibrant)
  "#2980B9", // Belize Hole (Blue)
  "#8E44AD", // Wisteria
  "#27AE60", // Nephritis (Green)
  "#16A085", // Green Sea
  "#E67E22", // Carrot
  "#BDC3C7", // Silver
  "#7B7D7D", // Gray
  "#F5B041", // Saffron
  "#5DADE2", // Dodger Blue
  "#AF7AC5", // Lavender
  "#52BE80", // Light Green
  "#EC7063", // Salmon
  "#A569BD", // Plum
  "#5B2C6F", // Deep Purple
  "#28B463", // Forest Green
  "#1F618D", // Dark Blue
  "#BA4A00", // Dark Orange
  "#F4D03F", // Goldenrod
  "#58D68D", // Medium Aquamarine
  "#DC7633", // Rust
  "#4A235A", // Dark Violet
  "#9A7D0A", // Olive
  "#6C3483", // Dark Orchid
  "#148F77", // Dark Cyan
  "#B7950B", // Dark Goldenrod
  "#CB4335", // Crimson
  "#1F618D", // Steel Blue (reused, but distinct enough from others)
  "#C39BD3", // Light Purple
  "#5499C7", // Sky Blue
  "#76448A", // Medium Purple
  "#AAB7B8", // Cadet Gray
  "#229954"  // Dark Sea Green
];

  selectedRadio = 'barGraph';

  onRadioChange(value: string){
    this.selectedRadio = value;
  }


  ngOnInit(): void {
    this.isLoading = true;
    let graphDatas = [];
    this.tripService.getAllTrips().pipe(map((response) => {
      let trips = [];
      let expenses = [];
      let totalExpense = 0;
      console.log(response);
      for(let key of response) {
        // console.log(key);
        let trip: string = (key.startLocation).substring(0, 3) + ' - ' + (key.destination).substring(0,3);
        let expense: number = key.totalExpense;
        // console.log(graphData); 
        trips.push(trip.toLocaleUpperCase())  
        expenses.push(expense);   
        totalExpense += key.totalExpense; 
      }      
      // console.log(trips);
      // console.log(expenses);      
      this.userTrips = trips; 
      this.userExpenses = expenses;  
      console.log(totalExpense);      
      this.sharedService.getUserExpense(totalExpense); 
      // console.log(this.userTrips);
      // console.log(this.userExpenses); 
      graphDatas.push(trips);
      graphDatas.push(expenses)
      return graphDatas;
    })).subscribe((res) => {
      console.log(res);
      // this.userTrips = res[0];
      // this.userExpenses = res[1];
      console.log(this.userTrips);
      console.log(this.userExpenses);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color'); 
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');  
    this.barGraphData = {
      labels: graphDatas[0],
      datasets: [
        {
          backgroundColor: documentStyle.getPropertyValue('--green-300'),
          borderColor: documentStyle.getPropertyValue('--green-400'),
          data: graphDatas[1]
        }
      ]
    };
    this.barGraphOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 50
        }
      },
      plugins: {
        legend: { 
          display: false,
          labels: {
            color: textColorSecondary  // Ensure legend uses readable color
          }
        },
        title: {
          display: true,
          text: 'Trip Vs Expense',
          position: 'top',
          align: 'start',
          font: {
            size: 20,
            weight: 'bold',
            color: textColor
          },
          padding: {
            top: 10,
            bottom: 20 
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            },
            maxRotation: 45,
            minRotation: 45
          },
          grid: {
            // color: surfaceBorder,
            drawBorder: false,
            drawOnChartArea: true,
            color: (context) => {
              return context.index === 0 ? surfaceBorder : 'transparent';
            },
            // display: false,
            
          },
          title: {
            display: true,
            text: 'Trip',
            color: textColorSecondary
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            // color: surfaceBorder,
            drawBorder: false,
            drawOnChartArea: true,
            color: (context) => {
              return context.tick.value === 0 ? surfaceBorder : 'transparent';
            }
            // display: false
          },
          title: {
            display: true,
            text: 'Expense',
            rotation: 0,
            padding: { top: 0, bottom: 0, left: 20, right: 20 }
          }
        }
      }
    };
    this.lineGraphData = {
      labels: graphDatas[0],
      datasets: [
        {
          backgroundColor: documentStyle.getPropertyValue('--green-300'),
          borderColor: documentStyle.getPropertyValue('--green-400'),
          data: graphDatas[1],
          fill: false,
          tension: 0.4

        }
      ]
    };
    this.lineGraphOptions = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Trip Vs Expense',
          position: 'top',
          align: 'start',
          font: {
            size: 20
          },
          padding: {
            top: 10,
            bottom: 20 
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            },
            maxRotation: 45,
            minRotation: 45
          },
          grid: {
            // color: surfaceBorder,
            drawBorder: false,
            drawOnChartArea: true,
            color: (context) => {
              return context.index === 0 ? surfaceBorder : 'transparent';
            },    
            // display: false  
          },
          title: {
            display: true,
            text: 'Trip'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary
          },
          grid: {
            // color: surfaceBorder,
            drawBorder: false,
            drawOnChartArea: true,
            color: (context) => {
              return context.tick.value === 0 ? surfaceBorder : 'transparent';
            }
            // display: false
          },
          title: {
            display: true,
            text: 'Expense',
            rotation: 0,
            padding: { top: 0, bottom: 0, left: 20, right: 20 }
          }
        }
      }
    }
    this.pieChartData = {
      labels: graphDatas[0],
      aspectRatio: 0.2,
      datasets: [
        {
          // backgroundColor: documentStyle.getPropertyValue('--green-300'),
          backgroundColor: this.predefinedColors,
          // borderColor: documentStyle.getPropertyValue('--white-400'),
          data: graphDatas[1],
        }
      ]
    };
    this.pieChartOptions = {
      maintainAspectRatio: false,
      responsive: false,
      plugins: {
        // legend: { display: false },
        title: {
          display: true,
          text: 'Trip Vs Expense',
          position: 'top',
          align: 'start',
          font: {
            size: 20
          },
          padding: {
            top: 10,
            bottom: 20 
          },
        },
      }
    }
    this.isLoading = false;    
    })
    this.sharedService.isDarkMode.subscribe((res) => {
      console.log(res);
      this.isDarkMode = res;      
    })
    let theme = localStorage.getItem('theme');
    if(theme === 'dark') {
      this.isDarkMode = true;
    } else {
      this.isDarkMode = false;
    }

  }

}
