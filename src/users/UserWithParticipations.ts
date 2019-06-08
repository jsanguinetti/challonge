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
}
