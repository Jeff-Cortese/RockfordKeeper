import {IHasKey} from './IHasKey';

export interface IPick extends IHasKey{
  round: number;
  roundPick: number;
  overallPick: number;
  playerId: string;
  teamId: string;
  byWayOf: string;
}
