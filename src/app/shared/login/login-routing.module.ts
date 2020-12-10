import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginGuardService } from '@app/core/guards/login-guard.service';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [LoginGuardService],
    component: LoginPage
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
