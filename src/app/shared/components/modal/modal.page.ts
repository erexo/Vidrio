import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalController } from '@ionic/angular';

import { keyBy, mapValues } from 'lodash-es';

import { FormControlType } from '@core/enums/form/form-control-type.enum';

import { FormControl } from '@core/models/form/form-control.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() controls: FormControl[];
  @Input() noCancel: boolean;
  @Input() submitColor: string = 'primary';
  @Input() submitTitle: string = 'Submit';
  @Input() title: string;

  public readonly FormControlType = FormControlType;

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    const controls: FormGroup = mapValues(
      keyBy(this.controls, 'name'),
      control => ([control.value, Validators.required])
    );

    this.form = this.formBuilder.group(controls, { updateOn: 'submit' });
  }

  public dismiss(): void {
    this.modalController.dismiss();
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
