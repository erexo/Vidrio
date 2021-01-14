import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { IonTabs, Platform } from '@ionic/angular';

import { IonPullUpFooterState } from 'ionic-pullup';

import { last } from 'lodash-es';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DataState } from '@app/core/states/data.state';
import { LocalState } from '@app/core/states/local.state';

import { SwipeTabDirective } from '@app/core/directives/swipe-tab/swipe-tab.directive';

import { SensorType } from '@app/core/enums/data/sensor/sensor-type.enum';
import { MenuItem } from '@app/core/models/menu/menu-item.model';

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

  public menu: MenuItem[] = [
    new MenuItem('thermal', 'Thermal', 'thermometer-outline'),
    new MenuItem('sunblind', 'Blinds', 'book-outline'),
    new MenuItem('light', 'Lights', 'sunny-outline'),
    new MenuItem('settings', 'Settings', 'settings-outline'),
    new MenuItem(undefined, 'Logout', 'log-out-outline', true)
  ];

  public footerState: IonPullUpFooterState;

  private routeChangeSubscription: Subscription = new Subscription();

  constructor(
    public dataState: DataState,
    public localState: LocalState,
    private platform: Platform,
    private router: Router
  ) {}

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
    this.addRouteChangeListener();
  }

  ngOnDestroy() {
    this.routeChangeSubscription.unsubscribe();
  }

  ionTabsDidChange($event) {
    this.swipeTabDirective.onTabInitialized($event.tab);
  }
  
  public onTabChange($event): void {
    this.dashboardTabs.select($event);
  }

  public getTopMargin(): number {
    return this.platform.height() - this.menuHeight;
  }

  public toggleFooter(): void {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed
      ? IonPullUpFooterState.Expanded
      : IonPullUpFooterState.Collapsed;
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
