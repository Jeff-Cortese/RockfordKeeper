import { Component, Input, OnInit } from '@angular/core';
import { IPlayer } from '../core/players/IPlayer';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  @Input() players: IPlayer[];

  constructor() { }

  ngOnInit() {}
}
