import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { Colors, layouts, Legend, scales } from 'chart.js';
import { SharedService } from '../Services/shared.service';
import { TripService } from '../Services/trip.service';
import { map } from 'rxjs';
import * as d3 from 'd3';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
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
  d3GraphData = [];

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
    // Wait until DOM is updated
      setTimeout(() => {
        this.createD3BarGraphSvg();
        this.drawD3Bars();
        this.created3LineChart();
        this.drawD3Lines(this.d3GraphData);
      }, 0);
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
        this.d3GraphData.push({name: trip, value: expense});
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
      console.log(graphDatas);
      console.log(this.d3GraphData);            
      return graphDatas;
    })).subscribe((res) => {
      console.log(res);
      // this.userTrips = res[0];
      // this.userExpenses = res[1];
      console.log(this.userTrips);
      console.log(this.userExpenses);

      setTimeout(() => {
        this.createD3BarGraphSvg();
        this.drawD3Bars();
        console.log(this.d3GraphData);
      },0)      

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
        legend: { 
          labels : {
            // color: this.isDarkMode ? '#fff' : '#000'
          }
         },
        title: {
          display: true,
          text: 'Trip Vs Expense',
          // color: this.isDarkMode ? 'white' : 'black',
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

  ngAfterViewInit(): void {
    // setTimeout(() => {
      // this.createD3BarGraphSvg();
      // this.drawD3Bars(this.d3GraphData);
      // console.log(this.d3GraphData);
    // },500)
      
  }

  private barGraphSvg: any;
  private barGraphG: any
  private lineBarSvg: any;
  private lineBarG: any;
  private pieChartSvg: any;
  private pieChartG: any;

  private xAxisGroup: any;
  private yAxisGroup: any;

  width = 1000;
  height = Math.min(this.width, 420);
  marginTop = 20;
  marginRight = 20;
  marginBottom = 30;
  marginLeft = 70;

  //Dymanic width and height based on srceen size

  private chartWidth = 0;
  private chartHeight = 400;

  //getting the reference of the ElementRef

  elementRef: ElementRef = inject(ElementRef);

  @HostListener('window: resize', ['$event'])
  onResize(event: any) {
    this.updateDimentions();
    this.createD3BarGraphSvg();
    this.drawD3Bars();
  }

  updateDimentions() {
    const constiner =this.elementRef.nativeElement.querySelector("#d3-barGraph");
    if(constiner) {
      this.chartWidth = constiner.clientWidth - this.marginLeft - this.marginRight;
      // this.chartHeight = constiner.clientHeight - this.marginTop - this.marginBottom;

      if(this.chartWidth < 475) this.chartWidth = 500;
      // if(this.chartHeight < 0) this.chartHeight = 0;
    }
  }

  createD3BarGraphSvg() {
    this.updateDimentions();

    const container = d3.select(this.elementRef.nativeElement).select("#d3-barGraph");

    container.select("svg").remove();

    this.barGraphSvg = container.append('svg')
                        .attr("width", this.chartWidth + this.marginLeft + this.marginRight)
                        .attr("height", this.chartHeight + this.marginTop + this.marginBottom + 50);
    this.barGraphG = this.barGraphSvg.append("g")
      .attr("transform", `translate(${this.marginLeft}, ${this.marginTop})`);

    this.xAxisGroup = this.barGraphG.append('g').attr("class", "x-axis");
    this.yAxisGroup = this.barGraphG.append('g').attr("class", "y-axis");

    this.barGraphSvg.append("text")
      .attr("class", "x-axis-label")
      .attr("x", this.chartWidth / 2 + 20)
      .attr("y", this.chartHeight + 80)
      .attr("text-anchor", "middle")
      .text("Trips");

    this.barGraphSvg.append("text")
      .attr("class", "y-axis-label")
      .attr("x", -this.chartHeight / 2)
      .attr("y", this.marginLeft - 50) // Adjust so it sits left of the y axis
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Total Expense");
    
    // this.barGraphSvg = d3.select("#d3-barGraph")
    //   .append('svg')
    //   .attr("width", this.width)
    //   .attr("height", this.height + 50)
    //   .append("g")
    //   .attr("transform", `translate(${this.marginLeft}, ${this.marginTop})`);
  }

  drawD3Bars() {
      console.log(this.d3GraphData);  
    if(!this.d3GraphData || this.d3GraphData.length === 0) {
      this.barGraphG.selectAll('*').remove();
      return;
    }    

    this.updateDimentions();

    const x = d3.scaleBand()
              .range([0,this.chartWidth])
              .domain(this.d3GraphData.map((_,i) => i.toString()))
              .padding(0.2);

    const y = d3.scaleLinear()
                .domain([0, d3.max(this.d3GraphData, d => d.value)!])
                .range([this.chartHeight, 0]);

    this.xAxisGroup
      .attr("transform", `translate(0, ${this.chartHeight})`)
      .call(d3.axisBottom(x).tickFormat(i => this.d3GraphData[+i].name))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
    
    // this.barGraphSvg.remove("text");
    let xAxisLabel = this.barGraphSvg.select(".x-axis-label")
    // if(xAxisLabel.empty()) {
    //   xAxisLabel = this.barGraphG.append("taxt")
    //     .attr("class", "x-axis-label")
    // }
    console.log(xAxisLabel);
    if(xAxisLabel) {
      xAxisLabel
      .attr("x", this.chartWidth / 2 + 20)
      .attr("y", this.chartHeight + 80)
      .attr("text-anchor", "middle")
      .text("Trips");
    }    
    

    this.yAxisGroup
      .call(d3.axisLeft(y));

    // this.barGraphSvg.append("text")
    //   .attr("class", "y-axis-label")
    //   .attr("x", -this.chartHeight / 2)
    //   .attr("y", this.marginLeft - 50) // Adjust so it sits left of the y axis
    //   .attr("transform", "rotate(-90)")
    //   .attr("text-anchor", "middle")
    //   .text("Total Expense");

    const bars = this.barGraphG.selectAll(".bar")
      .data(this.d3GraphData, d => d.name);

    const tooltip = d3.select("#d3-barGraph").select(".tooltip");
    
    bars.enter().append("rect")
      .attr("class", "bar")
      .attr("x", (_,i) => x(i.toString())!)
      .attr("width", x.bandwidth())
      .attr("y", y(0))
      .attr("height", 0)
      .attr("fill", "#87C296")
      .on("mouseover", (event, d) => {
        const rect = event.target as SVGRectElement;
        const bbox = rect.getBoundingClientRect();
        const containerBBox = (document.querySelector("#d3-barGraph") as HTMLElement).getBoundingClientRect();
        d3.select(event.currentTarget as SVGElement)
          .attr("fill", "#35f334");
        
        tooltip.style("opacity", 1)
          .style("left", `${bbox.x -containerBBox.x + bbox.width / 2 + 5}px`)
          .style("top", `${bbox.y - containerBBox.y - 25}px`);
          d3.select(".tooltip")
            .select("#name").text(d.name);
          d3.select(".tooltip")
            .select("#value").text(d.value);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget as SVGElement).attr("fill", "#87C296");
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(500)
      .attr("y", d => y(d.value))
      .attr("height", d => this.chartHeight - y(d.value));
  }

  created3LineChart() {
    this.lineBarSvg = d3.select("#d3-lineChart")
    .append('svg')
    .attr("width", this.width)
    .attr("height", this.height + 50)
    .append("g")
    .attr("transform", `translate(${this.marginLeft}, ${this.marginTop})`);
  }

  drawD3Lines(data: any[]) {
    console.log(data);
    
    const chartWidth = this.width - this.marginLeft - this.marginRight;
    const chartHeight = this.height - this.marginTop - this.marginBottom;

    this.lineBarSvg.selectAll("*").remove();

    const x = d3.scaleBand()
    .range([0, chartWidth])
    .domain(data.map((_,i) => i.toString()))
    .padding(0.2);

    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)!])
    .range([chartHeight, 0]);

    this.lineBarSvg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(x)
      .tickFormat(i => data[+i].name)
    )
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

    this.lineBarSvg.append("text")
    .attr("class", "x-axis-label")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + 70)
    .attr("text-anchor", "middle")
    .text("Trips");

    this.lineBarSvg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

      // Add Y axis label
  this.lineBarSvg.append("text")
    .attr("class", "y-axis-label")
    .attr("x", -chartHeight / 2)
    .attr("y", -this.marginLeft + 20) // Adjust so it sits left of the y axis
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Total Expense");

    // Line generator uses index for x position
  const line = d3.line<{ name: string; value: number }>()
    .x((_, i) => x(i.toString())!)
    .y(d => y(d.value));

    // Draw the line path
  this.lineBarSvg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#87C296")
    .attr("stroke-width", 2)
    .attr("d", line);

    const tooltip = d3.select("#d3-lineChart").select(".tooltip");

    // Draw points
  this.lineBarSvg.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (_, i) => x(i.toString())!)
    .attr("cy", d => y(d.value))
    .attr("r", 4)
    .attr("fill", "#87C296")
    .on("mouseover", (event, d) => {
      const circle = event.target as SVGCircleElement;
      const circleBBox = circle.getBoundingClientRect();
      const containerBBox = (document.querySelector('#d3-lineChart') as HTMLElement).getBoundingClientRect();

      tooltip.style("opacity",.8)
      .style("left", `${circleBBox.x - containerBBox.x + circleBBox.width / 2 + 7}px`)
      .style("top", `${circleBBox.y - containerBBox.y - 20}px`);

      d3.select(".tooltip")
        .select('#name').text(d.name);
      d3.select(".tooltip")
        .select('#value').text(d.value);
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    })
  }

}
