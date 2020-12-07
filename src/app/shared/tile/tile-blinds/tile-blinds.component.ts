import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Blind } from '@app/core/models/blind/blind.model';

@Component({
  selector: 'app-tile-blinds',
  templateUrl: './tile-blinds.component.html',
  styleUrls: ['./tile-blinds.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileBlindsComponent implements OnInit {
  
  @Input() blind: Blind;

  constructor() { }

  ngOnInit() {}

}
