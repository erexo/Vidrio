import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { ResponseType } from '@app/core/enums/http/response-type.enum';
import { getToast, responseFilter } from '@app/core/helpers/response-helpers';
import { ChartState } from '@app/core/states/chart.state';
import { NavParams, ToastController, ViewDidEnter, ViewDidLeave } from '@ionic/angular';

import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements ViewDidEnter, ViewDidLeave {

  @ViewChild('chartContainer') chartContainer: ElementRef;

  private chart: any;
  private chartContainerPopover: any;
  private dataSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private chartState: ChartState,
    private elementRef: ElementRef,
    private navParams: NavParams,
    private toastController: ToastController
  ) {}

  ionViewDidEnter() {
    this.chartContainerPopover = this.elementRef.nativeElement.parentElement;
    this.setChartGlobals();
    this.setChartContainerWidth();
    this.createChart();
  }

  ionViewDidLeave() {
    this.chart.destroy();
    this.dataSubscription.unsubscribe();
  }

  public async onChartSwipe(): Promise<void> {
    this.chartState.incrementChartDateOffset();

    const pageName: string[] = this.router.url.split('/');
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const chartDataSubscription: Subscription = this.chartState.fetchData(pageName[pageName.length - 1]).pipe(
      filter(res =>
        responseFilter(toastInstance, res.status, ResponseType.Read, 'Thermometers data', true) && this.chart),
      map(res => res.body)
    )
    .subscribe(data => {
      const dataKeys: string[] = Object.keys(data[0]);
      const labels: number[] = data.map(item => item[dataKeys[1]]);
      const values: any[] = data.map(item => item[dataKeys[0]]);

      this.prependData(this.chart, labels, values);
    });

    this.dataSubscription.add(chartDataSubscription);
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
    const labels: number[] = data.map(item => item[dataKeys[1]]);
    const values: any[] = data.map(item => item[dataKeys[0]]);

    this.chart = new Chart(this.chartContainer.nativeElement, {
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
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                second: 'D h:mm'
              }
            }
          }],
          yAxes: [{
            ticks: {
              callback: value => `${value} °C`
            }
          }]
        }
      }
    });
  }

  private prependData(chart: any, label: any[], data: any[]): void {
    chart.data.labels.unshift(...label);
    chart.data.datasets.forEach(dataset => dataset.data.unshift(...data));
    chart.update();
  }

}
