import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, PopoverController, ToastController } from '@ionic/angular';

import { DragulaService } from 'ng2-dragula';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ChartState } from '@app/core/states/chart.state';
import { DataState } from '@app/core/states/data.state';
import { LocalState } from '@app/core/states/local.state';

import { ResponseType } from '@app/core/enums/http/response-type.enum';

import { SensorPage } from '@app/shared/sensor/sensor.page';

import { Light } from '@app/core/models/light/light.model';

import { getToast, responseFilter } from '@app/core/helpers/response-helpers';

@Component({
  selector: 'app-light',
  templateUrl: '../sensor/sensor.page.html',
  styleUrls: ['../sensor/sensor.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightsPage extends SensorPage {

  constructor(
    public localState: LocalState,
    protected alertController: AlertController,
    protected changeDetectorRef: ChangeDetectorRef,
    protected chartState: ChartState,
    protected dataState: DataState,
    protected dragulaService: DragulaService,
    protected popoverController: PopoverController,
    protected router: Router,
    protected toastController: ToastController,
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

  protected async presentAlertPrompt(sensorID?: number): Promise<void> {
    const sensor: Light
      = <Light>this.sensors.find(sensor => sensor.id === sensorID);
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
          name: 'inputPin',
          type: 'text',
          placeholder: 'Input Pin',
          value: sensor?.inputPin
        },
        {
          name: 'outputPin',
          type: 'text',
          placeholder: 'Output Pin',
          value: sensor?.outputPin
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

  public async toggleSensor(sensorID: number): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);

    const toggleSensorSubscription: Subscription = this.dataState.toggleLight(sensorID)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Toggle, 'Light', false))
      )
      .subscribe();

    this.dataSubscription.add(toggleSensorSubscription);
  }

}
