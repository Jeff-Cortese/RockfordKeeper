import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from 'angularfire2/database';
import { Observable, concat, from, of } from 'rxjs';
import { reduce } from 'rxjs/operators';
import { omit } from 'lodash-es';

import { IPick } from './IPick';
import { IPlayer } from '../players/IPlayer';
import { OwnersDAO } from '../owners/ownersDAO';
import { PlayersDAO } from '../players/playersDAO';

@Injectable()
export class PicksDAO {
  picksUrl = '/picks';
  currentPickUrl = '/currentPick';
  previousPickUrl = '/previousPick';

  constructor(
    private firebase: AngularFireDatabase,
    private ownerDao: OwnersDAO,
    private playersDao: PlayersDAO
  ) {}

  getPicks(): Observable<SnapshotAction<IPick>[]> {
    return this.firebase.list<IPick>(this.picksUrl).snapshotChanges();
  }

  getCurrentPick(): Observable<SnapshotAction<IPick>> {
    return this.firebase.object<IPick>(this.currentPickUrl).snapshotChanges();
  }

  getPreviousPick(): Observable<SnapshotAction<IPick>> {
    return this.firebase.object<IPick>(this.previousPickUrl).snapshotChanges();
  }

  selectPlayer(pick: SnapshotAction<IPick>, player: SnapshotAction<IPlayer>, nextPick: SnapshotAction<IPick>): Observable<any> {
    if (pick.payload.val().player) {
      console.log('Pick already has a player: skipping...');
      return of({});
    }

    return concat(
      // set picks
      this.firebase.object(`${this.picksUrl}/${pick.payload.val().overallSelection}/player`).set(player.payload.val()),
      // update player is selected flag
      this.playersDao.markTaken(player.key),
      // set owner roster
      this.ownerDao.addToRoster(pick.payload.val().teamId, player.payload.val()),
      // set current pick to the next pick
      this.firebase.object(this.currentPickUrl).set(nextPick && nextPick.payload.val() || pick.payload.val()),
      // set the previous pick to the current pick
      this.firebase.object(this.previousPickUrl).set(pick.payload.val())
    ).pipe(
      reduce(() => {})
    );
  }

  changeCurrentPick(newPick: IPick): Observable<any> {
    return from(this.firebase.object<IPick>(this.currentPickUrl).set(newPick));
  }

  unselectPlayer(pick: SnapshotAction<IPick>, player: SnapshotAction<IPlayer>): Observable<any> {
    return concat(
      // remove from /pick/:id
      this.firebase.object(`${this.picksUrl}/${pick.payload.val().overallSelection}/player`).remove(),
      // update player is taken flag
      this.playersDao.markTaken(player.key, false),
      // remove from roster
      this.ownerDao.removeFromRoster(pick.payload.val().teamId, player),
      // set current pick to the removal pick,
      this.firebase.object(this.currentPickUrl).set(omit(pick.payload.val(), ['player']))
      // don't think i need to update previous pick
    ).pipe(
      reduce(() => {})
    );
  }
}
