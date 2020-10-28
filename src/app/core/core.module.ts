import { NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';

import { UserState } from './states/user.state';

import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    NgxsModule.forRoot([
      UserState
    ], { developmentMode: !environment.production }),
    NgxsDataPluginModule.forRoot(),
    NgxsSelectSnapshotModule.forRoot()
  ],
})
export class CoreModule {}
