import { Injectable } from '@nestjs/common';
import { ChallongeApiService } from '../challongeApi/challongeApi.service';
import { ITournamentParticipant, ITournament } from '../challongeApi/challongeApi.interface';
import { IChallongeTournament, IChallongeUser, IChallongeMatch } from './challonge.interface';

type FindByParams = {
  challongeId?: number;
  challongeUsername?: string;
  tournamentId: number;
};
@Injectable()
export class ChallongeService {

  constructor(
    private readonly challongeApiService: ChallongeApiService
  ) { }

  public async getMatches(tournamentChallongeId: number, userChallongeId: number): Promise<IChallongeMatch[]> {
    const matchesResponse = await this.challongeApiService.tournamentMatches({ tournamentId: tournamentChallongeId, participantId: userChallongeId });
    return matchesResponse.map(({ match }) => {
      return {
        ...match,
        state: match.state,
        player1Id: match.player1_id,
        player2Id: match.player2_id,
        score: match.scores_csv,
        winnerId: match.winner_id,
        loserId: match.loser_id,
        suggestedPlayOrder: match.suggested_play_order
      };
    });
  }

  public async findUserById(challongeId: number, tournamentId: number): Promise<IChallongeUser> {
    return this.findBy({ challongeId, tournamentId });
  }

  public async findUser(challongeUsername: string, tournamentId: number): Promise<IChallongeUser> {
    return this.findBy({ challongeUsername, tournamentId });
  }

  public async getTournament(challongeIdAlias: string): Promise<IChallongeTournament> {
    const tournament = (await this.challongeApiService.tournament(challongeIdAlias)).tournament;
    return {
      ...tournament,
      fullChallongeUrl: tournament.full_challonge_url,
      gameName: tournament.game_name
    };
  }

  public avatarUrl(challongeUser: IChallongeUser) {
    if (challongeUser.attachedParticipatablePortraitUrl.startsWith('//')) {
      return 'https:' + challongeUser.attachedParticipatablePortraitUrl;
    } else {
      return challongeUser.attachedParticipatablePortraitUrl;
    }
  }

  private async findBy(findByParams: FindByParams): Promise<IChallongeUser> {
    const participantsResponse = await this.challongeApiService.tournamentParticipants({ tournamentId: findByParams.tournamentId });
    const participants: ITournamentParticipant[] = participantsResponse.map((p) => p.participant);
    const finderFunction = findByParams.challongeId ?
      (p: ITournamentParticipant) => findByParams.challongeId == p.id :
      (p: ITournamentParticipant) => findByParams.challongeUsername == p.challonge_username;
    const participant = participants.find(finderFunction);
    return {
      ...participant,
      challongeUsername: participant.challonge_username,
      attachedParticipatablePortraitUrl: participant.attached_participatable_portrait_url,
    };
  }
}
