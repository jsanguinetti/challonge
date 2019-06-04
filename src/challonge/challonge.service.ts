import { Injectable } from '@nestjs/common';
import { ChallongeApiService } from '../challongeApi/challongeApi.service';
import { ITournamentParticipant, ITournament } from '../challongeApi/challongeApi.interface';
import { IChallongeTournament, IChallongeUser } from './challonge.interface';

@Injectable()
export class ChallongeService {
  constructor(
    private readonly challongeApiService: ChallongeApiService
  ) { }

  public async findUser(challongeUsername: string, tournamentId: number): Promise<IChallongeUser> {
    const participantsResponse = await this.challongeApiService.tournamentParticipants({ tournamentId: tournamentId });
    const participants: ITournamentParticipant[] = participantsResponse.map((p) => p.participant);
    const participant = participants.find((p) => challongeUsername == p.challonge_username);
    return {
      ...participant,
      challongeUsername,
      attachedParticipatablePortraitUrl: participant.attached_participatable_portrait_url,
    };
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
}
