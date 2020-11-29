import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';

import { DragulaService } from 'ng2-dragula';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DataState } from '@app/core/states/data.state';

import { ResponseType } from '@app/core/enums/http/response-type.enum';

import { Thermometer } from '@app/core/models/temperature/thermometer.model';
import { ChartComponent } from '../chart/chart.component';
import { ChartState } from '@app/core/states/chart.state';
import { getToast, responseFilter } from '@app/core/helpers/response-helpers';
import { SensorComponent } from '../sensor/sensor.component';
import { LocalState } from '@app/core/states/local.state';
import { SensorType } from '@app/core/enums/data/sensor-type.enum';

@Component({
  selector: 'app-temperature',
  templateUrl: '../sensor/sensor.component.html',
  styleUrls: [
    '../sensor/sensor.component.scss',
    'temperature.page.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemperaturePage extends SensorComponent implements OnInit {

  constructor(
    protected alertController: AlertController,
    protected changeDetectorRef: ChangeDetectorRef,
    protected chartState: ChartState,
    protected dataState: DataState,
    protected dragulaService: DragulaService,
    protected localState: LocalState,
    protected popoverController: PopoverController,
    protected toastController: ToastController,
  ) {
    super(
      alertController,
      changeDetectorRef,
      dataState,
      dragulaService,
      localState,
      toastController
    );
    
    this.sensorType = SensorType.Temperature;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected async fetchSensorData(sensorID: number): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const thermometer: Thermometer
      = <Thermometer>this.sensors.find(sensor => sensor.id === sensorID);

    this.chartState.setSelectedID(sensorID);

    const thermometerDataSubscription: Subscription = this.chartState.fetchThermometersData(sensorID)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Read, 'Thermometers data', true))
      )
      .subscribe(res => this.presentPopover(`${thermometer.name} temperature`, res.body));

    this.dataSubscription.add(thermometerDataSubscription);
  }
  
  protected async presentAlertPrompt(sensorID?: number): Promise<void> {
    const sensor: Thermometer
      = <Thermometer>this.sensors.find(sensor => sensor.id === sensorID);
    const alert: HTMLIonAlertElement = await this.alertController.create({
      cssClass: 'alert-container',
      header: sensorID === undefined ? 'Create a sensor' : 'Edit a sensor',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name',
          value: sensor?.name
        },
        {
          name: 'sensor',
          type: 'text',
          placeholder: 'Sensor',
          value: sensor?.sensor
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => sensorID === undefined
            ? this.createSensor(data)
            : this.updateSensor(data, sensorID)
        }
      ]
    });

    await alert.present();
  }

  private async presentPopover(title: string, data: any[]): Promise<void> {
    const popover: HTMLIonPopoverElement = await this.popoverController.create({
      component: ChartComponent,
      componentProps: { label: title, data },
      cssClass: 'popover-container',
      translucent: true
    });

    popover.onDidDismiss().then(_ => {
      this.chartState.reset();
    });

    await popover.present();
  }

}
