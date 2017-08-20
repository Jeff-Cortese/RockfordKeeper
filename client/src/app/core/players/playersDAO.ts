import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { IPlayer } from './IPlayer';

@Injectable()
export class PlayersDAO {
  playersUrl = '/players';

  constructor(private firebase: AngularFireDatabase) {}

  getPlayers(): Observable<IPlayer[]> {
    return this.firebase.list(this.playersUrl);
  }

  markTaken(playerId: string, isTaken = true): Observable<any> {
    return Observable.fromPromise(
      this.firebase.object(`${this.playersUrl}/${playerId}`).update({ isTaken: isTaken })
    );
  }
}
