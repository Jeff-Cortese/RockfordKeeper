import { IPlayer } from '../players/IPlayer';
import { IWithKey } from '../firebase/IWithKey';

export interface IPick extends IWithKey {
  round: number;
  roundSelection: number;
  overallSelection: number;
  player?: IPlayer;
  teamId: string;
  isKeeper: boolean;
  byWayOf: string;
  timestamp: string;
}
