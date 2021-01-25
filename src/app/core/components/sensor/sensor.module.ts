import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { DragulaModule } from 'ng2-dragula';

import { TileModule } from '@app/shared/components/tile/tile.module';

import { SensorPage } from '@core/components/sensor/sensor.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    DragulaModule,
    TileModule
  ],
  declarations: [SensorPage]
})
export class SensorPageModule {}
