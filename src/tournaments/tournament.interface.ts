export interface ITournament {
    readonly id: number;
    readonly challongeId: number;
    readonly challongeIdAlias: string;
    readonly name: string;
    readonly fullChallongeUrl: string;
    readonly gameName: string;
}

export interface ICreateTournament {
    challongeIdAlias: string;
}

export interface IUpdateTournament {
    id: number;
    challongeIdAlias: string;
}
