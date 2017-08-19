import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { IPick } from './IPick';
import { IPlayer } from '../players/IPlayer';

@Injectable()
export class PicksDAO {
  picksUrl = '/picks';

  constructor(private firebase: AngularFireDatabase) {}

  getPicks(): Observable<IPick[]> {
    return this.firebase.list(this.picksUrl);
  }

  selectPlayer(pick: IPick, player: IPlayer): Promise<any> {
    throw new Error('TODO select player');
  }
}
