import { Injectable, Logger } from '@nestjs/common';
import * as API from './challongeApi.interface';
import axios from 'axios';

@Injectable()
export class ChallongeApiService {

  public async tournamentMatches(parameters: API.ITournamentMatchesParameters): Promise<API.IMatchResponse[]> {
    const result = await axios.get(
      this.baseRequestUrl() +
      this.tournamentsRequestPath(parameters.tournamentId) +
      '/matches.json' +
      '?participant_id=' +
      parameters.participantId
    );
    return result.data;
  }
  public async tournamentParticipants(parameters: API.ITournamentParticipantsParameters): Promise<API.ITournamentParticipantResponse[]> {
    const result = await axios.get(this.baseRequestUrl() + this.tournamentsRequestPath(parameters.tournamentId) + '/participants.json');
    return result.data;
  }

  public async tournament(tournamentIdAlias: string): Promise<API.ITournamentResponse> {
    const result = await axios.get(this.baseRequestUrl() + this.tournamentsRequestPath(tournamentIdAlias) + '.json');
    return result.data;
  }

  private tournamentsRequestPath(tournamentId: (string | number)) {
    return `tournaments/${tournamentId}`;
  }

  private baseRequestUrl() {
    return `https://${process.env.CHALLONGE_KEY}@api.challonge.com/v1/`;
  }
}
