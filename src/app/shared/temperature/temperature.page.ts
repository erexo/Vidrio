import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';

import { IonPullUpFooterState } from 'ionic-pullup';

import { DragulaService } from 'ng2-dragula';

import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { DataState } from '@app/core/states/data.state';

import { ResponseType } from '@app/core/enums/http/response-type.enum';

import { Thermometer } from '@app/core/models/temperature/thermometer.model';
import { ThermometerInfo } from '@app/core/models/temperature/thermometer-info.model';
import { ChartComponent } from '../chart/chart.component';
import { ChartState } from '@app/core/states/chart.state';
import { getToast, responseFilter } from '@app/core/helpers/response-helpers';

@Component({
  selector: 'app-temperature',
  templateUrl: 'temperature.page.html',
  styleUrls: ['temperature.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemperaturePage implements OnInit, OnDestroy {
  public readonly dragModel = 'THERMOMETERS';

  public footerState: IonPullUpFooterState;
  public thermometers: Thermometer[] = [];
  public tileMove = false;

  private dataSubscription: Subscription = new Subscription();

  constructor(
    private alertController: AlertController,
    private changeDetectorRef: ChangeDetectorRef,
    private chartState: ChartState,
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

  public async fetchData(errorOnly = false, event?: any): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const thermometerSubscription: Subscription = this.dataState.fetchThermometers()
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Read, 'Thermometers', errorOnly))
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

  public async fetchThermometersData(id: number): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const thermometer: Thermometer
      = this.thermometers.find(thermometer => thermometer.id === id);

    if (thermometer?.celsius === null || thermometer?.celsius === undefined) {
      this.chartState.resetSelectedID();
      return;
    }

    this.chartState.setSelectedID(id);

    const thermometerDataSubscription: Subscription = this.chartState.fetchThermometersData(id)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Read, 'Thermometers data', true))
      )
      .subscribe(res => this.presentPopover(`${thermometer.name} temperature`, res.body));

    this.dataSubscription.add(thermometerDataSubscription);
  }

  public onItemEdit(id: number): void {
    this.presentAlertPrompt(id);
  }

  public async onItemDelete(id: number): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const deleteThermometerSubscription: Subscription = this.dataState.deleteThermometer(id)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Delete, 'Thermometer'))
      )
      .subscribe(_ => this.fetchData());

    this.dataSubscription.add(deleteThermometerSubscription);
  }

  public async onTileMove(orderedThermometers: Thermometer[]): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const orderedThermometerIDs: number[] = orderedThermometers.map(thermometer => thermometer.id);
    const changeOrderSubscription: Subscription = this.dataState.changeThermometersOrder(orderedThermometerIDs)
      .pipe(
        filter(res => {
          return responseFilter(toastInstance, res.status, ResponseType.Update, 'Order', true);
        })
      )
      .subscribe(_ => this.fetchData());

    this.dataSubscription.add(changeOrderSubscription);
    this.tileMove = false;
    this.changeDetectorRef.detectChanges();
  }

  private async presentAlertPrompt(id?: number): Promise<void> {
    const thermometer: Thermometer
      = this.thermometers.find(thermometer => thermometer.id === id);
    const alert: HTMLIonAlertElement = await this.alertController.create({
      cssClass: 'alert-container',
      header: id === undefined ? 'Create a thermometer' : 'Edit a thermometer',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name',
          value: thermometer?.name
        },
        {
          name: 'sensor',
          type: 'text',
          placeholder: 'Sensor',
          value: thermometer?.sensor
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

  private async createThermometer(data: ThermometerInfo): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const createThermometerSubscription: Subscription = this.dataState.createThermometer(data)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Create, 'Thermometer'))
      )
      .subscribe(_ => this.fetchData());

    this.dataSubscription.add(createThermometerSubscription);
  }

  private async updateThermometer(data: ThermometerInfo, id: number): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const editedThermometer: Thermometer = this.thermometers
      .find(thermometer => thermometer.id === id);
    const updatedThermometer: Thermometer = { ...editedThermometer, ...data }

    const updateThermometerSubscription: Subscription = this.dataState.updateThermometer(updatedThermometer)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Update, 'Thermometer'))
      )
      .subscribe(_ => this.fetchData());

    this.dataSubscription.add(updateThermometerSubscription);
  }

}
