import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartComponent } from '@app/shared/chart/chart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ChartComponent
  ],
  exports: [
    ChartComponent
  ]
})
export class ChartModule {}
