import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, PopoverController, ToastController } from '@ionic/angular';

import { DragulaService } from 'ng2-dragula';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ChartState } from '@app/core/states/chart.state';
import { DataState } from '@app/core/states/data.state';
import { LocalState } from '@app/core/states/local.state';

import { SensorPage } from '@app/shared/sensor/sensor.page';

import { ResponseType } from '@app/core/enums/http/response-type.enum';

import { Thermometer } from '@app/core/models/temperature/thermometer.model';

import { ChartComponent } from '@app/shared/chart/chart.component';

import { getToast, responseFilter } from '@app/core/helpers/response-helpers';

@Component({
  selector: 'app-thermal',
  templateUrl: '../sensor/sensor.page.html',
  styleUrls: ['../sensor/sensor.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemperaturePage extends SensorPage {

  constructor(
    public localState: LocalState,
    protected alertController: AlertController,
    protected changeDetectorRef: ChangeDetectorRef,
    protected chartState: ChartState,
    protected dataState: DataState,
    protected dragulaService: DragulaService,
    protected popoverController: PopoverController,
    protected router: Router,
    protected toastController: ToastController
  ) {
    super(
      localState,
      alertController,
      changeDetectorRef,
      chartState,
      dataState,
      dragulaService,
      router,
      toastController
    );
  }

  public async fetchSensorData(sensorID: number): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const thermometer: Thermometer
      = <Thermometer>this.sensors.find(sensor => sensor.id === sensorID);

    this.loaderVisible = true;
    this.changeDetectorRef.markForCheck();
    this.chartState.setSelectedID(sensorID);

    const thermometerDataSubscription: Subscription = this.chartState.fetchThermometersData()
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Read, 'Thermometers data', true))
      )
      .subscribe(res => {
        this.loaderVisible = false;
        this.changeDetectorRef.markForCheck();
        this.presentPopover(`${thermometer.name} temperature`, res.body);
      });

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
