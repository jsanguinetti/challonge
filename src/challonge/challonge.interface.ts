export interface IChallongeUser {
  readonly id: number;
  readonly challongeUsername: string;
  readonly attachedParticipatablePortraitUrl: string;
}

export interface IChallongeTournament {
  readonly id: number;
  readonly fullChallongeUrl: string;
  readonly gameName: string;
  readonly name: string;
}
