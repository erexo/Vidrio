import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalState } from '../states/local.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private localState: LocalState,
    private router: Router
  ) { }

  canActivate(): boolean {
    if (!this.localState.accessToken) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
