import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LocalState } from '../states/local.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private localState: LocalState,
    private navController: NavController
  ) { }

  canActivate(): boolean {
    if (!this.localState.accessToken) {
      this.navController.navigateRoot(['login']);
      return false;
    }
    return true;
  }
}
