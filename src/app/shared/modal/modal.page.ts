import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalController, ToastController } from '@ionic/angular';

import { keyBy, mapValues } from 'lodash-es';

import { FormControl } from '@app/core/models/form/form-control.model';
import { FormControlType } from '@app/core/enums/form/form-control-type.enum';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() controls: FormControl[];

  public readonly FormControlType = FormControlType;

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    const controls: FormGroup = mapValues(
      keyBy(this.controls, 'name'),
      control => ([control.value, Validators.required])
    );

    this.form = this.formBuilder.group(controls, { updateOn: 'submit' });
  }

  public async onSubmit(form: FormGroup): Promise<void> {
    form.markAllAsTouched();

    if (form.valid) {
      this.modalController.dismiss(form.value);
    }
  }

  public getSelectValues(selectType: any): any[] {
    return Object.keys(selectType)
      .filter(value => isNaN(Number(value)) === false)
      .map(key => ({key: selectType[key], value: +key}));
  }

}
