import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LightsPage } from './lights.page';

import { LightsPageRoutingModule } from './lights-routing.module'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: LightsPage }]),
    LightsPageRoutingModule,
  ],
  declarations: [LightsPage]
})
export class LightsPageModule {}
