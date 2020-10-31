import { Component } from '@angular/core';
import { IonPullUpFooterState } from 'ionic-pullup';

@Component({
  selector: 'app-temperature',
  templateUrl: 'temperature.page.html',
  styleUrls: ['temperature.page.scss']
})
export class TemperaturePage {

  public footerState: IonPullUpFooterState;
  public tiles = [
    {
      title: 'Livingroom',
      value: '18°C'
    },
    {
      title: 'Bathroom',
      value: '24°C'
    },
    {
      title: 'Bedroom',
      value: '16°C'
    },
    {
      title: 'Kitchen',
      value: '15°C'
    }
  ];

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
