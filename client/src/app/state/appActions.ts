import { Response } from '@angular/http';
import { IPick } from '../core/picks/IPick';
import { IOwner } from '../core/owners/IOwner';
import { IPlayer } from '../core/players/IPlayer';

export interface GetPicksAction { type: 'GET_PICKS'; }
export interface GetPicksDoneAction { type: 'GET_PICKS_DONE'; picks: IPick[]; }
export interface GetPicksFailAction { type: 'GET_PICKS_FAIL'; reason: Response; }

export interface GetOwnersAction { type: 'GET_OWNERS'; }
export interface GetOwnersDoneAction { type: 'GET_OWNERS_DONE'; owners: IOwner[]; }
export interface GetOwnersFailAction { type: 'GET_OWNERS_FAIL'; reason: Response; }

export interface GetPlayersAction { type: 'GET_PLAYERS'; }
export interface GetPlayersDoneAction { type: 'GET_PLAYERS_DONE'; players: IPlayer[]; }
export interface GetPlayersFailAction { type: 'GET_PLAYERS_FAIL'; reason: Response; }

export interface SelectPlayerAction { type: 'SELECT_PLAYER'; player: IPlayer; pick: IPick; }
export interface UnSelectPlayerAction { type: 'UNSELECT_PLAYER'; pick: IPick; }
export interface ProgressCurrentPick { type: 'PROGRESS_CURRENT_PICK'; }

export interface ChangePickOwner { type: 'CHANGE_PICK_OWNER'; pick: IPick; newOwner: IOwner; }


export type AppAction =
  GetPicksAction | GetPicksDoneAction | GetPicksFailAction |
  GetOwnersAction | GetOwnersDoneAction | GetOwnersFailAction |
  GetPlayersAction | GetPlayersDoneAction | GetPlayersFailAction |
  SelectPlayerAction | UnSelectPlayerAction |
  ChangePickOwner;
