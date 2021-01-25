import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';

import { DragulaService } from 'ng2-dragula';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ChartState } from '@core/states/chart.state';
import { DataState } from '@core/states/data.state';
import { LocalState } from '@core/states/local.state';

import { SensorPage } from '@core/components/sensor/sensor.page';

import { FormControlType } from '@core/enums/form/form-control-type.enum';
import { ResponseType } from '@core/enums/http/response-type.enum';
import { SensorToggleDirection } from '@core/enums/data/sensor/sensor-toggle-direction.enum';

import { FormControl } from '@core/models/form/form-control.model';
import { Light } from '@core/models/sensor/light/light.model';

import { getModal, getToast, responseFilter } from '@core/helpers/response-helpers';

@Component({
  selector: 'app-light',
  templateUrl: '../../../core/components/sensor/sensor.page.html',
  styleUrls: ['../../../core/components/sensor/sensor.page.scss'],
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
    protected modalController: ModalController,
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
      modalController,
      router,
      toastController
    );
  }

  protected async presentAlertPrompt(sensorID?: number): Promise<void> {
    const sensor: Light
      = <Light>this.sensors.find(sensor => sensor.id === sensorID);

    const modal: HTMLIonModalElement = await getModal(
      this.modalController,
      [
        new FormControl(FormControlType.Text, 'name', sensor?.name, 'Name'),
        new FormControl(FormControlType.Text, 'inputUpPin', sensor?.inputpin, 'Input Pin'),
        new FormControl(FormControlType.Text, 'inputDownPin', sensor?.outputpin, 'Output Pin')
      ],
      sensorID === undefined ? 'Create a light sensor' : 'Edit a light sensor'
    );
      
    modal.onWillDismiss().then(event => {
      if (event.data) {
        sensorID === undefined
          ? this.createSensor(event.data)
          : this.updateSensor(event.data, sensorID);
      }
    });
  
    await modal.present();
  }

  public async toggleSensor(sensorID: number, event?: SensorToggleDirection): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);

    const toggleSensorSubscription: Subscription = this.dataState.toggleLight(sensorID)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Toggle, 'Light', false))
      )
      .subscribe();

    this.dataSubscription.add(toggleSensorSubscription);
  }

}
