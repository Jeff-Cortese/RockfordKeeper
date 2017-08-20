import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { IOwner, IRoster } from './IOwner';
import { AngularFireDatabase } from 'angularfire2/database';
import { IPlayer } from '../players/IPlayer';

@Injectable()
export class OwnersDAO {
  ownerUrl = '/owners';

  constructor(private firebase: AngularFireDatabase) {}

  getOwners(): Observable<IOwner[]> {
    return this.firebase.list(this.ownerUrl);
  }

  addToRoster(teamId: string, playerToAdd: IPlayer): Observable<any> {
    const ownerRef = this.firebase.object(`${this.ownerUrl}/${teamId}`);
    return ownerRef
      .take(1)
      .map((owner: IOwner) => this.addPlayer(owner, playerToAdd))
      .mergeMap((updatedOwner: IOwner) => ownerRef.update(updatedOwner));
  }

  removeFromRoster(teamId: string, player: IPlayer): Observable<any> {
    const ownerRef = this.firebase.object(`${this.ownerUrl}/${teamId}`);
    return ownerRef
      .take(1)
      .map((owner: IOwner) => this.removePlayer(owner, player))
      .mergeMap((updatedOwner: IOwner) => ownerRef.update(updatedOwner));
  }

  private removePlayer(owner: IOwner, playerToRemove: IPlayer): IOwner {
    const roster = owner.roster || {};
    const removeFromBench =
        player => _.filter(roster.bench || [], (p: IPlayer) => p.espnPlayerId !== player.espnPlayerId);

    const newRoster = _.omitBy(roster, (property: IPlayer | IPlayer[]) =>
      !_.isArray(property) ? (<IPlayer>property).espnPlayerId === playerToRemove.espnPlayerId : false
    );

    return {
      ...owner,
      roster: {
        ...newRoster,
        bench: removeFromBench(playerToRemove)
      }
    };
  }

  private addPlayer(owner: IOwner, playerToAdd): IOwner {
    const roster = owner.roster || {};
    const addToBench = player => roster.bench = [...(owner.roster.bench || []), player];

    switch (playerToAdd.position) {
      case 'QB': {
        if (!roster.qb) {
          roster.qb = playerToAdd;
        } else {
          addToBench(playerToAdd);
        }
        break;
      }
      case 'RB': {
        if (!roster.rb1) {
          roster.rb1 = playerToAdd;
        } else if (!roster.rb2) {
          roster.rb2 = playerToAdd;
        } else if (!roster.flx) {
          roster.flx = playerToAdd;
        } else {
          addToBench(playerToAdd);
        }
        break;
      }
      case 'WR': {
        if (!roster.wr1) {
          roster.wr1 = playerToAdd;
        } else if (!roster.wr2) {
          roster.wr2 = playerToAdd;
        } else if (!roster.flx) {
          roster.flx = playerToAdd;
        } else {
          addToBench(playerToAdd);
        }
        break;
      }
      case 'TE': {
        if (!roster.te) {
          roster.te = playerToAdd;
        } else if (!roster.flx) {
          roster.flx = playerToAdd;
        } else {
          addToBench(playerToAdd);
        }
        break;
      }
      case 'DST': {
        if (!roster.dst) {
          roster.dst = playerToAdd;
        } else {
          addToBench(playerToAdd);
        }
        break;
      }
      case 'K': {
        if (!roster.k) {
          roster.k = playerToAdd;
        } else {
          addToBench(playerToAdd);
        }
        break;
      }
      default: {
        addToBench(playerToAdd);
        break;
      }
    }

    return {
      ...owner,
      roster
    };
  }
}
