import { Response } from '@angular/http';

import { IPick } from '../core/picks/IPick';
import { IOwner } from '../core/owners/IOwner';
import { IPlayer } from '../core/players/IPlayer';
import { SnapshotAction } from 'angularfire2/database';

export interface GetPicksAction { type: 'GET_PICKS'; }
export interface GetPicksDoneAction { type: 'GET_PICKS_DONE'; picks: SnapshotAction<IPick>[]; }
export interface GetPicksFailAction { type: 'GET_PICKS_FAIL'; reason: Response; }

export interface GetOwnersAction { type: 'GET_OWNERS'; }
export interface GetOwnersDoneAction { type: 'GET_OWNERS_DONE'; owners: SnapshotAction<IOwner>[]; }
export interface GetOwnersFailAction { type: 'GET_OWNERS_FAIL'; reason: Response; }

export interface GetPlayersAction { type: 'GET_PLAYERS'; }
export interface GetPlayersDoneAction { type: 'GET_PLAYERS_DONE'; players: SnapshotAction<IPlayer>[]; }
export interface GetPlayersFailAction { type: 'GET_PLAYERS_FAIL'; reason: Response; }

export interface GetCurrentPickAction { type: 'GET_CURRENT_PICK'; }
export interface GetCurrentPickDoneAction { type: 'GET_CURRENT_PICK_DONE'; pick: SnapshotAction<IPick>; }
export interface GetCurrentPickFailAction { type: 'GET_CURRENT_PICK_FAIL'; reason: Response; }

export interface SelectPlayerAction { type: 'SELECT_PLAYER'; player: SnapshotAction<IPlayer>; }
export interface UnSelectPlayerAction { type: 'UNSELECT_PLAYER'; pick: SnapshotAction<IPick>; }

export interface ChangePickOwner { type: 'CHANGE_PICK_OWNER'; pick: IPick; newOwner: SnapshotAction<IOwner>; }
export interface ChangeCurrentPickAction { type: 'CHANGE_CURRENT_PICK'; newPick: SnapshotAction<IPick>; }
export interface SelectionChangingDone { type: 'SELECTION_CHANGING_DONE'; }
export interface MakeAdminAction { type: 'MAKE_USER_ADMIN'; }

export type AppAction =
  GetPicksAction | GetPicksDoneAction | GetPicksFailAction |
  GetOwnersAction | GetOwnersDoneAction | GetOwnersFailAction |
  GetPlayersAction | GetPlayersDoneAction | GetPlayersFailAction |
  GetCurrentPickAction | GetCurrentPickDoneAction | GetCurrentPickFailAction |
  SelectPlayerAction | UnSelectPlayerAction |
  ChangePickOwner |
  ChangeCurrentPickAction |
  SelectionChangingDone |
  MakeAdminAction;
