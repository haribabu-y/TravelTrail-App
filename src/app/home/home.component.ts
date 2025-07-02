import { Component, OnInit } from '@angular/core';
import { Colors, layouts, Legend, scales } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  data: any;
  options: any;

  selectedRadio = 'barGraph';

  onRadioChange(value: string){
    this.selectedRadio = value;
  }

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['A-B', 'B-C', 'C-D', 'D-E', 'E-F', 'F-G', 'G-H', 'H-I', 'I-J', 'J-K', 'K-L', 'L-M', 'M-N', 'N-O', 'O-P'],
      datasets: [
        {
          // label: 'my Dataset',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40, 75,65,98,23,76,56,87,37]
        }
      ]
    };
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      layouts: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 50
        }
      },
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
            color: surfaceBorder,
            drawBorder: false,
            drawOnChartArea: false,    
            display: false  
          },
          title: {
            display: true,
            text: 'Trip'
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
            drawOnChartArea: false,
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
    console.log(this.options);
  }
}
