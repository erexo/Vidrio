import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ChartComponent } from '@app/shared/components/chart/chart.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    ChartComponent
  ],
  exports: [
    ChartComponent
  ]
})
export class ChartModule {}
