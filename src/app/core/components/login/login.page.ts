import { ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertController, IonInput, ModalController, NavController, Platform, ToastController, ViewDidEnter } from '@ionic/angular';

import { Subscription } from 'rxjs';

import { LocalState } from '@core/states/local.state';

import { FormControlType } from '@core/enums/form/form-control-type.enum';
import { HTTPStatusCode } from '@core/enums/http/http-status-code.enum';

import { FormControl } from '@core/models/form/form-control.model';

import { getModal, getToast } from '@core/helpers/response-helpers';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage implements OnInit, OnDestroy, ViewDidEnter {
  @ViewChild('usernameInput') usernameInput: IonInput;

  public form: FormGroup;

  private loginSubscription: Subscription;

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private localState: LocalState,
    private modalController: ModalController,
    private navController: NavController,
    private platform: Platform,
    private toastController: ToastController,
    private zone: NgZone
  ) { }

  ngOnInit() {
    if ((this.platform.is("android") || this.platform.is("ios") || !environment.production) && !this.localState.apiKey) {
      this.presentApiKeyModal();
    }

    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    }, { updateOn: 'submit' });
  }

  ionViewDidEnter() {
    setTimeout(_ => {
      this.usernameInput.setFocus();
    }, 0);
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

  public async onSubmit(form: FormGroup): Promise<void> {
    const toastInstance: HTMLIonToastElement
      = await getToast(this.toastController, 'Login and password are required');

    form.markAllAsTouched();

    if (form.valid) {
      this.loginSubscription = this.localState.login(form.value)
        .subscribe(async (status: HTTPStatusCode) => {
          if (status === HTTPStatusCode.OK || status === HTTPStatusCode.Accepted) {
            this.zone.run(_ => this.navController.navigateForward(['dashboard']));
          } else {
            const toastInstance = await getToast(
              this.toastController,
              `Login request was denied (Status Code: ${status})`
            );

            toastInstance.present();
          }

          this.form.reset();
        });
      return;
    }

    toastInstance.present();
  }

  private async presentApiKeyModal(): Promise<void> {
    const modal: HTMLIonModalElement = await getModal(
      this.modalController,
      [
        new FormControl(FormControlType.Text, 'apiKey', 'localhost:4235', 'API Key', 'API Key')
      ],
      'Set API key',
      true
    );
      
    modal.onWillDismiss().then(event => {
      if (event.data) {
        event.data.apiKey.trim()
          ? this.localState.setApiKey(event.data.apiKey)
          : false;
      }
    });
  
    await modal.present();
  }

}
