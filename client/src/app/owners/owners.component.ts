import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { find } from 'lodash-es';
import { IOwner } from '../core/owners/IOwner';
import { IPick } from '../core/picks/IPick';
import { IPlayer } from '../core/players/IPlayer';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnersComponent {
  @Input() owners: IOwner[];
  @Input() currentPick: IPick;

  selectedOwner: IOwner | '' = '';

  getCurrentPickOwner(): IOwner {
    return find(this.owners, owner => owner.name === (this.currentPick && this.currentPick.teamId));
  }

  owner() {
    return this.selectedOwner || this.getCurrentPickOwner();
  }

  qb(): IPlayer {
    const owner = this.owner();
    return owner && owner.roster.qb;
  }

  rb1(): IPlayer {
    const owner = this.owner();
    return owner && owner.roster.rb1;
  }

  rb2(): IPlayer {
    const owner = this.owner();
    return owner && owner.roster.rb2;
  }

  wr1(): IPlayer {
    const owner = this.owner();
    return owner && owner.roster.wr1;
  }

  wr2(): IPlayer {
    const owner = this.owner();
    return owner && owner.roster.wr2;
  }

  te(): IPlayer {
    const owner = this.owner();
    return owner && owner.roster.te;
  }

  flx(): IPlayer {
    const owner = this.owner();
    return owner && owner.roster.flx;
  }

  dst(): IPlayer {
    const owner = this.owner();
    return owner && owner.roster.dst;
  }

  k(): IPlayer {
    const owner = this.owner();
    return owner && owner.roster.k;
  }

  bench(): IPlayer[] {
    const owner = this.owner();
    return owner && owner.roster.bench || [];
  }

  tackBenchBy(player: IPlayer): string {
    return player && player.espnPlayerId;
  }
}
