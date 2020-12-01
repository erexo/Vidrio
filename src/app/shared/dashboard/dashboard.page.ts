import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ViewDidEnter } from '@ionic/angular';

import { UserState } from '@app/core/states/user.state';

import { IonPullUpFooterState } from 'ionic-pullup';
import { SensorType } from '@app/core/enums/data/sensor-type.enum';
import { LocalState } from '@app/core/states/local.state';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage implements ViewDidEnter {

  public footerState: IonPullUpFooterState;
  public minBottomVisible: number;

  constructor(
    public localState: LocalState,
    private platform: Platform,
    private router: Router,
    private userState: UserState
  ) {}

  ionViewDidEnter() {
    this.footerState = IonPullUpFooterState.Collapsed;
    this.minBottomVisible = -112;
  }

  public toggleFooter(): void {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed
      ? IonPullUpFooterState.Expanded
      : IonPullUpFooterState.Collapsed;
  }

  public getTopMargin(): number {
    return this.platform.height() - 127;
  }

  public logout(): void {
    this.footerState = IonPullUpFooterState.Collapsed;
    this.userState.logout();
    this.router.navigate(['login']);
  }

}
