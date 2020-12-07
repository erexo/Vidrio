import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { SensorType } from '@app/core/enums/data/sensor-type.enum';
import { Blind } from '@app/core/models/blind/blind.model';
import { ChartState } from '@app/core/states/chart.state';
import { DataState } from '@app/core/states/data.state';
import { LocalState } from '@app/core/states/local.state';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { DragulaService } from 'ng2-dragula';
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
    protected toastController: ToastController,
  ) {
    super(
      alertController,
      changeDetectorRef,
      chartState,
      dataState,
      dragulaService,
      localState,
      toastController
    );
    
    this.localState.setSensorType(SensorType.Blinds);
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
          handler: (data) => sensorID === undefined
            ? this.createSensor(data)
            : this.updateSensor(data, sensorID)
        }
      ]
    });

    await alert.present();
  }

}
