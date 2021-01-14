import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { LocalState } from '@app/core/states/local.state';

import { SensorToggleDirection } from '@app/core/enums/data/sensor/sensor-toggle-direction.enum';
import { SensorType } from '@app/core/enums/data/sensor/sensor-type.enum';

import { Sensor } from '@app/core/models/sensor/sensor.model';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {

  @Input() loaderVisible: boolean;
  @Input() sensor: Sensor;
  @Input() sensorType: SensorType;

  @Output() sensorDeleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() sensorDoubleTapped: EventEmitter<void> = new EventEmitter<void>();
  @Output() sensorEdited: EventEmitter<void> = new EventEmitter<void>();
  @Output() sensorToggled: EventEmitter<SensorToggleDirection | void> = new EventEmitter<SensorToggleDirection | void>();

  public readonly SensorType = SensorType;

  public tileDetailed = false;
  public menuHidden = true;

  constructor(public localState: LocalState) { }

  public onTileTap(event: any): void {
    if (event.tapCount === 2 && this.sensorType === SensorType.Temperature) {
      this.tileDetailed = !this.tileDetailed;

      if (this.tileDetailed) {
        this.sensorDoubleTapped.emit();
      }
    }
  }

  public onSensorToggle(event?: SensorToggleDirection): void {
    this.sensorToggled.emit(event);
  }

  public toggleMenu(): void {
    this.menuHidden = !this.menuHidden;
  }

  public getToggleIconName(): string {
    return this.menuHidden
      ? 'menu-outline'
      : 'close-outline';
  }

  public editItem(): void {
    this.menuHidden = true;
    this.sensorEdited.emit();
  }

  public deleteItem(): void {
    this.sensorDeleted.emit();
  }

}
