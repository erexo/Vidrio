import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DragulaModule } from 'ng2-dragula';

import { LightsPageRoutingModule } from '@app/shared/lights/lights-routing.module';
import { TileModule } from '@app/shared/tile/tile.module';

import { LightsPage } from '@app/shared/lights/lights.page';

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
