import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
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
        redirectTo: '/tabs/temperature',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/temperature',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
