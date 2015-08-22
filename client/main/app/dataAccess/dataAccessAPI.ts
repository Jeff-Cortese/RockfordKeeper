import * as rx from 'rx';

export interface IPlayerDataAccess {
  setIsTaken: (playerId: string, isTaken: boolean) => rx.Observable<any>;
}

export interface IPickDataAccess {
  setPlayerId: (pickId: string, playerId: string) => rx.Observable<any>;
  setTeamId: (pickId: string, teamId: string) => rx.Observable<any>;
  setByWayOf: (pickId: string, byWayOf: string) => rx.Observable<any>;
}
