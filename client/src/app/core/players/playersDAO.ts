import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, from } from 'rxjs';

import { IPlayer } from './IPlayer';

@Injectable()
export class PlayersDAO {
  playersUrl = '/players';

  constructor(private firebase: AngularFireDatabase) {}

  getPlayers(): Observable<IPlayer[]> {
    return this.firebase.list<IPlayer>(this.playersUrl).valueChanges();
  }

  markTaken(playerId: string, isTaken = true): Observable<any> {
    return from(
      this.firebase.object<IPlayer>(`${this.playersUrl}/${playerId}`).update({ isTaken: isTaken })
    );
  }
}
