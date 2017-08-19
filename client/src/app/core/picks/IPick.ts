import { IPlayer } from '../players/IPlayer';

export interface IPick {
  round: number;
  roundSelection: number;
  overallSelection: number;
  player: IPlayer;
  teamId: string;
  isKeeper: boolean;
  byWayOf: string;
}
