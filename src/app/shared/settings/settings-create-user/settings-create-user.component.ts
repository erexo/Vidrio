import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';

import { UserRole } from '@app/core/enums/user/user-role.enum';

import { getToast } from '@app/core/helpers/response-helpers';

@Component({
  selector: 'app-settings-create-user',
  templateUrl: './settings-create-user.component.html',
  styleUrls: ['./settings-create-user.component.scss'],
})
export class SettingsCreateUserComponent implements OnInit {
  
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: [UserRole.Guest, Validators.required]
    });
  }

  public async onSubmit(form: FormGroup): Promise<void> {
    const toastInstance: HTMLIonToastElement
      = await getToast(this.toastController, 'All fields are required');
      console.log(`🚀 => form.value`, form.value);

    if (form.valid) {
      this.modalController.dismiss(form.value);
      return;
    }

    toastInstance.present();
  }

}
