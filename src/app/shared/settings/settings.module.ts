import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { SettingsTileComponent } from './settings-tile/settings-tile.component';
import { ModalPageModule } from '../modal/modal.module';

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
