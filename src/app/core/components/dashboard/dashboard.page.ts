import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { IonTabs } from '@ionic/angular';

import { CupertinoPane } from 'cupertino-pane';

import { last } from 'lodash-es';

import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { DataState } from '@app/core/states/data.state';
import { LocalState } from '@app/core/states/local.state';

import { SwipeTabDirective } from '@app/core/directives/swipe-tab/swipe-tab.directive';

import { SensorType } from '@app/core/enums/data/sensor/sensor-type.enum';
import { MenuItem } from '@app/core/models/menu/menu-item.model';
import { PaneBreaks } from 'cupertino-pane/dist/models';
import { UserRole } from '@app/core/enums/user/user-role.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage implements OnInit, OnDestroy {
  @ViewChild(SwipeTabDirective) swipeTabDirective: SwipeTabDirective;
  @ViewChild('dashboardTabs') dashboardTabs: IonTabs;
  @ViewChild('menuPane', { static: true }) menuPane: ElementRef;

  private readonly menuButtonOffset = 10;
  private readonly menuDoubleRowHeight = 152;
  private readonly menuSingleRowHeight = 76;

  public addButtonHidden: boolean;
  public menuContainer: CupertinoPane;
  public menuItems: MenuItem[];

  private menuHeight: number;
  private menuRowsCount: number;
  private dataSubscription: Subscription = new Subscription();

  constructor(
    public dataState: DataState,
    public localState: LocalState,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    const activeMenuItems: MenuItem[] = this.localState.activeMenu;

    this.menuItems = activeMenuItems;
    this.menuHeight = activeMenuItems.length > 3 ? this.menuDoubleRowHeight : this.menuSingleRowHeight;
    this.menuRowsCount = activeMenuItems.length > 3 ? 2 : 1;
    this.changeDetectorRef.markForCheck();

    this.addRoleChangeListener();
    this.addRouteChangeListener();
    this.initMenu();
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  ionTabsDidChange($event) {
    this.swipeTabDirective.onTabInitialized($event.tab);
    this.menuRowsCount === 2 && this.menuContainer.moveToBreak('middle');
  }

  public initMenu(): void {
    if (this.menuContainer) {
      this.menuContainer.destroy();
    }

    this.menuContainer = new CupertinoPane(
      this.menuPane.nativeElement,
      {
        breaks: this.getMenuBreakpoints(),
        buttonClose: false,
        draggableOver: false,
        initialBreak: this.menuRowsCount === 2 ? 'middle' : 'top',
        ...(!this.addButtonHidden && { followerElement: 'ion-fab' })
      }
    );

    this.menuRowsCount === 1 && this.menuContainer.disableDrag();
    this.menuContainer.present({ animate: true });

    this.changeDetectorRef.markForCheck();
  }
  
  public onTabChange($event): void {
    this.dashboardTabs.select($event);
  }

  public getAddButtonPosition(): string {
    const menuLeftOffset: number
      = this.menuPane.nativeElement.getBoundingClientRect().left + this.menuButtonOffset;
    return `${menuLeftOffset}px`;
  }

  private getMenuBreakpoints(): PaneBreaks {
    return this.menuRowsCount === 2
      ? {
          top: { enabled: true, height: this.menuHeight - 20, bounce: true },
          middle: { enabled: true, height: this.menuHeight / 2 },
          bottom: { enabled: false },
        }
      : {
        top: { enabled: true, height: this.menuHeight },
        middle: { enabled: false },
        bottom: { enabled: false },
      };
  }

  private addRoleChangeListener(): void {
    const roleChangeSubscription: Subscription = this.localState.state$.pipe(
      map(state => state.user.role),
      filter(role => !!role)
    )
      .subscribe(role => {
        this.addButtonHidden = role !== UserRole.Admin;
        this.changeDetectorRef.markForCheck();
      });

    this.dataSubscription.add(roleChangeSubscription);
  }

  private addRouteChangeListener(): void {
    const routeChangeSubscription: Subscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe((event: NavigationEnd) => {
        const sensorType: SensorType = last(event.urlAfterRedirects.split('/'));
        this.localState.setSensorType(sensorType);
      });

    this.dataSubscription.add(routeChangeSubscription);
  }

}
