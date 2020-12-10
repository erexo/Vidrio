import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { IonicPullupModule } from 'ionic-pullup';

import { SwipeTabModule } from '@app/core/directives/swipe-tab/swipe-tab.module';

import { DashboardPage } from './dashboard.page';

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
