import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TemperaturePage } from '@app/shared/temperature/temperature.page';

const routes: Routes = [
  {
    path: '',
    component: TemperaturePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemperaturePageRoutingModule {}
