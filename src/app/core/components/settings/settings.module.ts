import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from '@core/components/settings/settings.page';
import { SettingsTileComponent } from '@core/components/settings/settings-tile/settings-tile.component';
import { ModalPageModule } from '@app/shared/components/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    ModalPageModule
  ],
  declarations: [
    SettingsPage,
    SettingsTileComponent
  ]
})
export class SettingsPageModule {}
