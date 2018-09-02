import { IPlayer } from '../core/players/IPlayer';
import { IPick } from '../core/picks/IPick';
import { IOwner } from '../core/owners/IOwner';
import { SnapshotAction } from 'angularfire2/database';

export interface IAppState {
  isLoadingPicks: boolean;
  isLoadingPlayers: boolean;
  isLoadingOwners: boolean;
  isAdmin: boolean;

  // server state
  picks: SnapshotAction<IPick>[];
  owners: SnapshotAction<IOwner>[];
  players: SnapshotAction<IPlayer>[];
  currentPick?: SnapshotAction<IPick>;
}

export const initialState: IAppState = {
  isLoadingPicks: true,
  isLoadingPlayers: true,
  isLoadingOwners: true,
  isAdmin: false,

  picks: [],
  owners: [],
  players: []
};

export interface IRockfordKeeper {
  app: IAppState;
}

