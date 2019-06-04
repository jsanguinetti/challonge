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

export interface IChallongeMatch {
  readonly id: number;
  readonly state: 'complete' | 'open';
  readonly player1Id: number;
  readonly player2Id: number;
  readonly score: string;
  readonly winnerId: number;
  readonly loserId: number;
  readonly suggestedPlayOrder: number;
}
