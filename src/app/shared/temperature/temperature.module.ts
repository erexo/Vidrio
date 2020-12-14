import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TemperaturePageRoutingModule } from '@app/shared/temperature/temperature-routing.module';

import { DragulaModule } from 'ng2-dragula';

import { ChartModule } from '@app/shared/chart/chart.module';
import { TileModule } from '@app/shared/tile/tile.module';

import { TemperaturePage } from '@app/shared/temperature/temperature.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DragulaModule,
    TemperaturePageRoutingModule,
    ChartModule,
    TileModule
  ],
  declarations: [TemperaturePage]
})
export class TemperaturePageModule {}
