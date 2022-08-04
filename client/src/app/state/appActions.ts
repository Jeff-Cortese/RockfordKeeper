import { HttpErrorResponse as Response } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { IPick } from '../core/picks/IPick';
import { IOwner } from '../core/owners/IOwner';
import { IPlayer } from '../core/players/IPlayer';
import { SnapshotAction } from '@angular/fire/database';

export const GetPicksAction = createAction('GET_PICKS');
export const GetPicksDoneAction = createAction('GET_PICKS_DONE', props<{ picks: SnapshotAction<IPick>[] }>());
export const GetPicksFailAction = createAction('GET_PICKS_FAIL', props<{ reason: Response }>());

export const GetOwnersAction = createAction('GET_OWNERS');
export const GetOwnersDoneAction = createAction('GET_OWNERS_DONE', props<{ owners: SnapshotAction<IOwner>[] }>());
export const GetOwnersFailAction = createAction('GET_OWNERS_FAIL', props<{ reason: Response }>());

export const GetPlayersAction = createAction('GET_PLAYERS');
export const GetPlayersDoneAction = createAction('GET_PLAYERS_DONE', props<{ players: SnapshotAction<IPlayer>[] }>());
export const GetPlayersFailAction = createAction('GET_PLAYERS_FAIL', props<{ reason: Response }>());

export const GetCurrentPickAction = createAction('GET_CURRENT_PICK');
export const GetCurrentPickDoneAction = createAction('GET_CURRENT_PICK_DONE', props<{ pick: SnapshotAction<IPick> }>());
export const GetCurrentPickFailAction = createAction('GET_CURRENT_PICK_FAIL', props<{ reason: Response }>());

export const SelectPlayerAction = createAction('SELECT_PLAYER', props<{ player: SnapshotAction<IPlayer> }>());
export const UnSelectPlayerAction = createAction('UNSELECT_PLAYER', props<{ pick: SnapshotAction<IPick> }>());

export const ChangePickOwner = createAction('CHANGE_PICK_OWNER', props<{ pick: IPick, newOwner: SnapshotAction<IOwner> }>());
export const ChangeCurrentPickAction = createAction('CHANGE_CURRENT_PICK', props<{ newPick: SnapshotAction<IPick> }>());
export const SelectionChangingDone = createAction('SELECTION_CHANGING_DONE');
export const MakeAdminAction = createAction('MAKE_USER_ADMIN');

export const AppActions = [
  GetPicksAction, GetPicksDoneAction, GetPicksFailAction,
  GetOwnersAction, GetOwnersDoneAction, GetOwnersFailAction,
  GetPlayersAction, GetPlayersDoneAction, GetPlayersFailAction,
  GetCurrentPickAction, GetCurrentPickDoneAction, GetCurrentPickFailAction,
  SelectPlayerAction, UnSelectPlayerAction,
  ChangePickOwner,
  ChangeCurrentPickAction,
  SelectionChangingDone,
  MakeAdminAction
];
