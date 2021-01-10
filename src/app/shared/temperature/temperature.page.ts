import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';

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

import { getModal, getToast, responseFilter } from '@app/core/helpers/response-helpers';
import { FormControl } from '@app/core/models/form/form-control.model';
import { FormControlType } from '@app/core/enums/form/form-control-type.enum';

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

    const modal: HTMLIonModalElement = await getModal(
      this.modalController,
      [
        new FormControl(FormControlType.Text, 'name', sensor?.name, 'Name'),
        new FormControl(FormControlType.Text, 'sensor', sensor?.sensor, 'Sensor')
      ],
      sensorID === undefined ? 'Create a thermal sensor' : 'Edit a thermal sensor',
      sensorID === undefined ? 'Create' : 'Update'
    );
      
    modal.onWillDismiss().then(event => {
      event.data && sensorID === undefined
        ? this.createSensor(event.data)
        : this.updateSensor(event.data, sensorID);
    });
  
    await modal.present();
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
