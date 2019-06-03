export interface IUser {
    readonly externalId: string;
    readonly externalUsername: string;
    readonly challongeUsername: string;
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
