import { IWithKey } from '../firebase/IWithKey';

export interface IPlayer extends IWithKey {
  espnPlayerId: string;
  name: string;
  firstName: string;
  lastName: string;
  lowerName: string;
  position: PlayerPosition;
  team: string;
  bye: number;
  espnRank: number;
  projection: number;
  projectedAverage: number;
  lastYearPoints?: number;
  injuryStatus?: string;
  isInjured: boolean;
  isTaken: boolean;
  ownerId?: string;
}

export type PlayerPosition = 'QB' | 'RB' | 'WR' | 'TE' | 'D/ST' | 'K';
