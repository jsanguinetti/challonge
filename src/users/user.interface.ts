import { Participation } from './entities/participation.entity';

export interface IUser {
  readonly id: number;
  readonly externalId: string;
  readonly challongeUsername: string;
  readonly challongeAvatarUrl: string;
}

export interface ICreateUser {
  externalId?: string;
  challongeUsername: string;
  tournamentId?: number;
}

export interface IDbUser {
  external_id: string;
  challonge_username: string;
}
