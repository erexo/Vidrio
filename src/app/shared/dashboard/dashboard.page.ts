import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { DataState } from '@app/core/states/data.state';
import { UserState } from '@app/core/states/user.state';

import { IonPullUpFooterState } from 'ionic-pullup';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  public footerState: IonPullUpFooterState;
  public minBottomVisible: number;

  constructor(
    private dataState: DataState,
    private platform: Platform,
    private router: Router,
    private userState: UserState
  ) {}

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
    this.minBottomVisible = -112;
  }

  public openItemMenu(): void {
    const urlPath: string[] = this.router.url.split('/');
    this.dataState.itemMenuOpened(urlPath[urlPath.length - 1]);
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
