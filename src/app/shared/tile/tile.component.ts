import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TileMenuComponent } from './tile-menu/tile-menu.component';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements OnInit {

  @Input() title: string;

  public menuVisible = false;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  public showMenu(event: any): void {
    this.menuVisible = true;
    this.presentPopover(event);
  }

  public async presentPopover(event: any): Promise<void> {
    const popover = await this.popoverController.create({
      cssClass: 'popover-container',
      component: TileMenuComponent,
      event,
      translucent: true
    });

    popover.onWillDismiss().then(_ => {
      this.menuVisible = false;
    });

    return await popover.present();
  }

}
