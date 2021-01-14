import { NgModule } from '@angular/core';

import { ComponentsModule } from '@core/modules/components.module';
import { NgxsModule } from '@core/modules/ngxs.module';

@NgModule({
  imports: [
    ComponentsModule,
    NgxsModule
  ]
})
export class CoreModule {}
