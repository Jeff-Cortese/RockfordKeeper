import * as endpoints from 'dataAccess/endpoints';
import * as fire from 'lib/AngularFire';
import * as api from './dataAccessApi';

export class PlayersDA{
  static newPlayersObservable() {
    var fireRef = new fire.AngularFire(endpoints.players);
    var firePlayers = fireRef.asArray();


  }
}
