import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DragulaModule } from 'ng2-dragula';

import { BlindsPageRoutingModule } from './blinds-routing.module';
import { TileModule } from '@app/shared/components/tile/tile.module';

import { BlindsPage } from '@app/shared/components/blinds/blinds.page';

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
