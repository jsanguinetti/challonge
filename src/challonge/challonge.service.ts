import { Injectable } from '@nestjs/common';
import { ChallongeApiService } from '../challongeApi/challongeApi.service';
import { ITournamentParticipant, ITournamentParticipantResponse } from '../challongeApi/challongeApi.interface';

@Injectable()
export class ChallongeService {
  constructor(
    private readonly challongeApiService: ChallongeApiService
  ) { }

  public async findUser(challongeUsername: string, tournamentId?: number): Promise<ITournamentParticipant> {
    const tournament = tournamentId ? this.findTournament(tournamentId) : this.latestTournament();
    const participantsResponse = await this.challongeApiService.tournamentParticipants({ tournamentId: tournament });
    const participants: ITournamentParticipant[] = participantsResponse.map((p) => p.participant);
    return participants.find((p) => challongeUsername == p.challonge_username);
  }

  public avatarUrl(challongeUser: ITournamentParticipant) {
    if (challongeUser.attached_participatable_portrait_url.startsWith('//')) {
      return 'https:' + challongeUser.attached_participatable_portrait_url;
    } else {
      return challongeUser.attached_participatable_portrait_url;
    }
  }

  private latestTournament(): string {
    return 'codigodelsur-8a6hscg9';
  }

  private findTournament(tournamentId: number) {
    return this.latestTournament();
  }
}
