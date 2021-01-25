import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, ModalController, ToastController, ViewDidEnter, ViewDidLeave } from '@ionic/angular';

import { capitalize } from 'lodash-es';

import { DragulaService } from 'ng2-dragula';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ChartState } from '@app/core/states/chart.state';
import { DataState } from '@app/core/states/data.state';
import { LocalState } from '@app/core/states/local.state';

import { ResponseType } from '@app/core/enums/http/response-type.enum';
import { SensorToggleDirection } from '@app/core/enums/data/sensor/sensor-toggle-direction.enum';

import { Sensor } from '@app/core/models/sensor/sensor.model';

import { getModal, getToast, responseFilter } from '@app/core/helpers/response-helpers';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.page.html',
  styleUrls: ['./sensor.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorPage implements ViewDidEnter, ViewDidLeave {
  public readonly dragModel = 'SENSORS';

  public activeSensorID: number;
  public sensors: Sensor[] = [];
  public loaderVisible = false;
  public tileMove = false;

  protected dataSubscription: Subscription = new Subscription();

  constructor(
    public localState: LocalState,
    protected alertController: AlertController,
    protected changeDetectorRef: ChangeDetectorRef,
    protected chartState: ChartState,
    protected dataState: DataState,
    protected dragulaService: DragulaService,
    protected modalController: ModalController,
    protected router: Router,
    protected toastController: ToastController
  ) {}

  ionViewDidEnter() {
    this.dataSubscription = new Subscription();
    !this.sensors.length && this.fetchSensors(true);
    this.addMenuListener();
    this.addTileDragListener();
  }

  ionViewDidLeave() {
    this.dataSubscription.unsubscribe();
  }

  public getSensorTitle(): string {
    return capitalize(this.localState.sensorType);
  }

  public async fetchSensors(errorOnly = false, event?: any): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const sensorSubscription: Subscription = this.dataState.fetchSensors()
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Read, 'Sensors', errorOnly))
      )
      .subscribe(sensors => {
        this.activeSensorID = null;
        this.sensors = sensors.body;
        this.changeDetectorRef.detectChanges();
        event?.target.complete();
      });

    this.dataSubscription.add(sensorSubscription);
  }

  public editSensor(sensorID?: number): void {
    this.presentAlertPrompt(sensorID);
  }

  public async deleteSensor(id: number): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const deleteSensorSubscription: Subscription = this.dataState.deleteSensor(id)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Delete, 'Sensor'))
      )
      .subscribe(_ => this.fetchSensors());

    this.dataSubscription.add(deleteSensorSubscription);
  }

  public async onTileMove(orderedSensors: Sensor[]): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const orderedSensorIDs: number[] = orderedSensors.map(sensor => sensor.id);
    const changeOrderSubscription: Subscription = this.dataState.changeSensorsOrder(orderedSensorIDs)
      .pipe(
        filter(res => {
          return responseFilter(toastInstance, res.status, ResponseType.Update, 'Order', true);
        })
      )
      .subscribe(_ => this.fetchSensors());

    this.dataSubscription.add(changeOrderSubscription);
    this.tileMove = false;
    this.changeDetectorRef.detectChanges();
  }

  public async createSensor(sensorInfo: any): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const createSensorSubscription: Subscription = this.dataState.createSensor(sensorInfo)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Create, 'Sensor'))
      )
      .subscribe(_ => this.fetchSensors());

    this.dataSubscription.add(createSensorSubscription);
  }

  public async updateSensor(sensor: Sensor, id: number): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const editedSensor: Sensor = this.sensors
      .find(sensor => sensor.id === id);
    const updatedSensor: Sensor = { ...editedSensor, ...sensor }

    const updateThermometerSubscription: Subscription = this.dataState.updateSensor(updatedSensor)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Update, 'Sensor'))
      )
      .subscribe(_ => this.fetchSensors());

    this.dataSubscription.add(updateThermometerSubscription);
  }

  public getSensorLoaderState(sensorID: number): boolean {
    return this.chartState.selectedID === sensorID && this.loaderVisible;
  }

  public async fetchSensorData(sensorID: number): Promise<void> {}
  public async toggleSensor(sensorID: number, event?: SensorToggleDirection): Promise<void> {}

  protected async presentSensorDeleteModal(sensorID: number): Promise<void> {
    const modal: HTMLIonModalElement = await getModal(
      this.modalController,
      [],
      'Are you sure?',
      false,
      'Delete',
      'danger'
    );
    
    modal.onWillDismiss().then(event => {
      event.data && this.deleteSensor(sensorID);
    });

    await modal.present();
  }

  protected async presentAlertPrompt(sensorID?: number): Promise<void> {}

  private addMenuListener(): void {
    const itemMenuSubscription: Subscription = this.dataState.menuOpened$
      .subscribe(_ => {
        this.presentAlertPrompt()
      });

    this.dataSubscription.add(itemMenuSubscription);
  }

  private addTileDragListener(): void {
    const tileDragSubscription: Subscription = this.dragulaService.drag(this.dragModel)
      .subscribe(_ => {
        this.tileMove = true;
        this.changeDetectorRef.detectChanges();
      });
    
    this.dataSubscription.add(tileDragSubscription);
  }

}
