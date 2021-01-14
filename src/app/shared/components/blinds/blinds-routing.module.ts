import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlindsPage } from './blinds.page';

const routes: Routes = [
  {
    path: '',
    component: BlindsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlindsPageRoutingModule {}
