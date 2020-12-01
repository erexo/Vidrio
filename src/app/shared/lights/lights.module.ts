import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LightsPage } from './lights.page';

import { LightsPageRoutingModule } from './lights-routing.module'
import { DragulaModule } from 'ng2-dragula';
import { TileModule } from '../tile/tile.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DragulaModule,
    LightsPageRoutingModule,
    TileModule
  ],
  declarations: [LightsPage]
})
export class LightsPageModule {}
