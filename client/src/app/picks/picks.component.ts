import { Component, Input, OnInit } from '@angular/core';
import { IPick } from '../core/picks/IPick';
import { IPlayer } from '../core/players/IPlayer';
import { IOwner } from '../core/owners/IOwner';

@Component({
  selector: 'app-picks',
  templateUrl: './picks.component.html',
  styleUrls: ['./picks.component.scss']
})
export class PicksComponent implements OnInit {
  @Input() picks: IPick[];
  @Input() players: IPlayer[];
  @Input() owners: IOwner[];

  constructor() { }

  ngOnInit() {
  }
}

