import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { TileBlindsComponent } from '@app/shared/components/tile/tile-blinds/tile-blinds.component';
import { TileComponent } from '@app/shared/components/tile/tile.component';
import { TileLightsComponent } from '@app/shared/components/tile/tile-lights/tile-lights.component';
import { TileTemperatureComponent } from '@app/shared/components/tile/tile-temperature/tile-temperature.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [
    TileComponent,
    TileTemperatureComponent,
    TileBlindsComponent,
    TileLightsComponent
  ],
  exports: [
    TileComponent
  ]
})
export class TileModule {}
