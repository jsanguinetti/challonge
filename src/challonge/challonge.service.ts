import { Injectable } from '@nestjs/common';
import { ChallongeApiService } from '../challongeApi/challongeApi.service';
import {
  ITournamentParticipant,
  ITournament
} from '../challongeApi/challongeApi.interface';
import {
  IChallongeTournament,
  IChallongeUser,
  IChallongeMatch
} from './challonge.interface';

import { SomethingNotFoundError } from '../errors';
import { partition } from 'rxjs';

type FindByParams = {
  challongeId?: number;
  challongeUsername?: string;
  tournamentId: number;
};
@Injectable()
export class ChallongeService {
  constructor(private readonly challongeApiService: ChallongeApiService) {}

  public async getMatches(
    tournamentChallongeId: number,
    userChallongeId: number
  ): Promise<IChallongeMatch[]> {
    const matchesResponse = await this.challongeApiService.tournamentMatches({
      tournamentId: tournamentChallongeId,
      participantId: userChallongeId
    });
    return matchesResponse.participant.matches.map(({ match }) => {
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

  public async getTournamentParticipants(
    challongeId: number
  ): Promise<IChallongeUser[]> {
    return (await this.tournamentParticipants(challongeId))
      .filter(partitcipant => partitcipant.challonge_username)
      .map(this.buildChallongeUser);
  }

  public async findUserById(
    challongeId: number,
    tournamentId: number
  ): Promise<IChallongeUser> {
    return this.findBy({ challongeId, tournamentId });
  }

  public async findUser(
    challongeUsername: string,
    tournamentId: number
  ): Promise<IChallongeUser> {
    return this.findBy({ challongeUsername, tournamentId });
  }

  public async getTournament(
    challongeIdAlias: string
  ): Promise<IChallongeTournament> {
    const tournament = (await this.challongeApiService.tournament(
      challongeIdAlias
    )).tournament;
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
    let participant: ITournamentParticipant = null;
    if (findByParams.challongeId) {
      participant = await this.getTournamentParticipant(
        findByParams.challongeId,
        findByParams.tournamentId
      );
      if (!participant)
        throw new SomethingNotFoundError(
          `User with challongeId: ${
            findByParams.challongeId
          } could not be found`
        );
    } else {
      const participants = await this.tournamentParticipants(
        findByParams.tournamentId
      );
      participant = participants.find(
        p => p.username === findByParams.challongeUsername
      );
      if (!participant)
        throw new SomethingNotFoundError(
          `User with challongeUsername: ${
            findByParams.challongeUsername
          } could not be found`
        );
    }

    return this.buildChallongeUser(participant);
  }
  private async getTournamentParticipant(
    participantId: number,
    tournamentId: number | string
  ): Promise<ITournamentParticipant> {
    const participantsResponse = await this.challongeApiService.tournamentParticipant(
      { participantId, tournamentId }
    );
    return participantsResponse.participant;
  }

  private async tournamentParticipants(tournamentId: number | string) {
    const participantsResponse = await this.challongeApiService.tournamentParticipants(
      { tournamentId }
    );
    return participantsResponse.map(p => p.participant);
  }
  private buildChallongeUser(participant: ITournamentParticipant) {
    return {
      ...participant,
      challongeUsername: participant.challonge_username,
      attachedParticipatablePortraitUrl:
        participant.attached_participatable_portrait_url
    };
  }
}
