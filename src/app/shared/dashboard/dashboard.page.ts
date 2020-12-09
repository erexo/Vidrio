import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform, ViewDidEnter } from '@ionic/angular';

import { last } from 'lodash-es';

import { UserState } from '@app/core/states/user.state';

import { IonPullUpFooterState } from 'ionic-pullup';
import { LocalState } from '@app/core/states/local.state';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SensorType } from '@app/core/enums/data/sensor-type.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage implements OnInit, OnDestroy {

  public footerState: IonPullUpFooterState;
  public minBottomVisible: number;

  private routeChangeSubscription: Subscription = new Subscription();

  constructor(
    public localState: LocalState,
    private platform: Platform,
    private router: Router,
    private userState: UserState
  ) {}

  ngOnInit() {
    this.minBottomVisible = -112;
    this.footerState = IonPullUpFooterState.Expanded;
    this.addRouteChangeListener();
  }

  ngOnDestroy() {
    this.routeChangeSubscription.unsubscribe();
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

  private addRouteChangeListener(): void {
    this.routeChangeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe((event: NavigationEnd) => {
        const sensorType: SensorType = last(event.urlAfterRedirects.split('/'));
        this.localState.setSensorType(sensorType);
      });
  }

}
