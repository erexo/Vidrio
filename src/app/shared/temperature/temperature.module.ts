import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TemperaturePageRoutingModule } from './temperature-routing.module';

import { ChartModule } from '../chart/chart.module';
import { DragulaModule } from 'ng2-dragula';
import { TemperaturePage } from './temperature.page';
import { TileModule } from '../tile/tile.module';


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
