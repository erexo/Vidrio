import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Light } from '@app/core/models/sensor/light/light.model';

@Component({
  selector: 'app-tile-lights',
  templateUrl: './tile-lights.component.html',
  styleUrls: ['./tile-lights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileLightsComponent {

  @Input() light: Light;

  @Output() sensorToggled: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  public toggleBlind(): void {
    this.sensorToggled.emit();
  }

}
