import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';

import { IonPullUpFooterState } from 'ionic-pullup';

import { DragulaService } from 'ng2-dragula';

import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { DataState } from '@app/core/states/data.state';

import { HTTPStatusCode } from '@app/core/enums/http/http-status-code.enum';
import { ResponseType } from '@app/core/enums/http/response-type.enum';

import { Thermometer } from '@app/core/models/temperature/thermometer.model';
import { ThermometerData } from '@app/core/models/temperature/thermometer-data.model';
import { ThermometerInfo } from '@app/core/models/temperature/thermometer-info.model';
import { IThermometerData } from '@app/core/interfaces/temperature/thermometer-data.interface';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-temperature',
  templateUrl: 'temperature.page.html',
  styleUrls: ['temperature.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemperaturePage implements OnInit, OnDestroy {
  public readonly dragModel = 'THERMOMETERS';

  public footerState: IonPullUpFooterState;
  public selectedThermometerID: number;
  public thermometers: Thermometer[] = [];
  public tileMove = false;

  private dataSubscription: Subscription = new Subscription();

  constructor(
    private alertController: AlertController,
    private changeDetectorRef: ChangeDetectorRef,
    private dataState: DataState,
    private dragulaService: DragulaService,
    private popoverController: PopoverController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
    this.fetchData(true);
    this.addMenuListener();
    this.addTileDragListener();
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  public fetchData(errorOnly = false, event?: any): void {
    const thermometerSubscription: Subscription = this.dataState.fetchThermometers()
      .pipe(
        filter(res => this.responseFilter(res.status, ResponseType.Read, 'Thermometers', errorOnly))
      )
      .subscribe(thermometers => {
        this.thermometers = thermometers.body;
        this.changeDetectorRef.detectChanges();
        event?.target.complete();
      });

    this.dataSubscription.add(thermometerSubscription);
  }

  public toggleFooter(): void {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed
      ? IonPullUpFooterState.Expanded
      : IonPullUpFooterState.Collapsed;
  }

  public onItemDoubleTapped(id: number): void {
    const thermometer: Thermometer
      = this.thermometers.find(thermometer => thermometer.id === id);

    if (thermometer.celsius === null) {
      this.selectedThermometerID = null;
      return;
    }

    const startDate = Math.round((Date.now() - 86400000) / 1000);
    const endDate = Math.round(Date.now() / 1000);

    this.selectedThermometerID = id;

    const thermometerData = new ThermometerData(id, startDate, endDate);
    const thermometerDataSubscription: Subscription = this.dataState.getThermometersData(thermometerData)
      .pipe(
        filter(res => this.responseFilter(res.status, ResponseType.Read, 'Thermometers data', true))
      )
      .subscribe(res => {
        this.selectedThermometerID = null;
        this.presentPopover(res.body);
        this.changeDetectorRef.markForCheck();
      });

    this.dataSubscription.add(thermometerDataSubscription);
  }

  public onItemEdit(id: number): void {
    this.presentAlertPrompt(id);
  }

  public onItemDelete(id: number): void {
    const deleteThermometerSubscription: Subscription = this.dataState.deleteThermometer(id)
      .pipe(
        filter(res => this.responseFilter(res.status, ResponseType.Delete, 'Thermometer'))
      )
      .subscribe(_ => this.fetchData());

    this.dataSubscription.add(deleteThermometerSubscription);
  }

  public onTileMove(orderedThermometers: Thermometer[]): void {
    const orderedThermometerIDs: number[] = orderedThermometers.map(thermometer => thermometer.id);
    const changeOrderSubscription: Subscription = this.dataState.changeThermometersOrder(orderedThermometerIDs)
      .pipe(
        filter(res => this.responseFilter(res.status, ResponseType.Update, 'Order', true))
      )
      .subscribe(_ => this.fetchData());

    this.dataSubscription.add(changeOrderSubscription);
    this.tileMove = false;
    this.changeDetectorRef.detectChanges();
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      color: 'light',
      cssClass: 'toast',
      duration: 2000,
      message,
      translucent: true
    });
    toast.present();
  }

  private async presentAlertPrompt(id?: number): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'alert-container',
      header: id === undefined ? 'Create a thermometer' : 'Edit a thermometer',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name'
        },
        {
          name: 'sensor',
          type: 'text',
          placeholder: 'Sensor'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => id === undefined
            ? this.createThermometer(data)
            : this.updateThermometer(data, id)
        }
      ]
    });

    alert.onDidDismiss().then(_ => {
      this.dataState.itemMenuOpened(null);
    });

    await alert.present();
  }

  private async presentPopover(data: IThermometerData[]): Promise<void> {
    const popover = await this.popoverController.create({
      component: ChartComponent,
      componentProps: { label: 'Temperature Chart', data },
      cssClass: 'popover-container',
      translucent: true
    });

    await popover.present();
  }

  private addMenuListener(): void {
    const itemMenuSubscription: Subscription = this.dataState.state$.pipe(
      map(state => state.itemMenu),
      filter(itemMenu => itemMenu === 'temperature')
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

  private createThermometer(data: ThermometerInfo): void {
    const createThermometerSubscription: Subscription = this.dataState.createThermometer(data)
      .pipe(
        filter(res => this.responseFilter(res.status, ResponseType.Create, 'Thermometer'))
      )
      .subscribe(_ => this.fetchData());

    this.dataSubscription.add(createThermometerSubscription);
  }

  private updateThermometer(data: ThermometerInfo, id: number): void {
    const editedThermometer: Thermometer = this.thermometers
      .find(thermometer => thermometer.id === id);
    const updatedThermometer: Thermometer = { ...editedThermometer, ...data }

    const updateThermometerSubscription = this.dataState.updateThermometer(updatedThermometer)
      .pipe(
        filter(res => this.responseFilter(res.status, ResponseType.Update, 'Thermometer'))
      )
      .subscribe(_ => this.fetchData());

    this.dataSubscription.add(updateThermometerSubscription);
  }

  private responseFilter(status: HTTPStatusCode, responseType: ResponseType, dataType: string, errorOnly = false): boolean {
    if (status === HTTPStatusCode.OK || status === HTTPStatusCode.Accepted) {
      !errorOnly && this.presentToast(`${dataType} ${responseType}`);
      return true;
    }
    
    this.presentToast(`${dataType} could not be ${responseType} (Status Code: ${status})`);
    return false;
  }

}
