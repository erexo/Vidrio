import { NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';

import { DataState } from './states/data.state';
import { UserState } from './states/user.state';

import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    NgxsModule.forRoot([
      DataState,
      UserState
    ], { developmentMode: !environment.production }),
    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN]),
    NgxsSelectSnapshotModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
})
export class CoreModule {}
