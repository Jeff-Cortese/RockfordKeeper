import { IPlayer } from '../players/IPlayer';
import { IOwner } from '../owners/IOwner';

export interface IPick {
  round: number;
  roundSelection: number;
  overallSelection: number;
  player: IPlayer;
  owner: IOwner;
  isKeeper: boolean;
}
