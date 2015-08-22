import FireTraits from './fireTraits';

export default class FirePick extends FireTraits implements IPickDataAccess {
  setPlayerId = (pickId: string, playerId: string): rx.Observable<any> =>
    super.updateObservable(pickId, 'playerId', playerId);

  setTeamId = (pickId: string, teamId: string): rx.Observable<any> =>
    super.updateObservable(pickId, 'teamId', teamId);

  setByWayOf = (pickId: string, byWayOf: string): rx.Observable<any> =>
    super.updateObservable(pickId, 'byWayOf', byWayOf);
}
