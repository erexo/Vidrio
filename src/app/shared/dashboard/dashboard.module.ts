import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IonicPullupModule } from 'ionic-pullup';

import { DashboardPageRoutingModule } from '@app/shared/dashboard/dashboard-routing.module';
import { SensorPageModule } from '@app/shared/sensor/sensor.module';
import { SwipeTabModule } from '@app/core/directives/swipe-tab/swipe-tab.module';

import { DashboardPage } from '@app/shared/dashboard/dashboard.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DashboardPageRoutingModule,
    IonicPullupModule,
    SwipeTabModule,
    SensorPageModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
