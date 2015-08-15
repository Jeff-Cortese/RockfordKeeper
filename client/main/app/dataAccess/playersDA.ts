import * as endpoints from './endpoints';
import * as fire from '../lib/AngularFire';

class PlayerDA {
  private fireRef: fire.AngularFire;
  private firePlayers: fire.FirebaseArray;
  private players: Array<{}>;

  constructor() {
    this.fireRef = new fire.AngularFire(endpoints.players);
  }

  private fetchPlayers() {
    this.firePlayers = this.fireRef.asArray();
    this.players = this.firePlayers.list;
  }

  getPlayers() {
    if (!this.players) {
      this.fetchPlayers();
    }

    //todo promise so that spinners can happen and what not
    return this.players;
  }
}

export default PlayerDA;