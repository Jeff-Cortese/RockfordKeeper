import * as rx from 'rx';
import {FireTraits} from './fireTraits';
import {IPlayerDataAccess} from '../dataAccessAPI';

export class FirePlayer extends FireTraits implements IPlayerDataAccess{
  setIsTaken = (playerId:string, isTaken: boolean): rx.Observable<any> =>
    super.updateObservable(playerId, 'isTaken', isTaken);
}
