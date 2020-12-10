import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlindsPage } from './blinds.page';

import { BlindsPageRoutingModule } from './blinds-routing.module';
import { DragulaModule } from 'ng2-dragula';

import { TileModule } from '../tile/tile.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DragulaModule,
    BlindsPageRoutingModule,
    TileModule
  ],
  declarations: [BlindsPage]
})
export class BlindsPageModule {}
