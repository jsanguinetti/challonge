export interface IUser {
  readonly id: number;
  readonly externalId: string;
  readonly challongeId: number;
  readonly challongeUsername: string;
  readonly challongeAvatarUrl: string;
}

export interface ICreateUser {
  externalId: string;
  challongeUsername: string;
}

export interface IDbUser {
  external_id: string;
  challonge_username: string;
}
