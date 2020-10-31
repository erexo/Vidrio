import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DragulaModule, DragulaService } from 'ng2-dragula';
import { TemperaturePageRoutingModule } from './temperature-routing.module';
import { TileModule } from '../tile/tile.module';

import { TemperaturePage } from './temperature.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DragulaModule,
    TemperaturePageRoutingModule,
    TileModule
  ],
  declarations: [TemperaturePage]
})
export class TemperaturePageModule {}
