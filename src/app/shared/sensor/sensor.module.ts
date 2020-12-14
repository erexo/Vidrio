import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { DragulaModule } from 'ng2-dragula';

import { TileModule } from '@app/shared/tile/tile.module';

import { SensorPage } from '@app/shared/sensor/sensor.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    DragulaModule,
    TileModule
  ],
  declarations: [SensorPage]
})
export class SensorPageModule {}
