import { IPlayer } from '../core/players/IPlayer';
import { IPick } from '../core/picks/IPick';
import { IOwner } from '../core/owners/IOwner';
import { SnapshotAction } from '@angular/fire/database';

export interface IAppState {
  isLoadingPicks: boolean;
  isLoadingPlayers: boolean;
  isLoadingOwners: boolean;
  isSelectingPlayer: boolean;
  isUnselectingPlayer: boolean;
  isSelectionChanging: boolean;
  isAdmin: boolean;
  showDepth: boolean;

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
  isSelectingPlayer: false,
  isUnselectingPlayer: false,
  isSelectionChanging: false,
  isAdmin: false,
  showDepth: false,

  picks: [],
  owners: [],
  players: []
};

export interface IRockfordKeeper {
  app: IAppState;
}

