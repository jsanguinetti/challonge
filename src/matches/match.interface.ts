import { IUser } from '../users/user.interface';
import { ITournament } from '../tournaments/tournament.interface';

export interface IMatch {
  player1: IUser;
  player2: IUser;
  adversary: IUser;
  winner: IUser;
  loser: IUser;
  score: string;
  matchNumber: number;
  state: 'complete' | 'open';
}

export interface IMatchesResponse {
  tournament: ITournament;
  matches: IMatch[];
}
