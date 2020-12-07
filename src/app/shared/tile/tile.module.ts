import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TileComponent } from './tile.component';
import { TileTemperatureComponent } from './tile-temperature/tile-temperature.component';
import { TileBlindsComponent } from './tile-blinds/tile-blinds.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [
    TileComponent,
    TileTemperatureComponent,
    TileBlindsComponent
  ],
  exports: [
    TileComponent
  ]
})
export class TileModule {}
