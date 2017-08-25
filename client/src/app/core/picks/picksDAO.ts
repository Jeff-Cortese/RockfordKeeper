import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

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

  getPicks(): Observable<IPick[]> {
    return this.firebase.list(this.picksUrl);
  }

  getCurrentPick(): Observable<IPick> {
    return this.firebase.object(this.currentPickUrl);
  }

  getPreviousPick(): Observable<IPick> {
    return this.firebase.object(this.previousPickUrl);
  }

  selectPlayer(pick: IPick, player: IPlayer, nextPick: IPick): Observable<any> {
    return Observable.concat(
      // set picks
      this.firebase.object(`${this.picksUrl}/${pick.overallSelection}/player`).set(player),
      // update player is selected flag
      this.playersDao.markTaken(player.$key),
      // set owner roster
      this.ownerDao.addToRoster(pick.teamId, player),
      // set current pick to the next pick
      this.firebase.object(this.currentPickUrl).set(nextPick),
      // set the previous pick to the current pick
      this.firebase.object(this.previousPickUrl).set(pick)
    )
      .reduce(() => {});
  }

  changeCurrentPick(newPick: IPick): Observable<any> {
    return Observable.fromPromise(this.firebase.object(this.currentPickUrl).set(newPick));
  }

  unselectPlayer(pick: IPick, player: IPlayer): Observable<any> {
    return Observable.concat(
      // remove from /pick/:id
      this.firebase.object(`${this.picksUrl}/${pick.overallSelection}/player`).remove(),
      // update player is taken flag
      this.playersDao.markTaken(player.$key, false),
      // remove from roster
      this.ownerDao.removeFromRoster(pick.teamId, player),
      // set current pick to the removal pick,
      this.firebase.object(this.currentPickUrl).set(_.omit(pick, ['player']))
      // don't think i need to update previous pick
    )
      .reduce(() => {});
  }
}
