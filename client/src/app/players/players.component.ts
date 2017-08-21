import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPlayer } from '../core/players/IPlayer';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  @Input() players: IPlayer[];
  @Output() playerClicked = new EventEmitter<IPlayer>();

  constructor() {}

  ngOnInit() {}

  getRowClass(row: IPlayer) {
    return { 'hide': row.isTaken };
  }
}
