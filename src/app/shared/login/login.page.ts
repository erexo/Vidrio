import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertController, IonInput, NavController, Platform, ToastController, ViewDidEnter } from '@ionic/angular';

import { Subscription } from 'rxjs';

import { LocalState } from '@app/core/states/local.state';

import { HTTPStatusCode } from '@app/core/enums/http/http-status-code.enum';

import { getToast } from '@app/core/helpers/response-helpers';
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
    private navController: NavController,
    private platform: Platform,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    if (this.platform.is("android") || this.platform.is("ios") || !environment.production) {
      this.checkApiKey();
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
            this.navController.navigateRoot(['dashboard']);
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

  private async checkApiKey(): Promise<void> {
    if (!this.localState.apiKey) {
      const alert: HTMLIonAlertElement = await this.alertController.create({
        backdropDismiss: false,
        cssClass: 'alert-container',
        header: 'Set api key',
        inputs: [
          {
            name: 'apiKey',
            type: 'url',
            placeholder: 'Api Key',
            value: 'localhost:4235'
          }
        ],
        buttons: [
          {
            text: 'Set',
            handler: (data) => data.apiKey.trim()
              ? this.localState.setApiKey(data.apiKey)
              : false,

          }
        ]
      });

      alert.present();
    }
  }

}
