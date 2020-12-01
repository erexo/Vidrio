import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { SensorType } from '@app/core/enums/data/sensor-type.enum';
import { Light } from '@app/core/models/light/light.model';
import { ChartState } from '@app/core/states/chart.state';
import { DataState } from '@app/core/states/data.state';
import { LocalState } from '@app/core/states/local.state';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { DragulaService } from 'ng2-dragula';
import { SensorComponent } from '../sensor/sensor.component';

@Component({
  selector: 'app-lights',
  templateUrl: '../sensor/sensor.component.html',
  styleUrls: [
    '../sensor/sensor.component.scss',
    'lights.page.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightsPage extends SensorComponent {

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
      dataState,
      dragulaService,
      localState,
      toastController
    );
    
    this.localState.setSensorType(SensorType.Lights);
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

}
