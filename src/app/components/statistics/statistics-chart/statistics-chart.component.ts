import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LearnStatisticsChart, ListLearnStatisticsChartRequest } from 'src/app/interfaces/learn-statistics.interface';
import { LearnStatisticsService } from 'src/app/services/learn-statistics.service';

@Component({
  selector: 'app-statistics-chart',
  templateUrl: './statistics-chart.component.html',
  styleUrls: ['./statistics-chart.component.css']
})
export class StatisticsChartComponent implements OnInit {
  quantity: number = 10;
  statistics: LearnStatisticsChart = {} as LearnStatisticsChart;
  chartData: any;
  chartOptions: any;

  constructor(
    private statisticsService: LearnStatisticsService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.listStatistics();
  }

  // list statics for diagram
  listStatistics() {
    // Initialize the serviceRequest object
    const serviceRequest: ListLearnStatisticsChartRequest = {
      quantity: this.quantity
    };

    this.statisticsService.listForChart(serviceRequest).subscribe({
      next: statistics => {
        this.statistics = statistics;
        this.setChart();
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  //numeric input change detection
  handleInput(event: any) {
    const value = event.value;
    if(value >= 500){
      this.quantity = 500;
      return;
    }

    this.quantity = value;
    this.listStatistics();
  }

  //Set chart
  setChart() {
    //Set colors
    const textColor = 'black';
    const textColorSecondary = 'black';
    const surfaceBorder = 'black';
    const flashcardColor = 'green';
    const typingColor = 'purple';
    const selectionColor = 'red';
    const listeningColor = 'blue';

    //Set chart data
    this.chartData = {
      labels: this.statistics?.chartLabel,
      datasets: [
        {
          label: this.translate.instant('Flashcard'),
          data: this.statistics.flashcardChartData,
          fill: false,
          borderColor: flashcardColor,
          tension: 0.4
        },
        {
          label: this.translate.instant('Typing'),
          data: this.statistics.typingChartData,
          fill: false,
          borderColor: typingColor,
          tension: 0.4
        },
        {
          label:this.translate.instant('Selection'),
          data: this.statistics.selectionChartData,
          fill: false,
          borderColor: selectionColor,
          tension: 0.4
        },
        {
          label: this.translate.instant('Listening'),
          data: this.statistics.listeningChartData,
          fill: false,
          borderColor: listeningColor,
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          title: {
            display: true,
            text: '%',
            color: textColorSecondary
          },
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}

