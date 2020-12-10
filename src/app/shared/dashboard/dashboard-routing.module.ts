import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@app/core/guards/auth-guard.service';

import { DashboardPage } from '@shared/dashboard/dashboard.page';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuardService],
    component: DashboardPage,
    children: [
      {
        path: 'thermal',
        loadChildren: () => import('@shared/temperature/temperature.module').then(m => m.TemperaturePageModule)
      },
      {
        path: 'sunblind',
        loadChildren: () => import('@shared/blinds/blinds.module').then(m => m.BlindsPageModule)
      },
      {
        path: 'light',
        loadChildren: () => import('@shared/lights/lights.module').then(m => m.LightsPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('@shared/settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: '',
        redirectTo: '/dashboard/thermal',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard/thermal',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardPageRoutingModule {}
