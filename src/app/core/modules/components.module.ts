import { NgModule } from '@angular/core';

import { DashboardPageModule } from '@core/components/dashboard/dashboard.module';
import { LoginPageModule } from '@app/core/components/login/login.module';
import { SensorPageModule } from '@app/core/components/sensor/sensor.module';
import { SettingsPageModule } from '@core/components/settings/settings.module';

@NgModule({
  imports: [
    DashboardPageModule,
    LoginPageModule,
    SensorPageModule,
    SettingsPageModule
  ]
})
export class ComponentsModule {}
