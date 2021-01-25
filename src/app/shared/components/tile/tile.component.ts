import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { LocalState } from '@core/states/local.state';

import { SensorToggleDirection } from '@core/enums/data/sensor/sensor-toggle-direction.enum';
import { SensorType } from '@core/enums/data/sensor/sensor-type.enum';

import { Sensor } from '@core/models/sensor/sensor.model';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {

  @Input() set menuHidden(value: boolean) {
    this._menuHidden = value;
    this.changeDetectorRef.markForCheck();
  }

  get menuHidden(): boolean {
    return this._menuHidden;
  }

  @Input() loaderVisible: boolean;
  @Input() sensor: Sensor;
  @Input() sensorType: SensorType;

  @Output() menuOpened: EventEmitter<number> = new EventEmitter<number>();
  @Output() sensorDeleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() sensorDoubleTapped: EventEmitter<void> = new EventEmitter<void>();
  @Output() sensorEdited: EventEmitter<void> = new EventEmitter<void>();
  @Output() sensorToggled: EventEmitter<SensorToggleDirection | void> = new EventEmitter<SensorToggleDirection | void>();

  public readonly SensorType = SensorType;

  public tileDetailed = false;
  public _menuHidden = true;

  constructor(
    public localState: LocalState,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  public onTileTap(event: any): void {
    if (event.tapCount === 2 && this.sensorType === SensorType.Temperature) {
      this.tileDetailed = !this.tileDetailed;
      this.changeDetectorRef.markForCheck();

      if (this.tileDetailed) {
        this.sensorDoubleTapped.emit();
      }
    }
  }

  public onSensorToggle(event?: SensorToggleDirection): void {
    this.sensorToggled.emit(event);
  }

  public toggleMenu(): void {
    this._menuHidden = !this._menuHidden;
    this.menuOpened.emit(this.sensor.id);
    this.changeDetectorRef.markForCheck();
  }

  public getToggleIconName(): string {
    return this.menuHidden
      ? 'menu-outline'
      : 'close-outline';
  }

  public editItem(): void {
    this.menuHidden = true;
    this.changeDetectorRef.markForCheck();
    this.sensorEdited.emit();
  }

  public deleteItem(): void {
    this.sensorDeleted.emit();
  }

}
