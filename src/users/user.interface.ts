export interface IUser {
    readonly id: number;
    readonly externalId: string;
    readonly challongeId: number;
    readonly externalUsername: string;
    readonly challongeUsername: string;
    readonly challongeAvatarUrl: string;
}

export interface ICreateUser {
    externalId: string;
    externalUsername: string;
    challongeUsername: string;
}

export interface IDbUser {
    external_id: string;
    external_username: string;
    challonge_username: string;
}
