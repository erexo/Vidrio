import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Thermometer } from '@app/core/models/sensor/temperature/thermometer.model';

@Component({
  selector: 'app-tile-temperature',
  templateUrl: './tile-temperature.component.html',
  styleUrls: ['./tile-temperature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileTemperatureComponent {
  
  @Input() thermometer: Thermometer;

  constructor() { }

}
