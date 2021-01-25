import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';

import { DragulaService } from 'ng2-dragula';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ChartState } from '@app/core/states/chart.state';
import { DataState } from '@app/core/states/data.state';
import { LocalState } from '@app/core/states/local.state';

import { SensorPage } from '@app/core/components/sensor/sensor.page';

import { FormControlType } from '@app/core/enums/form/form-control-type.enum';
import { ResponseType } from '@app/core/enums/http/response-type.enum';
import { SensorToggleDirection } from '@app/core/enums/data/sensor/sensor-toggle-direction.enum';

import { Blind } from '@app/core/models/sensor/blind/blind.model';
import { FormControl } from '@app/core/models/form/form-control.model';

import { getModal, getToast, responseFilter } from '@app/core/helpers/response-helpers';

@Component({
  selector: 'app-sunblind',
  templateUrl: '../../../core/components/sensor/sensor.page.html',
  styleUrls: ['../../../core/components/sensor/sensor.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlindsPage extends SensorPage {

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
    const sensor: Blind
      = <Blind>this.sensors.find(sensor => sensor.id === sensorID);

    const modal: HTMLIonModalElement = await getModal(
      this.modalController,
      [
        new FormControl(FormControlType.Text, 'name', sensor?.name, 'Name'),
        new FormControl(FormControlType.Text, 'inputUpPin', sensor?.inputuppin, 'Input Up Pin'),
        new FormControl(FormControlType.Text, 'inputDownPin', sensor?.inputdownpin, 'Input Down Pin'),
        new FormControl(FormControlType.Text, 'outputUpPin', sensor?.outputuppin, 'Output Up Pin'),
        new FormControl(FormControlType.Text, 'outputDownPin', sensor?.outputdownpin, 'Output Down Pin')
      ],
      sensorID === undefined ? 'Create a blind sensor' : 'Edit a blind sensor'
    );
      
    modal.onWillDismiss().then(event => {
      if (event.data) {
        const blind: any = {
          name: event.data.name,
          inputUpPin: +event.data.inputUpPin,
          inputDownPin: +event.data.inputDownPin,
          outputUpPin: +event.data.outputUpPin,
          outputDownPin: +event.data.outputDownPin
        };
  
        sensorID === undefined
          ? this.createSensor(blind)
          : this.updateSensor(blind, sensorID);
      }
    });
  
    await modal.present();
  }

  public async toggleSensor(sensorID: number, event: SensorToggleDirection): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);

    const toggleSensorSubscription: Subscription = this.dataState.toggleSunblind(sensorID, event)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Toggle, 'Blind', false))
      )
      .subscribe();

    this.dataSubscription.add(toggleSensorSubscription);
  }

}
