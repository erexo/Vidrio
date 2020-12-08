import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { SensorToggleDirection } from '@app/core/enums/data/sensor-toggle-direction.enum';

import { Blind } from '@app/core/models/blind/blind.model';

@Component({
  selector: 'app-tile-blinds',
  templateUrl: './tile-blinds.component.html',
  styleUrls: ['./tile-blinds.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileBlindsComponent {
  
  @Input() blind: Blind;

  @Output() sensorToggled: EventEmitter<SensorToggleDirection> = new EventEmitter<SensorToggleDirection>();

  public SensorToggleDirection = SensorToggleDirection;

  constructor() { }

  public toggleBlind(sensorToggleDirection: SensorToggleDirection): void {
    this.sensorToggled.emit(sensorToggleDirection);
  }

}
