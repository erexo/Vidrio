import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from '@core/components/dashboard/dashboard-routing.module';
import { SensorPageModule } from '@core/components/sensor/sensor.module';
import { SwipeTabModule } from '@core/directives/swipe-tab/swipe-tab.module';

import { DashboardPage } from '@core/components/dashboard/dashboard.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DashboardPageRoutingModule,
    SwipeTabModule,
    SensorPageModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
