import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPick } from '../core/picks/IPick';
import { IPlayer } from '../core/players/IPlayer';
import { IOwner } from '../core/owners/IOwner';

@Component({
  selector: 'app-picks',
  templateUrl: './picks.component.html',
  styleUrls: ['./picks.component.scss']
})
export class PicksComponent {
  @Input() picks: IPick[];
  @Input() players: IPlayer[];
  @Input() owners: IOwner[];
  @Input() currentPick: IPick;

  @Output() selectPick = new EventEmitter<IPick>();
  @Output() undoPick = new EventEmitter<IPick>();

  onUndoClick(pick: IPick): void {
    this.undoPick.emit(pick);
  }

  onCardClick(pick: IPick): void {
    this.selectPick.emit(pick);
  }
}

