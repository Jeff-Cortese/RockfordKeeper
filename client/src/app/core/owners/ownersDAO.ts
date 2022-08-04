import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take, map, mergeMap, tap } from 'rxjs/operators';

import { IOwner } from './IOwner';
import { AngularFireDatabase, SnapshotAction } from 'angularfire2/database';
import { IPlayer } from '../players/IPlayer';
import { filter, isArray, omitBy } from 'lodash-es';

@Injectable()
export class OwnersDAO {
  ownerUrl = '/owners';

  constructor(private firebase: AngularFireDatabase) {}

  getOwners(): Observable<SnapshotAction<IOwner>[]> {
    return this.firebase.list<IOwner>(this.ownerUrl).snapshotChanges();
  }

  addToRoster(teamId: string, playerToAdd: IPlayer): Observable<any> {
    const ownerRef = this.firebase.object(`${this.ownerUrl}/${teamId}`);
    return ownerRef.snapshotChanges().pipe(
      take(1),
      map((owner: SnapshotAction<IOwner>) => this.addPlayer(owner, playerToAdd)),
      mergeMap((updatedOwner: IOwner) => ownerRef.update(updatedOwner))
    );
  }

  removeFromRoster(teamId: string, player: SnapshotAction<IPlayer>): Observable<any> {
    const ownerRef = this.firebase.object(`${this.ownerUrl}/${teamId}`);
    return ownerRef.snapshotChanges().pipe(
      take(1),
      map((owner: SnapshotAction<IOwner>) => this.removePlayer(owner, player.payload.val())),
      mergeMap((updatedOwner: IOwner) => ownerRef.update(updatedOwner))
    );
  }

  private removePlayer(ownerToRemoveFrom: SnapshotAction<IOwner>, playerToRemove: IPlayer): IOwner {
    const owner = ownerToRemoveFrom.payload.val();
    const roster = owner.roster || {};
    const removeFromBench =
        player => filter(roster.bench || [], (p: IPlayer) => p.espnPlayerId !== player.espnPlayerId);

    const newRoster = omitBy(roster, (property: IPlayer | IPlayer[]) =>
      !isArray(property) ? (<IPlayer>property).espnPlayerId === playerToRemove.espnPlayerId : false
    );

    return {
      ...owner,
      roster: {
        ...newRoster,
        bench: removeFromBench(playerToRemove)
      }
    };
  }

  private addPlayer(addToOwner: SnapshotAction<IOwner>, playerToAdd: IPlayer): IOwner {
    const owner = addToOwner.payload.val();
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
      case 'D/ST': {
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
