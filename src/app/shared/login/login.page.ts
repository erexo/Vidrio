import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastController } from '@ionic/angular';

import { Subscription } from 'rxjs';

import { UserState } from '@app/core/states/user.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  public form: FormGroup;

  private loginSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private userState: UserState
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    }, { updateOn: 'blur' });
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

  public onSubmit(form: FormGroup): void {
    form.markAllAsTouched();

    if (form.valid) {
      this.loginSubscription = this.userState.login(form.value)
        .subscribe(status => {
          if (status === 200 || status === 202) {
            this.router.navigate(['dashboard']);
          } else {
            this.presentToast(`Login request was denied (Status Code: ${status})`);
          }

          this.form.reset();
        });
      return;
    }
    
    this.presentToast('Login and password are required');
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      color: 'light',
      cssClass: 'toast',
      duration: 2000,
      message,
      translucent: true
    });
    toast.present();
  }

}
