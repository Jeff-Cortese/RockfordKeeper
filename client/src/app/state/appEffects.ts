import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, ignoreElements, concatMap, filter } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { drop, find, isUndefined } from 'lodash-es';

import { OwnersDAO } from '../core/owners/ownersDAO';
import { PicksDAO } from '../core/picks/picksDAO';
import { PlayersDAO } from '../core/players/playersDAO';
import {
  AppAction, ChangeCurrentPickAction, GetCurrentPickDoneAction, GetCurrentPickFailAction,
  GetOwnersDoneAction, GetOwnersFailAction,
  GetPicksDoneAction, GetPicksFailAction,
  GetPlayersDoneAction, GetPlayersFailAction,
  SelectionChangingDone, SelectPlayerAction, UnSelectPlayerAction
} from './appActions';
import { IPlayer } from '../core/players/IPlayer';
import { IPick } from '../core/picks/IPick';
import { IOwner } from '../core/owners/IOwner';
import { IAppState } from './appState';
import { SnapshotAction } from 'angularfire2/database';

@Injectable()
export class AppEffects {
  @Effect() fetchOwners: Observable<GetOwnersDoneAction | GetOwnersFailAction> =
    this.action$.pipe(
      ofType('GET_OWNERS'),
      switchMap(() =>
        this.ownersDao.getOwners().pipe(
          map((owners: SnapshotAction<IOwner>[]) => <GetOwnersDoneAction> { type: 'GET_OWNERS_DONE', owners }),
          catchError((error: Response) => of(<GetOwnersFailAction> { type: 'GET_OWNERS_FAIL', reason: error }))
        )
      )
    );

  @Effect() fetchPicks: Observable<GetPicksDoneAction | GetPicksFailAction> =
    this.action$.pipe(
      ofType('GET_PICKS'),
      switchMap(() =>
        this.picksDao.getPicks().pipe(
          map((picks: SnapshotAction<IPick>[]) => <GetPicksDoneAction> { type: 'GET_PICKS_DONE', picks }),
          catchError((error: Response) => of(<GetPicksFailAction> { type: 'GET_PICKS_FAIL', reason: error }))
        )
      )
    );

  @Effect() fetchPlayers: Observable<GetPlayersDoneAction | GetPlayersFailAction> =
    this.action$.pipe(
      ofType('GET_PLAYERS'),
      switchMap(() =>
        this.playersDao.getPlayers().pipe(
          map((players: SnapshotAction<IPlayer>[]) => <GetPlayersDoneAction> { type: 'GET_PLAYERS_DONE', players }),
          catchError((error: Response) => of(<GetPlayersFailAction> { type: 'GET_PLAYERS_FAIL', reason: error }))
        )
      )
    );

  @Effect() getCurrentPick: Observable<GetCurrentPickDoneAction | GetCurrentPickFailAction> =
    this.action$.pipe(
      ofType('GET_CURRENT_PICK'),
      switchMap(() =>
        this.picksDao.getCurrentPick().pipe(
          map((pick: SnapshotAction<IPick>) => <GetCurrentPickDoneAction> { type: 'GET_CURRENT_PICK_DONE', pick }),
          catchError((error: Response) => of(<GetCurrentPickFailAction> { type: 'GET_CURRENT_PICK_FAIL', reason: error }))
        )
      )
    );

  @Effect() selectPlayer: Observable<SelectionChangingDone> =
    this.action$.pipe(
      ofType('SELECT_PLAYER'),
      withLatestFrom(this.store.pipe(select('app'))),
      filter(([ignored, state]) => !state.isUnselectingPlayer),
      concatMap(([{ player }, state]: [SelectPlayerAction, IAppState]) => {
        const picksAfterCurrent = drop(state.picks, state.currentPick.payload.val().overallSelection);
        const nextPick = find(picksAfterCurrent, pick => isUndefined(pick.payload.val().player));
        const getFallBackNextPick = () => find(state.picks, pick =>
          pick.payload.val().overallSelection !== state.currentPick.payload.val().overallSelection &&
          isUndefined(pick.payload.val().player)
        );
        return this.picksDao.selectPlayer(
          state.currentPick,
          player,
          nextPick || getFallBackNextPick()
        ).pipe(
          map(() => <SelectionChangingDone>{ type: 'SELECTION_CHANGING_DONE' }),
          catchError(() => of(<SelectionChangingDone>{ type: 'SELECTION_CHANGING_DONE' }))
        );
      })
    );

  @Effect() unselectPlayer: Observable<SelectionChangingDone> =
    this.action$.pipe(
      ofType('UNSELECT_PLAYER'),
      withLatestFrom(this.store.pipe(select('app'))),
      filter(([ignored, state]) => !state.isSelectingPlayer),
      concatMap(([{ pick }, state]: [UnSelectPlayerAction, IAppState]) =>
        this.picksDao.unselectPlayer(pick, find(state.players, p => p.payload.val().espnPlayerId === pick.payload.val().player.espnPlayerId))
          .pipe(
            map(() => <SelectionChangingDone> { type: 'SELECTION_CHANGING_DONE' }),
            catchError(() => of(<SelectionChangingDone> { type: 'SELECTION_CHANGING_DONE' })) // todo this is probs the undo bug
          )
      )
    );

  @Effect() changeCurrentPick: Observable<any> =
    this.action$.pipe(
      ofType('CHANGE_CURRENT_PICK'),
      withLatestFrom(this.store.pipe(select('app'))),
      filter(([ignored, state]) => !state.isSelectionChanging),
      concatMap(([{ newPick }, ignored]: [ChangeCurrentPickAction, IAppState]) => this.picksDao.changeCurrentPick(newPick.payload.val())),
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
