import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements OnInit {

  @Input() title: string;

  public menuHidden = true;

  constructor() { }

  ngOnInit() {}

  public toggleMenu(): void {
    this.menuHidden = !this.menuHidden;
  }

  public getToggleIconName(): string {
    return this.menuHidden
      ? 'chevron-forward-outline'
      : 'close-outline';
  }

}
