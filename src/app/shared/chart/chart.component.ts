import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { NavParams, ViewDidEnter } from '@ionic/angular';

import { Chart } from 'chart.js';
import { format } from 'date-fns';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements ViewDidEnter {

  @ViewChild('chartContainer') chartContainer: ElementRef;

  private chartContainerPopover: any;

  constructor(
    private elementRef: ElementRef,
    private navParams: NavParams
  ) {}

  ionViewDidEnter() {
    this.chartContainerPopover = this.elementRef.nativeElement.parentElement;
    this.setChartGlobals();
    this.setChartContainerWidth();
    this.createChart();
  }

  private setChartContainerWidth(): void {
    const { height, width } = this.chartContainerPopover;
    this.chartContainer.nativeElement.height = height;
    this.chartContainer.nativeElement.width = width;
  }

  private setChartGlobals(): void {
    const popoverComputedStyles: CSSStyleDeclaration = getComputedStyle(this.chartContainerPopover);
    const primaryColor: string = popoverComputedStyles.getPropertyValue('--ion-color-primary-rgb');
    const textColor: string = popoverComputedStyles.getPropertyValue('--ion-text-color-rgb');

    Chart.defaults.global.defaultFontColor = `rgba(${textColor}, 0.6)`;
    Chart.defaults.global.defaultFontFamily = 'Source Sans Pro';
    Chart.defaults.global.elements.line.backgroundColor = `rgba(${primaryColor}, 0.6)`;
  }

  private createChart(): void {
    const data: any[] = this.navParams.get('data');
    const label: string = this.navParams.get('label');

    const dataKeys: string[] = Object.keys(data[0]);
    const labels: string[] = data.map(item => format(new Date(item[dataKeys[1]]), 'HH:mm'));
    const values: any[] = data.map(item => item[dataKeys[0]]);

    new Chart(this.chartContainer.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          borderWidth: 0,
          data: values,
          label,
          pointRadius: 0
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              callback: value => `${value} °C`
            }
          }]
        }
      }
    });
  }

}
