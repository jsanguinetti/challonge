import { IUser } from '../users/user.interface';

export interface IRankingEntry {
  position: number;
  points: number;
  points_to_defend: number;
  rankingWeekNumber: number;
  wonVsLostMatches: number;
  wonVsLostSets: number;
  rankDelta: number;
  user?: IUser;
}
