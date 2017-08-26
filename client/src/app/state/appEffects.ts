import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { OwnersDAO } from '../core/owners/ownersDAO';
import { PicksDAO } from '../core/picks/picksDAO';
import { PlayersDAO } from '../core/players/playersDAO';
import {
  AppAction, ChangeCurrentPickAction, GetCurrentPickDoneAction, GetCurrentPickFailAction,
  GetOwnersDoneAction, GetOwnersFailAction,
  GetPicksDoneAction, GetPicksFailAction,
  GetPlayersDoneAction, GetPlayersFailAction,
  ProgressCurrentPick, SelectPlayerAction, UnSelectPlayerAction
} from './appActions';
import { IPlayer } from '../core/players/IPlayer';
import { IPick } from '../core/picks/IPick';
import { IOwner } from '../core/owners/IOwner';
import { IAppState } from './appState';

@Injectable()
export class AppEffects {
  @Effect() fetchOwners: Observable<GetOwnersDoneAction | GetOwnersFailAction> =
    this.action$.ofType('GET_OWNERS')
      .switchMap(() =>
        this.ownersDao.getOwners()
          .map((owners: IOwner[]) => <GetOwnersDoneAction> { type: 'GET_OWNERS_DONE', owners })
          .catch((error: Response) => Observable.of(<GetOwnersFailAction> { type: 'GET_OWNERS_FAIL', reason: error }))
      );

  @Effect() fetchPicks: Observable<GetPicksDoneAction | GetPicksFailAction> =
    this.action$.ofType('GET_PICKS')
      .switchMap(() =>
        this.picksDao.getPicks()
          .map((picks: IPick[]) => <GetPicksDoneAction> { type: 'GET_PICKS_DONE', picks })
          .catch((error: Response) => Observable.of(<GetPicksFailAction> { type: 'GET_PICKS_FAIL', reason: error }))
      );

  @Effect() fetchPlayers: Observable<GetPlayersDoneAction | GetPlayersFailAction> =
    this.action$.ofType('GET_PLAYERS')
      .switchMap(() =>
        this.playersDao.getPlayers()
          .map((players: IPlayer[]) => <GetPlayersDoneAction> { type: 'GET_PLAYERS_DONE', players })
          .catch((error: Response) => Observable.of(<GetPlayersFailAction> { type: 'GET_PLAYERS_FAIL', reason: error }))
      );

  @Effect() getCurrentPick: Observable<GetCurrentPickDoneAction | GetCurrentPickFailAction> =
    this.action$.ofType('GET_CURRENT_PICK')
      .switchMap(() =>
        this.picksDao.getCurrentPick()
          .map((pick: IPick) => <GetCurrentPickDoneAction> { type: 'GET_CURRENT_PICK_DONE', pick })
          .catch((error: Response) => Observable.of(<GetCurrentPickFailAction> { type: 'GET_CURRENT_PICK_FAIL', reason: error }))
      );

  @Effect() selectPlayer: Observable<ProgressCurrentPick> =
    this.action$.ofType('SELECT_PLAYER')
      .withLatestFrom(this.store.select('app'))
      .concatMap(([{ player }, state]: [SelectPlayerAction, IAppState]) =>
        Observable.merge(
          this.picksDao.selectPlayer(
            state.currentPick,
            player,
            _.find(state.picks, (p: IPick) => p.overallSelection !== state.currentPick.overallSelection && _.isUndefined(p.player))
          )
        )
          .ignoreElements()// todo log or some shit
      );

  @Effect() unselectPlayer: Observable<ProgressCurrentPick> =
    this.action$.ofType('UNSELECT_PLAYER')
      .withLatestFrom(this.store.select('app'))
      .concatMap(([{ pick }, state]: [UnSelectPlayerAction, IAppState]) =>
        Observable.merge(
          this.picksDao.unselectPlayer(pick, _.find(state.players, (p: IPlayer) => p.espnPlayerId === pick.player.espnPlayerId))
        )
          .ignoreElements()// todo log or some shit
      );

  @Effect() changeCurrentPick: Observable<GetCurrentPickDoneAction> =
    this.action$.ofType('CHANGE_CURRENT_PICK')
      .switchMap(({ newPick }: ChangeCurrentPickAction) => this.picksDao.changeCurrentPick(newPick))
      .ignoreElements();

  constructor(
    private action$: Actions<AppAction>,
    private ownersDao: OwnersDAO,
    private picksDao: PicksDAO,
    private playersDao: PlayersDAO,
    private store: Store<any>
  ) {}
}
