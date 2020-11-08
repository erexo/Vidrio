import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {

  @Input() title: string;
  @Input() dataLoading: boolean;

  @Output() itemDoubleTapped: EventEmitter<void> = new EventEmitter<void>();
  @Output() itemEdited: EventEmitter<void> = new EventEmitter<void>();
  @Output() itemDeleted: EventEmitter<void> = new EventEmitter<void>();

  public tileDetailed = false;
  public menuHidden = true;

  constructor() { }

  public onTileTap(event: any): void {
    if (event.tapCount === 2) {
      this.tileDetailed = !this.tileDetailed;

      if (this.tileDetailed) {
        this.itemDoubleTapped.emit();
      }
    }
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
    this.itemEdited.emit();
  }

  public deleteItem(): void {
    this.itemDeleted.emit();
  }

}
