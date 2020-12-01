import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ChartState } from '@app/core/states/chart.state';

import { Thermometer } from '@app/core/models/temperature/thermometer.model';

@Component({
  selector: 'app-tile-temperature',
  templateUrl: './tile-temperature.component.html',
  styleUrls: ['./tile-temperature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileTemperatureComponent {
  
  @Input() sensor: Thermometer;

  constructor(public chartState: ChartState) { }

}
