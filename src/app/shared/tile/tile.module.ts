import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TileComponent } from './tile.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [
    TileComponent
  ],
  exports: [
    TileComponent
  ]
})
export class TileModule {}
