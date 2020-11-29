import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SensorType } from '@app/core/enums/data/sensor-type.enum';
import { ResponseType } from '@app/core/enums/http/response-type.enum';
import { getToast, responseFilter } from '@app/core/helpers/response-helpers';
import { DataState } from '@app/core/states/data.state';
import { LocalState } from '@app/core/states/local.state';
import { AlertController, ToastController } from '@ionic/angular';
import { IonPullUpFooterState } from 'ionic-pullup';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { filter, map, skip } from 'rxjs/operators';
import { capitalize } from 'lodash-es';
import { Sensor } from '@app/core/models/sensor/sensor.model';
import { SensorInfo } from '@app/core/models/sensor/sensor-info.model';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss'],
})
export class SensorComponent implements OnInit, OnDestroy {
  protected readonly dragModel = 'SENSORS';

  public sensors: Sensor[] = [];
  public sensorType: SensorType;
  public tileMove = false;

  protected dataSubscription: Subscription = new Subscription();

  private footerState: IonPullUpFooterState;

  constructor(
    protected alertController: AlertController,
    protected changeDetectorRef: ChangeDetectorRef,
    protected dataState: DataState,
    protected dragulaService: DragulaService,
    protected localState: LocalState,
    protected toastController: ToastController,
  ) {}

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
    this.fetchSensors(true);
    this.addMenuListener();
    this.addTileDragListener();
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  public getSensorTitle(): string {
    return capitalize(this.sensorType)
  }

  public async fetchSensors(errorOnly = false, event?: any): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const sensorSubscription: Subscription = this.dataState.fetchSensors()
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Read, 'Sensors', errorOnly))
      )
      .subscribe(sensors => {
        this.sensors = sensors.body;
        this.changeDetectorRef.detectChanges();
        event?.target.complete();
      });

    this.dataSubscription.add(sensorSubscription);
  }

  public toggleFooter(): void {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed
      ? IonPullUpFooterState.Expanded
      : IonPullUpFooterState.Collapsed;
  }

  public onItemEdit(sensorID?: number): void {
    this.presentAlertPrompt(sensorID);
  }

  public async onItemDelete(id: number): Promise<void> {
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

  public async createSensor(sensorInfo: SensorInfo): Promise<void> {
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

  protected async fetchSensorData(sensorID: number) {}

  protected async presentAlertPrompt(sensorID?: number) {}

  private addMenuListener(): void {
    const itemMenuSubscription: Subscription = this.localState.state$.pipe(
      skip(1),
      map(state => state.sensorType),
      filter(sensorType => sensorType === this.sensorType)
    ).subscribe(_ => this.presentAlertPrompt());

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
