import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TileComponent } from './tile.component';
import { TileTemperatureComponent } from './tile-temperature/tile-temperature.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [
    TileComponent,
    TileTemperatureComponent
  ],
  exports: [
    TileComponent
  ]
})
export class TileModule {}
