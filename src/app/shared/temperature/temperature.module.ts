import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemperaturePage } from './temperature.page';

import { TemperaturePageRoutingModule } from './temperature-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TemperaturePageRoutingModule
  ],
  declarations: [TemperaturePage]
})
export class TemperaturePageModule {}
