import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LightsPage } from '@app/shared/lights/lights.page';

const routes: Routes = [
  {
    path: '',
    component: LightsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LightsPageRoutingModule {}
