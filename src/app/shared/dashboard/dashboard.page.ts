import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonTabs, NavController, Platform } from '@ionic/angular';

import { last } from 'lodash-es';

import { UserState } from '@app/core/states/user.state';

import { IonPullUpFooterState } from 'ionic-pullup';
import { LocalState } from '@app/core/states/local.state';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SensorType } from '@app/core/enums/data/sensor-type.enum';
import { DataState } from '@app/core/states/data.state';
import { SwipeTabDirective } from '@app/core/directives/swipe-tab/swipe-tab.directive';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage implements OnInit, OnDestroy {
  @ViewChild(SwipeTabDirective) swipeTabDirective: SwipeTabDirective;
  @ViewChild('dashboardTabs') dashboardTabs: IonTabs;

  private readonly menuHeight = 127;

  public footerState: IonPullUpFooterState;

  private routeChangeSubscription: Subscription = new Subscription();

  constructor(
    public dataState: DataState,
    private localState: LocalState,
    private platform: Platform,
    private navController: NavController,
    private router: Router,
    private userState: UserState
  ) {}

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Expanded;
    this.addRouteChangeListener();
  }

  ngOnDestroy() {
    this.routeChangeSubscription.unsubscribe();
  }

  ionTabsDidChange($event) {
    this.swipeTabDirective.onTabInitialized($event.tab);
  }

  onTabChange($event) {
    this.dashboardTabs.select($event);
  }

  public toggleFooter(): void {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed
      ? IonPullUpFooterState.Expanded
      : IonPullUpFooterState.Collapsed;
  }

  public getTopMargin(): number {
    return this.platform.height() - this.menuHeight;
  }

  public logout(): void {
    this.footerState = IonPullUpFooterState.Collapsed;
    this.localState.setAccessToken(null);
    this.userState.reset();
    this.navController.navigateBack('login');
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
