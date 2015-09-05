import * as rx from 'rx';
import * as endpoints from '../endpoints';
import {FireTraits} from './fireTraits';
import {ICurrentPickDataAccess} from '../dataAccessAPI';

export class FireCurrentPick extends FireTraits implements ICurrentPickDataAccess {
  setCurrentPick = (pickId: string): rx.Observable<any> =>
    super.update('', pickId);

  static create(baseEndpoint: string): FireCurrentPick {
    return new FireCurrentPick(new Firebase(baseEndpoint + endpoints.currentPick));
  }
}
