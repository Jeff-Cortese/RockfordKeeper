import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable, of, merge } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, ignoreElements, concatMap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

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
    this.action$.pipe(
      ofType('GET_OWNERS'),
      switchMap(() =>
        this.ownersDao.getOwners().pipe(
          map((owners: IOwner[]) => <GetOwnersDoneAction> { type: 'GET_OWNERS_DONE', owners }),
          catchError((error: Response) => of(<GetOwnersFailAction> { type: 'GET_OWNERS_FAIL', reason: error }))
        )
      )
    );

  @Effect() fetchPicks: Observable<GetPicksDoneAction | GetPicksFailAction> =
    this.action$.pipe(
      ofType('GET_PICKS'),
      switchMap(() =>
        this.picksDao.getPicks().pipe(
          map((picks: IPick[]) => <GetPicksDoneAction> { type: 'GET_PICKS_DONE', picks }),
          catchError((error: Response) => of(<GetPicksFailAction> { type: 'GET_PICKS_FAIL', reason: error }))
        )
      )
    );

  @Effect() fetchPlayers: Observable<GetPlayersDoneAction | GetPlayersFailAction> =
    this.action$.pipe(
      ofType('GET_PLAYERS'),
      switchMap(() =>
        this.playersDao.getPlayers().pipe(
          map((players: IPlayer[]) => <GetPlayersDoneAction> { type: 'GET_PLAYERS_DONE', players }),
          catchError((error: Response) => of(<GetPlayersFailAction> { type: 'GET_PLAYERS_FAIL', reason: error }))
        )
      )
    );

  @Effect() getCurrentPick: Observable<GetCurrentPickDoneAction | GetCurrentPickFailAction> =
    this.action$.pipe(
      ofType('GET_CURRENT_PICK'),
      switchMap(() =>
        this.picksDao.getCurrentPick().pipe(
          map((pick: IPick) => <GetCurrentPickDoneAction> { type: 'GET_CURRENT_PICK_DONE', pick }),
          catchError((error: Response) => of(<GetCurrentPickFailAction> { type: 'GET_CURRENT_PICK_FAIL', reason: error }))
        )
      )
    );

  @Effect() selectPlayer: Observable<ProgressCurrentPick> =
    this.action$.pipe(
      ofType('SELECT_PLAYER'),
      withLatestFrom(this.store.pipe(select('app'))),
      concatMap(([{ player }, state]: [SelectPlayerAction, IAppState]) =>
        merge(
          this.picksDao.selectPlayer(
            state.currentPick,
            player,
            _.find(state.picks, (p: IPick) => p.overallSelection !== state.currentPick.overallSelection && _.isUndefined(p.player))
          )
        ).pipe(
          ignoreElements()// todo log or something
        )
      )
    );

  @Effect() unselectPlayer: Observable<ProgressCurrentPick> =
    this.action$.pipe(
      ofType('UNSELECT_PLAYER'),
      withLatestFrom(this.store.pipe(select('app'))),
      concatMap(([{ pick }, state]: [UnSelectPlayerAction, IAppState]) =>
        merge(
          this.picksDao.unselectPlayer(pick, _.find(state.players, (p: IPlayer) => p.espnPlayerId === pick.player.espnPlayerId))
        ).pipe(
          ignoreElements()// todo log or something
        )
      )
    );

  @Effect() changeCurrentPick: Observable<any> =
    this.action$.pipe(
      ofType('CHANGE_CURRENT_PICK'),
      switchMap(({ newPick }: ChangeCurrentPickAction) => this.picksDao.changeCurrentPick(newPick)),
      ignoreElements()
    );

  constructor(
    private action$: Actions<AppAction>,
    private ownersDao: OwnersDAO,
    private picksDao: PicksDAO,
    private playersDao: PlayersDAO,
    private store: Store<any>
  ) {}
}
