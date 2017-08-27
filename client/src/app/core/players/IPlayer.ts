import { IWithKey } from '../firebase/IWithKey';

export interface IPlayer extends IWithKey {
  espnPlayerId: string;
  name: string;
  lowerName: string;
  position: PlayerPosition;
  team: string; // todo enum the teams
  bye: number;
  espnRank: number;
  projection: number;
  lastYearPoints?: number;
  tns?: string;
  isTaken: boolean;
  ownerId?: string;
}

export type PlayerPosition = 'QB' | 'RB' | 'WR' | 'TE' | 'D/ST' | 'K';
