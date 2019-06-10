import { IUser } from './user.interface';
import { Participation } from './entities/participation.entity';

export class UserWithParticipations implements IUser {
  public id: number;
  public externalId: string;
  public challongeUsername: string;
  public challongeAvatarUrl: string;
  public participations: Participation[];

  constructor(user: IUser, participations: Participation[]) {
    this.id = user.id;
    this.externalId = user.externalId;
    this.challongeUsername = user.challongeUsername;
    this.challongeAvatarUrl = user.challongeAvatarUrl;
    this.participations = participations;
  }

  challongeId(tournamentId: number) {
    const participation = this.participations.find(
      p => p.tournament_id === tournamentId
    );
    return participation && participation.challonge_id;
  }

  isParticipant(tournamentId: number) {
    return this.participations.some(p => p.tournament_id === tournamentId);
  }

  getLatestTournamentId() {
    const participation = this.participations.sort(
      (p1, p2) => p2.tournament_id - p1.tournament_id
    )[0];
    return participation && participation.tournament_id;
  }
}
