import * as rx from 'rx';
import {FireTraits} from './fireTraits';
import {IPlayerDataAccess} from '../dataAccessAPI';
import * as endpoints from '../endpoints';

export class FirePlayer extends FireTraits implements IPlayerDataAccess{
  setIsTaken = (playerId: string, isTaken: boolean): rx.Observable<any> =>
    super.update(playerId + '.isTaken', isTaken);

  static create(baseUrl: string) {
    return new FirePlayer(new Firebase(baseUrl + endpoints.players));
  }
}
