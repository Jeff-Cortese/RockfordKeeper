import { IWithKey } from '../firebase/IWithKey';

export interface IPlayer extends IWithKey {
  espnPlayerId: string;
  name: string;
  position: Position;
  team: string; // todo enum the teams
  byeWeek: number;
  espnRank: number;
  projection: number;
  lastYearPoints?: number;
  tns?: string;
  isTaken: boolean;
  ownerId?: string;
}

export type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'DST' | 'K';
