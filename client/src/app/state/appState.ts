import { IPlayer } from '../core/players/IPlayer';
import { IPick } from '../core/picks/IPick';
import { IOwner } from '../core/owners/IOwner';

export interface IAppState {
  isLoadingPicks: boolean;
  isLoadingPlayers: boolean;
  isLoadingOwners: boolean;

  // server state
  picks: IPick[];
  owners: IOwner[];
  players: IPlayer[];
  currentPick?: IPick;

  selectedOwner?: IOwner;
}

export const initialState: IAppState = {
  isLoadingPicks: true,
  isLoadingPlayers: true,
  isLoadingOwners: true,

  picks: [],
  owners: [],
  players: []
};
