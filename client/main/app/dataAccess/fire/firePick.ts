import * as rx from 'rx';
import {FireTraits} from './fireTraits';
import {IPickDataAccess} from '../dataAccessAPI';

export class FirePick extends FireTraits implements IPickDataAccess {
  setPlayerId = (pickId: string, playerId: string): rx.Observable<any> =>
    super.updateObservable(pickId, 'playerId', playerId);

  setTeamId = (pickId: string, teamId: string): rx.Observable<any> =>
    super.updateObservable(pickId, 'teamId', teamId);

  setByWayOf = (pickId: string, byWayOf: string): rx.Observable<any> =>
    super.updateObservable(pickId, 'byWayOf', byWayOf);
}
