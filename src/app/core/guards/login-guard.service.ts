import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LocalState } from '../states/local.state';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(
    private localState: LocalState,
    private navController: NavController
  ) { }

  canActivate(): boolean {
    if (this.localState.accessToken) {
      this.navController.navigateRoot(['dashboard']);
      return false;
    }
    return true;
  }
}
