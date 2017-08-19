import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';

import { OwnersDAO } from '../core/owners/ownersDAO';
import { PicksDAO } from '../core/picks/picksDAO';
import { PlayersDAO } from '../core/players/playersDAO';
import {
  AppAction,
  GetOwnersDoneAction, GetOwnersFailAction,
  GetPicksDoneAction, GetPicksFailAction,
  GetPlayersDoneAction, GetPlayersFailAction,
  ProgressCurrentPick, SelectPlayerAction
} from './appActions';
import { Observable } from 'rxjs/Observable';
import { IPlayer } from '../core/players/IPlayer';
import { IPick } from '../core/picks/IPick';
import { IOwner } from '../core/owners/IOwner';

@Injectable()
export class AppEffects {
  @Effect() fetchOwners: Observable<GetOwnersDoneAction | GetOwnersFailAction> =
    this.action$.ofType('GET_OWNERS')
      .switchMap(() =>
        this.ownersDao.getOwners()
          .map((owners: IOwner[]) => ({ type: 'GET_OWNERS_DONE', owners }))
          .catch((error: Response) => Observable.of({ type: 'GET_OWNERS_FAIL', reason: error }))
      );

  @Effect() fetchPicks: Observable<GetPicksDoneAction | GetPicksFailAction> =
    this.action$.ofType('GET_PICKS')
      .switchMap(() =>
        this.picksDao.getPicks()
          .map((picks: IPick[]) => ({ type: 'GET_PICKS_DONE', picks }))
          .catch((error: Response) => Observable.of({ type: 'GET_PICKS_FAIL', reason: error }))
      );

  @Effect() fetchPlayers: Observable<GetPlayersDoneAction | GetPlayersFailAction> =
    this.action$.ofType('GET_PLAYERS')
      .switchMap(() =>
        this.playersDao.getPlayers()
          .map((players: IPlayer[]) => ({ type: 'GET_PLAYERS_DONE', players }))
          .catch((error: Response) => Observable.of({ type: 'GET_PLAYERS_FAIL', reason: error }))
      );

  @Effect() selectPlayer: Observable<ProgressCurrentPick> =
    this.action$.ofType('SELECT_PLAYER')
      .concatMap(({ pick, player }: SelectPlayerAction) =>
        Observable.merge(this.picksDao.selectPlayer(pick, player))
          .map(() => ({ type: 'PROGRESS_CURRENT_PICK' }))
          .catch(() => Observable.empty()) // todo log or some shit
      );

  constructor(
    private action$: Actions<AppAction>,
    private ownersDao: OwnersDAO,
    private picksDao: PicksDAO,
    private playersDao: PlayersDAO
  ) {}
}
