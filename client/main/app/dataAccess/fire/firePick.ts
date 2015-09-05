import * as rx from 'rx';
import {FireTraits} from './fireTraits';
import {IPickDataAccess} from '../dataAccessAPI';
import * as endpoints from '../endpoints';

export class FirePick extends FireTraits implements IPickDataAccess {
  setPlayerId = (pickId: string, playerId: string): rx.Observable<any> =>
    super.update(pickId + '.playerId', playerId);

  setTeamId = (pickId: string, teamId: string): rx.Observable<any> =>
    super.update(pickId + '.teamId', teamId);

  setByWayOf = (pickId: string, byWayOf: string): rx.Observable<any> =>
    super.update(pickId + '.byWayOf', byWayOf);

  static create(baseUrl: string) {
    return new FirePick(new Firebase(baseUrl + endpoints.picks))
  }
}
