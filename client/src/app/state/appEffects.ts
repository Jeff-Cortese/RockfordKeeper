import { Injectable } from '@angular/core';
import { HttpErrorResponse as Response } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, ignoreElements, concatMap, filter, tap } from 'rxjs/operators';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { drop, find, isUndefined } from 'lodash-es';

import { OwnersDAO } from '../core/owners/ownersDAO';
import { PicksDAO } from '../core/picks/picksDAO';
import { PlayersDAO } from '../core/players/playersDAO';
/*import {
  AppActions, ChangeCurrentPickAction, GetCurrentPickDoneAction, GetCurrentPickFailAction,
  GetOwnersDoneAction, GetOwnersFailAction,
  GetPicksDoneAction, GetPicksFailAction,
  GetPlayersDoneAction, GetPlayersFailAction,
  SelectionChangingDone, SelectPlayerAction, UnSelectPlayerAction
} from './appActions';*/
import { IPlayer } from '../core/players/IPlayer';
import { IPick } from '../core/picks/IPick';
import { IOwner } from '../core/owners/IOwner';
import { GetOwnersAction, GetOwnersDoneAction, GetOwnersFailAction } from './appActions';
import { IAppState } from './appState';
import { SnapshotAction } from '@angular/fire/database';

@Injectable()
export class AppEffects {
  fetchOwners = createEffect(() =>
    this.action$.pipe(
      ofType(GetOwnersAction),
      switchMap(() =>
        this.ownersDao.getOwners().pipe(
          map((owners: SnapshotAction<IOwner>[]) => GetOwnersDoneAction({ owners })),
          catchError((error: Response) => of(GetOwnersFailAction({ reason: error })))
        )
      )
    )
  );

  fetchPicks: Observable<any> = createEffect(() =>
    this.action$.pipe(
      ofType('GET_PICKS'),
      switchMap(() =>
        this.picksDao.getPicks().pipe(
          map((picks: SnapshotAction<IPick>[]) => <any> { type: 'GET_PICKS_DONE', picks }),
          catchError((error: Response) => of(<any> { type: 'GET_PICKS_FAIL', reason: error }))
        )
      )
    )
  );

  fetchPlayers: Observable<any> = createEffect(() =>
    this.action$.pipe(
      ofType('GET_PLAYERS'),
      switchMap(() =>
        this.playersDao.getPlayers().pipe(
          map((players: SnapshotAction<IPlayer>[]) => <any> { type: 'GET_PLAYERS_DONE', players }),
          catchError((error: Response) => of(<any> { type: 'GET_PLAYERS_FAIL', reason: error }))
        )
      )
    )
  );

  getCurrentPick: Observable<any> = createEffect(() =>
    this.action$.pipe(
      ofType('GET_CURRENT_PICK'),
      switchMap(() =>
        this.picksDao.getCurrentPick().pipe(
          map((pick: SnapshotAction<IPick>) => <any> { type: 'GET_CURRENT_PICK_DONE', pick }),
          catchError((error: Response) => of(<any> { type: 'GET_CURRENT_PICK_FAIL', reason: error }))
        )
      )
    )
  );

  selectPlayer: Observable<any> = createEffect(() =>
    this.action$.pipe(
      ofType('SELECT_PLAYER'),
      withLatestFrom(this.store.pipe(select('app'))),
      filter(([ignored, state]) => !state.isUnselectingPlayer),
      concatMap(([{ player }, state]: [any, IAppState]) => {
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
          map(() => <any>{ type: 'SELECTION_CHANGING_DONE' }),
          catchError(() => of(<any>{ type: 'SELECTION_CHANGING_DONE' }))
        );
      })
    )
  );

  unselectPlayer: Observable<any> = createEffect(() =>
    this.action$.pipe(
      ofType('UNSELECT_PLAYER'),
      withLatestFrom(this.store.pipe(select('app'))),
      filter(([ignored, state]) => !state.isSelectingPlayer),
      concatMap(([{ pick }, state]: [any, IAppState]) =>
        this.picksDao.unselectPlayer(pick, find(state.players, p => p.payload.val().espnPlayerId === pick.payload.val().player.espnPlayerId))
          .pipe(
            map(() => <any> { type: 'SELECTION_CHANGING_DONE' }),
            catchError(() => of(<any> { type: 'SELECTION_CHANGING_DONE' })) // todo this is probs the undo bug
          )
      )
    )
  );

  changeCurrentPick: Observable<any> = createEffect(() => <any>
    this.action$.pipe(
      ofType('CHANGE_CURRENT_PICK'),
      withLatestFrom(this.store.pipe(select('app'))),
      filter(([ignored, state]) => !state.isSelectionChanging),
      concatMap(([{ newPick }, ignored]: [any, IAppState]) => this.picksDao.changeCurrentPick(newPick.payload.val())),
    ),
    { dispatch: false }
  );

  constructor(
    private action$: Actions<any>,
    private ownersDao: OwnersDAO,
    private picksDao: PicksDAO,
    private playersDao: PlayersDAO,
    private store: Store<any>
  ) {}
}
