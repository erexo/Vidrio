import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '@core/guards/auth-guard.service';

import { DashboardPage } from '@core/components/dashboard/dashboard.page';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    component: DashboardPage,
    children: [
      {
        path: 'thermal',
        loadChildren: () => import('../../../shared/components/temperature/temperature.module').then(m => m.TemperaturePageModule)
      },
      {
        path: 'sunblind',
        loadChildren: () => import('../../../shared/components/blinds/blinds.module').then(m => m.BlindsPageModule)
      },
      {
        path: 'light',
        loadChildren: () => import('../../../shared/components/lights/lights.module').then(m => m.LightsPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: '',
        redirectTo: '/dashboard/thermal',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard/thermal'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardPageRoutingModule {}
