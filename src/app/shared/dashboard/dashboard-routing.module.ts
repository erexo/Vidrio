import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardPage } from '@shared/dashboard/dashboard.page';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPage,
    children: [
      {
        path: 'temperature',
        loadChildren: () => import('@shared/temperature/temperature.module').then(m => m.TemperaturePageModule)
      },
      {
        path: 'blinds',
        loadChildren: () => import('@shared/blinds/blinds.module').then(m => m.BlindsPageModule)
      },
      {
        path: 'lights',
        loadChildren: () => import('@shared/lights/lights.module').then(m => m.LightsPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('@shared/settings/settings.module').then( m => m.SettingsPageModule)
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
