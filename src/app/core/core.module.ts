import { NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { ChartState } from '@core/states/chart.state';
import { DataState } from '@core/states/data.state';
import { LocalState } from '@app/core/states/local.state';
import { UsersState } from '@app/core/states/users.state';

import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    NgxsModule.forRoot([
      ChartState,
      DataState,
      LocalState,
      UsersState
    ], { developmentMode: !environment.production }),
    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN]),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
})
export class CoreModule {}
