import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPage,
    children: [
      {
        path: 'temperature',
        loadChildren: () => import('../temperature/temperature.module').then(m => m.TemperaturePageModule)
      },
      {
        path: 'blinds',
        loadChildren: () => import('../blinds/blinds.module').then(m => m.BlindsPageModule)
      },
      {
        path: 'lights',
        loadChildren: () => import('../lights/lights.module').then(m => m.LightsPageModule)
      },
      {
        path: '',
        redirectTo: '/dashboard/temperature',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard/temperature',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardPageRoutingModule {}
