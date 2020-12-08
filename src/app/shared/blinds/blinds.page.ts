import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SensorToggleDirection } from '@app/core/enums/data/sensor-toggle-direction.enum';
import { ResponseType } from '@app/core/enums/http/response-type.enum';
import { getToast, responseFilter } from '@app/core/helpers/response-helpers';
import { Blind } from '@app/core/models/blind/blind.model';
import { ChartState } from '@app/core/states/chart.state';
import { DataState } from '@app/core/states/data.state';
import { LocalState } from '@app/core/states/local.state';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SensorComponent } from '../sensor/sensor.component';

@Component({
  selector: 'app-blinds',
  templateUrl: '../sensor/sensor.component.html',
  styleUrls: [
    '../sensor/sensor.component.scss',
    'blinds.page.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlindsPage extends SensorComponent {

  constructor(
    protected alertController: AlertController,
    protected changeDetectorRef: ChangeDetectorRef,
    protected chartState: ChartState,
    protected dataState: DataState,
    protected dragulaService: DragulaService,
    protected localState: LocalState,
    protected popoverController: PopoverController,
    protected router: Router,
    protected toastController: ToastController,
  ) {
    super(
      alertController,
      changeDetectorRef,
      chartState,
      dataState,
      dragulaService,
      localState,
      router,
      toastController
    );
  }

  protected async presentAlertPrompt(sensorID?: number): Promise<void> {
    const sensor: Blind
      = <Blind>this.sensors.find(sensor => sensor.id === sensorID);
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
          name: 'inputUpPin',
          type: 'text',
          placeholder: 'Input Up Pin',
          value: sensor?.inputUpPin
        },
        {
          name: 'inputDownPin',
          type: 'text',
          placeholder: 'Input Down Pin',
          value: sensor?.inputDownPin
        },
        {
          name: 'outputUpPin',
          type: 'text',
          placeholder: 'Output Up Pin',
          value: sensor?.outputUpPin
        },
        {
          name: 'outputDownPin',
          type: 'text',
          placeholder: 'Output Down Pin',
          value: sensor?.outputDownPin
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            const blind: any = {
              name: data.name,
              inputUpPin: +data.inputUpPin,
              inputDownPin: +data.inputDownPin,
              outputUpPin: +data.outputUpPin,
              outputDownPin: +data.outputDownPin
            }

            sensorID === undefined
              ? this.createSensor(blind)
              : this.updateSensor(blind, sensorID);
          }
        }
      ]
    });

    await alert.present();
  }

  protected async toggleSensor(sensorID: number, event: SensorToggleDirection): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);

    const toggleSensorSubscription: Subscription = this.dataState.toggleSunblind(sensorID, event)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Toggle, 'Blind', false))
      )
      .subscribe();

    this.dataSubscription.add(toggleSensorSubscription);
  }

}
