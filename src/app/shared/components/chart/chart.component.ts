import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';

import { NavParams, ToastController, ViewDidEnter, ViewDidLeave } from '@ionic/angular';

import { Chart } from 'chart.js';

import 'chartjs-adapter-date-fns';

import { fromUnixTime, format } from 'date-fns';

import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ChartState } from '@app/core/states/chart.state';

import { ResponseType } from '@app/core/enums/http/response-type.enum';

import { getToast, responseFilter } from '@app/core/helpers/response-helpers';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements ViewDidEnter, ViewDidLeave {

  @ViewChild('chartContainer') chartContainer: ElementRef;

  public timestamp: string;

  private chart: any;
  private chartContainerPopover: any;
  private dataSubscription: Subscription = new Subscription();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
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

  public loadPreviousData() {
    if (this.chartState.dateOffset > 1) {
      this.chartState.decrementChartDateOffset();
      this.updateData(this.chartState.sliceOfData);
    }
  }

  public async loadData(): Promise<void> {
    this.chartState.incrementChartDateOffset();

    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const dataSubscription: Subscription = this.chartState.fetchThermometersData().pipe(
      filter(res =>
        responseFilter(toastInstance, res.status, ResponseType.Read, 'Thermometers data', true) && this.chart),
      map(res => res.body)
    )
    .subscribe(data => this.updateData(data));

    this.dataSubscription.add(dataSubscription);
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

    this.timestamp = format(fromUnixTime(data[0].timestamp), 'dd.MM');
    this.changeDetectorRef.markForCheck();

    this.chart = new Chart(this.chartContainer.nativeElement, {
      type: 'line',
      data: {
        labels,
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
              parser: value => fromUnixTime(value),
              unit: 'hour',
              displayFormats: {
                hour: 'HH:mm'
              }
            },
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

  private updateData(data: any[]): void {
    const dataKeys: string[] = Object.keys(data[0]);
    const labels: number[] = data.map(item => item[dataKeys[1]]);
    const values: any[] = data.map(item => item[dataKeys[0]]);

    this.timestamp = format(fromUnixTime(data[0].timestamp), 'dd.MM');
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = values;
    this.chart.update();
    this.changeDetectorRef.markForCheck();
  }

}
