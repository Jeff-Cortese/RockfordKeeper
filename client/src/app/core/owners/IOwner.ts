import { IPlayer } from '../players/IPlayer';

export interface IOwner {
  name: string;
  teamName: string;

  roster?: IRoster;
}

export interface IRoster {
  qb: IPlayer;
  rb1: IPlayer;
  rb2: IPlayer;
  wr1: IPlayer;
  wr2: IPlayer;
  te: IPlayer;
  flx: IPlayer;
  dst: IPlayer;
  k: IPlayer;

  bench: IPlayer[];
}
