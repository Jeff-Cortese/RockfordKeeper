import * as rx from 'rx';
import {IPickDataAccess, IPlayerDataAccess} from './dataAccessAPI';
import {IPick, IPlayer, ITeam} from '../contracts/contracts';

export class Drafter {
  pickDA: IPickDataAccess;
  playerDA: IPlayerDataAccess;

  constructor(pickDA: IPickDataAccess, playerDa: IPlayerDataAccess) {
    this.pickDA = pickDA;
    this.playerDA = playerDa;
  }

  selectPlayer(pick: IPick, player: IPlayer): rx.Observable<any> {
    return rx.Observable.concat(
      this.pickDA.setPlayerId(pick.key(), player.key()),
      this.playerDA.setIsTaken(player.key(), true)
    );
  }

  unselectPlayer(pick: IPick): rx.Observable<any> {
    var playerId = pick.playerId; //todo what if playerId is not set? ie they pass in a pick that hasn't been made yet

    return rx.Observable.concat(
      this.pickDA.setPlayerId(pick.key(), ''),
      this.playerDA.setIsTaken(playerId, false)
    );
  }

  changeTeam(pick: IPick, team: ITeam): rx.Observable<any> {
    return this.pickDA.setTeamId(pick.key(), team.key());
  }
}







