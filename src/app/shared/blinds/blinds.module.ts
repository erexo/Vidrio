import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlindsPage } from './blinds.page';

import { BlindsPageRoutingModule } from './blinds-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BlindsPageRoutingModule
  ],
  declarations: [BlindsPage]
})
export class BlindsPageModule {}
