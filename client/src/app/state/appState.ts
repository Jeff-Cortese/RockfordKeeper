import { IPlayer } from '../core/players/IPlayer';
import { IPick } from '../core/picks/IPick';
import { IOwner } from '../core/owners/IOwner';

export interface IAppState {
  // server state
  picks: IPick[];
  owners: IOwner[];
  players: IPlayer[];
  currentPick?: IPick;

  selectedOwner?: IOwner;
}

export const initialState: IAppState = {
  picks: [],
  owners: [],
  players: []
};
