import { Component, Input, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { find } from 'lodash-es';
import { IOwner } from '../core/owners/IOwner';
import { IPick } from '../core/picks/IPick';
import { IPlayer } from '../core/players/IPlayer';
import { SnapshotAction } from 'angularfire2/database';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnersComponent implements OnInit, OnChanges {
  @Input() owners: SnapshotAction<IOwner>[];
  @Input() currentPick: SnapshotAction<IPick>;

  selectedOwner = 'TEAM_ON_CLOCK';
  owner: IOwner;

  ngOnInit() {
    if (this.selectedOwner === 'TEAM_ON_CLOCK') {
      const foundOwner = find(this.owners, owner => owner.key === (this.currentPick.payload.val() && this.currentPick.payload.val().teamId));
      this.owner = foundOwner && foundOwner.payload.val();
    } else {
      const foundOwner = find(this.owners, owner => owner.key === this.selectedOwner);
      this.owner = foundOwner && foundOwner.payload.val();
    }
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  qb(): IPlayer {
    const owner = this.owner;
    return owner && owner.roster.qb;
  }

  rb1(): IPlayer {
    const owner = this.owner;
    return owner && owner.roster.rb1;
  }

  rb2(): IPlayer {
    const owner = this.owner;
    return owner && owner.roster.rb2;
  }

  wr1(): IPlayer {
    const owner = this.owner;
    return owner && owner.roster.wr1;
  }

  wr2(): IPlayer {
    const owner = this.owner;
    return owner && owner.roster.wr2;
  }

  te(): IPlayer {
    const owner = this.owner;
    return owner && owner.roster.te;
  }

  flx(): IPlayer {
    const owner = this.owner;
    return owner && owner.roster.flx;
  }

  dst(): IPlayer {
    const owner = this.owner;
    return owner && owner.roster.dst;
  }

  k(): IPlayer {
    const owner = this.owner;
    return owner && owner.roster.k;
  }

  bench(): IPlayer[] {
    const owner = this.owner;
    return owner && owner.roster.bench || [];
  }

  trackBenchBy(player: IPlayer): string {
    return player && player.espnPlayerId;
  }
}
