import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IonicPullupModule } from 'ionic-pullup';

import { DashboardPageRoutingModule } from '@app/shared/dashboard/dashboard-routing.module';
import { SwipeTabModule } from '@app/core/directives/swipe-tab/swipe-tab.module';

import { DashboardPage } from '@app/shared/dashboard/dashboard.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DashboardPageRoutingModule,
    IonicPullupModule,
    SwipeTabModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
