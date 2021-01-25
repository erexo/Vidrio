import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { SensorToggleDirection } from '@core/enums/data/sensor/sensor-toggle-direction.enum';

import { Blind } from '@core/models/sensor/blind/blind.model';

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
  public upButtonDisabled = false;
  public downButtonDisabled = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  public toggleBlind(sensorToggleDirection: SensorToggleDirection): void {
    sensorToggleDirection === SensorToggleDirection.Up
      ? this.upButtonDisabled = true
      : this.downButtonDisabled = true;
    
    this.sensorToggled.emit(sensorToggleDirection);

    setTimeout(_ => {
      sensorToggleDirection === SensorToggleDirection.Up
        ? this.upButtonDisabled = false
        : this.downButtonDisabled = false;
      
      this.changeDetectorRef.markForCheck();
    }, 5000)
  }

}
