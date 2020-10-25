import { Component } from '@angular/core';
import { IonPullUpFooterState } from 'ionic-pullup';

@Component({
  selector: 'app-temperature',
  templateUrl: 'temperature.page.html',
  styleUrls: ['temperature.page.scss']
})
export class TemperaturePage {

  public footerState: IonPullUpFooterState;

  constructor() {}

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  public toggleFooter(): void {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed
      ? IonPullUpFooterState.Expanded
      : IonPullUpFooterState.Collapsed;
  }

}
